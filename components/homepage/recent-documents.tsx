import { TabsContent } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Clock } from "lucide-react";
import { Document } from "@/lib/document-store";
import { DocumentCardSkeleton } from "../skeleton/card-skeleton";
import { DocumentCard } from "./document-card";

export const RecentDocuments = ({
  documents,
  isLoading,
}: {
  documents: Document[];
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
                  id={doc.id}
                  title={doc.title}
                  updatedAt={doc.updatedAt}
                  href={`/editor/${doc.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/10 dark:bg-muted/20">
              <div className="flex flex-col items-center justify-center gap-4">
                <Clock className="h-16 w-16 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold text-foreground">
                  No recent documents
                </h3>
                <p className="text-muted-foreground max-w-md text-center">
                  Your recently edited documents will appear here. Start by
                  creating a new document or editing an existing one.
                </p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </TabsContent>
  );
};
