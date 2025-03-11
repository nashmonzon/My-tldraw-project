import { PenToolIcon } from "lucide-react";
import { CreateDocumentDialog } from "./document-dialog";
import { DocumentClient } from "@/lib/document-store";

interface HeroSectionProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  newDocTitle: string;
  setNewDocTitle: (title: string) => void;
  handleCreateDocument: () => void;
  createDocument: DocumentClient; // Ajusta el tipo según tu implementación
}

export function HeroSection({
  isDialogOpen,
  setIsDialogOpen,
  newDocTitle,
  setNewDocTitle,
  handleCreateDocument,
  createDocument,
}: HeroSectionProps) {
  return (
    <div className="py-12 px-4 flex-shrink-0">
      <div className="container max-w-5xl mx-auto flex flex-col items-center text-center">
        <div className="mb-6 p-4 rounded-full bg-primary/10 animate-pulse">
          <PenToolIcon className="h-10 w-10 text-primary" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 bg-gradient-to-r from-primary to-primary/70 dark:from-primary dark:to-primary/80 bg-clip-text text-transparent">
          tldraw Editor
        </h1>

        <p className="text-xl text-muted-foreground max-w-[42rem]">
          Create, design, and collaborate with our powerful drawing tool powered
          by tldraw
        </p>

        <CreateDocumentDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          title={newDocTitle}
          setTitle={setNewDocTitle}
          onSubmit={handleCreateDocument}
          isPending={createDocument.isPending}
        />
      </div>
    </div>
  );
}
