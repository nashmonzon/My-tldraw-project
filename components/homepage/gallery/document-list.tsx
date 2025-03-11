import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { DocumentCard } from "./document-card";
import { FileIcon } from "lucide-react";

interface DocumentListProps {
  documents: any[]; // Ajusta el tipo según tu implementación
  isLoading: boolean;
  error: any; // Ajusta el tipo según tu implementación
  refetch: () => void;
  searchQuery: string;
}

export function DocumentList({
  documents,
  isLoading,
  error,
  refetch,
  searchQuery,
}: DocumentListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading your documents..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Failed to load documents</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/5 dark:bg-muted/10">
        <FileIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {searchQuery ? "No matching documents found" : "No documents yet"}
        </h3>
        <p className="text-muted-foreground mb-4">
          {searchQuery
            ? "Try a different search term or create a new document"
            : "Create your first document to get started"}
        </p>
        <CreateDocumentButton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} />
      ))}
    </div>
  );
}
