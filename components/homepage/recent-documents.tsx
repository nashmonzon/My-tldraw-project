import { TabsContent } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Clock, FileIcon } from "lucide-react";
import { DateTime } from "luxon";
import { DocumentClient } from "@/lib/document-store";
import { DocumentCardSkeleton } from "../skeleton/card-skeleton";

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
      <ScrollArea className="h-[calc(100vh-320px)] min-h-[400px] dark:bg-zinc-900">
        <div className="p-6">
          {isLoading ? (
            <DocumentCardSkeleton />
          ) : documents && documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.slice(0, 6).map((doc) => (
                <Link
                  href={`/editor/${doc.id}`}
                  key={doc.id}
                  className="block group"
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/10 hover:-translate-y-1 border-border/50 overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="group-hover:text-primary transition-colors line-clamp-1">
                        {doc.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {DateTime.fromISO(doc.updatedAt).toRelative()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center py-8">
                      <div className="relative group-hover:scale-110 transition-transform duration-300">
                        <div className="absolute inset-0 bg-primary/10 dark:bg-primary/5 rounded-full blur-xl"></div>
                        <FileIcon className="h-16 w-16 text-primary relative z-10" />
                      </div>
                    </CardContent>
                    <CardFooter className="text-sm text-muted-foreground bg-muted/30 dark:bg-muted/10 py-2">
                      Click to open in editor
                    </CardFooter>
                  </Card>
                </Link>
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
