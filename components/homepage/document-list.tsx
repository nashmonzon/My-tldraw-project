import { DocumentClient } from "@/lib/document-store";
import { TabsContent } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";

import { FileIcon } from "lucide-react";

import { DocumentCardSkeleton } from "../skeleton/card-skeleton";
import { DocumentCard } from "./document-card";

export const DocumentList = ({
  documents,
  isLoading,
  searchQuery,
}: {
  documents: DocumentClient[];
  isLoading: boolean;
  searchQuery: string;
}) => {
  return (
    <TabsContent value="all" className="flex-grow flex flex-col p-0 m-0 h-full">
      <ScrollArea className="h-[calc(100vh-320px)] min-h-[400px] ">
        <div className="p-6">
          {documents && documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <>
                  {isLoading ? (
                    <DocumentCardSkeleton />
                  ) : (
                    <DocumentCard
                      key={doc.id}
                      title={doc.title}
                      updatedAt={doc.updatedAt}
                      href={`/editor/${doc.id}`}
                    />
                  )}
                </>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/5 dark:bg-muted/10">
              <FileIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery
                  ? "No matching documents found"
                  : "No documents yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try a different search term or create a new document"
                  : "Create your first document to get started"}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </TabsContent>
  );
};
