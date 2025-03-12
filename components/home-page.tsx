"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PlusIcon,
  PenToolIcon,
  Loader2,
  Search,
  FileIcon,
  Trash2,
} from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { Document } from "@/lib/document-store";
import { Card } from "./ui/card";
import { TabSections } from "./homepage/tab-sections";
import { useRouter } from "next/navigation";

interface HomePageProps {
  initialDocuments: Document[];
}

export default function HomePage({ initialDocuments }: HomePageProps) {
  const [newDocTitle, setNewDocTitle] = useState("Untitled Document");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    data: documents,
    isLoading,
    refetch,
  } = trpc.document.getDocuments.useQuery(undefined, {
    refetchOnWindowFocus: false,
    initialData: initialDocuments,
  });

  const createDocument = trpc.document.createDocument.useMutation({
    onSuccess: async (data) => {
      setIsRedirecting(true);
      toast.success("Document created", {
        description: `"${data.title}" has been created successfully. Redirecting...`,
      });
      setIsDialogOpen(false);

      try {
        await refetch();
        await router.push(`/editor/${data.id}`);
      } catch (error) {
        console.error("Error redirecting to editor", error);
        toast.error("Error redirecting to editor");
        setIsRedirecting(false);
      }
    },
    onError: (error) => {
      toast.error("Failed to create document", {
        description: error.message,
      });
    },
  });

  const deleteAllDocuments = trpc.document.deleteAllDocuments.useMutation({
    onSuccess: () => {
      toast.success("All documents deleted");
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to delete all documents", {
        description: error.message,
      });
    },
  });

  const handleCreateDocument = () => {
    createDocument.mutate({ title: newDocTitle || "Untitled Document" });
  };

  const handleDeleteAllDocuments = () => {
    deleteAllDocuments.mutate();
  };

  const filteredDocuments = documents?.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentDocuments = [...(filteredDocuments || [])].sort(
    (a, b) =>
      new Date(b.updatedAt || "").getTime() -
      new Date(a.updatedAt || "").getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 flex flex-col">
      <div className="py-12 px-4 flex-shrink-0">
        <div className="container max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="mb-6 p-4 rounded-full bg-primary/10 animate-pulse">
            <PenToolIcon className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 bg-gradient-to-r from-primary to-primary/70 dark:from-primary dark:to-primary/80 bg-clip-text text-transparent">
            tldraw Editor
          </h1>
          <p className="text-xl text-muted-foreground max-w-[42rem]">
            Create, design, and collaborate with our powerful drawing tool
            powered by tldraw
          </p>
          <CreateDocumentDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            newDocTitle={newDocTitle}
            setNewDocTitle={setNewDocTitle}
            handleCreateDocument={handleCreateDocument}
            createDocument={createDocument}
            isRedirecting={isRedirecting}
          />
        </div>
      </div>

      <div className="container max-w-6xl mx-auto py-6 px-4 flex-grow flex flex-col">
        <Card className="flex-grow flex flex-col overflow-hidden">
          <div className="p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileIcon className="h-6 w-6" />
                Your Documents
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {documents?.length || 0} documents available
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="pl-9 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="whitespace-nowrap">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    New Document
                  </Button>
                </DialogTrigger>
              </Dialog>
              <Button
                variant="destructive"
                onClick={handleDeleteAllDocuments}
                disabled={deleteAllDocuments.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All
              </Button>
            </div>
          </div>

          <TabSections
            documents={documents}
            filteredDocuments={filteredDocuments}
            recentDocuments={recentDocuments}
            isLoading={isLoading}
            searchQuery={searchQuery}
          />
        </Card>
      </div>
    </div>
  );
}
const CreateDocumentDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  newDocTitle,
  setNewDocTitle,
  handleCreateDocument,
  createDocument,
  isRedirecting,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  newDocTitle: string;
  setNewDocTitle: (title: string) => void;
  handleCreateDocument: () => void;
  createDocument: { isPending: boolean };
  isRedirecting: boolean;
}) => {
  return (
    <Dialog open={isDialogOpen || isRedirecting} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        {isRedirecting ? (
          <div className="flex flex-col items-center justify-center p-8 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Redirecting to editor...</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create New Document</DialogTitle>
              <DialogDescription>
                Give your document a title to get started.
              </DialogDescription>
            </DialogHeader>
            <Input
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              placeholder="Document title"
              className="my-4"
            />
            <DialogFooter>
              <Button
                onClick={handleCreateDocument}
                disabled={createDocument.isPending}
                className="w-full sm:w-auto"
              >
                {createDocument.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Document"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
