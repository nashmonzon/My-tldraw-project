import { TabsContent } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";

import { Clock } from "lucide-react";

import { DocumentClient } from "@/lib/document-store";
import { DocumentCardSkeleton } from "../skeleton/card-skeleton";
import { DocumentCard } from "./document-card";

export const RecentDocuments = ({
  documents,
  isLoading,
}: {
  documents: DocumentClient[];
  isLoading: boolean;
}) => {
  return (
    <TabsContent
      value="recent"
      className="flex-grow flex flex-col p-0 m-0 h-full"
    >
      <ScrollArea className="h-[calc(100vh-320px)] min-h-[400px]">
        <div className="p-6">
          {isLoading ? (
            <DocumentCardSkeleton />
          ) : documents && documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.slice(0, 6).map((doc) => (
                <DocumentCard
                  key={doc.id}
                  title={doc.title}
                  updatedAt={doc.updatedAt}
                  href={`/editor/${doc.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/5 dark:bg-muted/10">
              <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No recent documents</h3>
              <p className="text-muted-foreground mb-4">
                Your recently edited documents will appear here
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </TabsContent>
  );
};
