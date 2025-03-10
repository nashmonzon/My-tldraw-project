"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Tldraw, type TLEventMapHandler } from "tldraw";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Square, Palette } from "lucide-react";
import { toast } from "sonner";
import "tldraw/tldraw.css";

export default function EditorPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editorRef, setEditorRef] = useState<any | null>(null);
  const [hasSelection, setHasSelection] = useState(false);

  const lastEventRef = useRef<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);
  const shouldSaveRef = useRef(false);

  const { isLoading: isLoadingData, data: documentData } =
    trpc.document.getDocument.useQuery(undefined);

  const saveDocument = trpc.document.saveDocument.useMutation({
    onSuccess: () => {
      toast.success("Document saved", {
        description: "Your changes have been saved successfully.",
      });
      setIsSaving(false);
    },
    onError: (error) => {
      toast.error("Error saving document", {
        description: error.message,
      });
      setIsSaving(false);
    },
  });

  const handleSave = useCallback(() => {
    if (editorRef) {
      setIsSaving(true);
      const snapshot = editorRef.store.getSnapshot();
      saveDocument.mutate(snapshot);
    }
  }, [editorRef, saveDocument]);

  const addSquare = useCallback(() => {
    if (editorRef) {
      editorRef.createShapes([
        {
          type: "geo",
          x: 100 + Math.random() * 100,
          y: 100 + Math.random() * 100,
          props: {
            geo: "rectangle",
            w: 100,
            h: 100,
            color: "blue",
          },
        },
      ]);
    }
  }, [editorRef]);

  const modifySelectedShape = useCallback(() => {
    if (!editorRef) return;

    const selectedShapeIds = editorRef.getSelectedShapeIds();

    if (selectedShapeIds.length === 0) {
      toast.error("No shape selected", {
        description: "Please select a shape to modify.",
      });
      return;
    }

    const colors = [
      "blue",
      "green",
      "red",
      "yellow",
      "violet",
      "orange",
      "black",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    selectedShapeIds.forEach((id: string) => {
      const shape = editorRef.getShape(id);
      if (shape) {
        if (shape.type === "geo") {
          editorRef.updateShapes([
            {
              id,
              type: "geo",
              props: {
                ...shape.props,
                color: randomColor,
                w: shape.props.w * (0.8 + Math.random() * 0.4),
                h: shape.props.h * (0.8 + Math.random() * 0.4),
              },
            },
          ]);
        } else if (shape.type === "draw") {
          editorRef.updateShapes([
            {
              id,
              type: "draw",
              props: {
                ...shape.props,
                color: randomColor,
              },
            },
          ]);
        } else {
          editorRef.updateShapes([
            {
              id,
              type: shape.type,
              props: {
                ...shape.props,
                color: randomColor,
              },
            },
          ]);
        }
      }
    });

    toast.success("Shape modified", {
      description: `Modified ${selectedShapeIds.length} shape(s).`,
    });
  }, [editorRef]);

  useEffect(() => {
    if (!isLoadingData && isLoading) {
      setIsLoading(false);
      toast.success("Document loaded", {
        description: "Your document has been loaded successfully.",
      });
    }
  }, [isLoadingData, isLoading]);

  useEffect(() => {
    if (editorRef && documentData && !isLoading && isInitialLoadRef.current) {
      try {
        editorRef.store.loadSnapshot(documentData);
        isInitialLoadRef.current = false;
      } catch (error) {
        console.error("Error loading document data:", error);
        toast.error("Error loading document", {
          description: "Could not load the document data.",
        });
      }
    }
  }, [editorRef, documentData, isLoading]);
  useEffect(() => {
    if (!editorRef) return;

    const handleChange: TLEventMapHandler<"change"> = (change) => {
      const { added, updated, removed } = change.changes;

      let hasChanges = false;
      let changeType = "";

      if (Object.keys(added).length > 0) {
        Object.values(added).forEach((record: any) => {
          if (record.typeName === "shape") {
            hasChanges = true;
            changeType = `created shape (${record.type})`;
          }
        });
      }

      if (Object.keys(updated).length > 0) {
        Object.values(updated).forEach(([from, to]: any) => {
          if (from.id.startsWith("shape") && to.id.startsWith("shape")) {
            hasChanges = true;
            changeType = `updated shape`;
          }
        });
      }

      if (Object.keys(removed).length > 0) {
        Object.values(removed).forEach((record: any) => {
          if (record.typeName === "shape") {
            hasChanges = true;
            changeType = `deleted shape (${record.type})`;
          }
        });
      }

      const hasSelectedShapes = editorRef.getSelectedShapeIds().length > 0;
      setHasSelection(hasSelectedShapes);

      if (hasChanges) {
        lastEventRef.current = changeType;
        shouldSaveRef.current = true;

        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
          if (shouldSaveRef.current && editorRef) {
            setIsSaving(true);
            const snapshot = editorRef.store.getSnapshot();
            saveDocument.mutate(snapshot);
            console.log("Enviando al backend:", lastEventRef.current);
            shouldSaveRef.current = false;
          }
        }, 1500);
      }
    };

    const unsubscribe = editorRef.store.listen(handleChange, {
      source: "user",
      scope: "all",
    });

    return () => {
      unsubscribe();
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [editorRef, saveDocument]);

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex justify-between items-center p-2 border-b bg-background z-10">
        <h1 className="text-xl font-bold">tldraw Editor</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={addSquare}
            className="flex items-center gap-2"
          >
            <Square className="h-4 w-4" />
            Add Square
          </Button>
          <Button
            variant="outline"
            onClick={modifySelectedShape}
            disabled={!hasSelection}
            className="flex items-center gap-2"
          >
            <Palette className="h-4 w-4" />
            Modify Shape
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </Button>
        </div>
      </div>

      <div className="flex-1 relative">
        {isLoadingData ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : null}

        <Tldraw
          persistenceKey="tldraw-document"
          onMount={(editor) => setEditorRef(editor)}
        />
      </div>
    </div>
  );
}
