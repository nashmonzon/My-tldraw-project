import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon, Search } from "lucide-react";
import { DocumentList } from "./document-list";
import { DocumentClient } from "@/lib/document-store";
import { TRPCClientErrorLike } from "@trpc/client";
import { DefaultErrorShape } from "@trpc/server/unstable-core-do-not-import";

interface DocumentGalleryProps {
  documents: DocumentClient[];
  filteredDocuments: DocumentClient[];
  recentDocuments: DocumentClient[];
  isLoading: boolean;
  error: TRPCClientErrorLike<{
    errorShape: DefaultErrorShape;
    transformer: false;
  }> | null;
  refetch: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export function DocumentGallery({
  documents,
  filteredDocuments,
  recentDocuments,
  isLoading,
  error,
  refetch,
  searchQuery,
  setSearchQuery,
  isDialogOpen,
  setIsDialogOpen,
}: DocumentGalleryProps) {
  return (
    <div className="container max-w-6xl mx-auto py-6 px-4 flex-grow flex flex-col">
      <Card className="flex-grow flex flex-col overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Your Documents</h2>
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
          </div>
        </div>

        <Tabs defaultValue="all" className="flex-grow flex flex-col">
          <div className="px-6 pt-4 border-b">
            <TabsList>
              <TabsTrigger value="all">All Documents</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-grow flex flex-col overflow-hidden">
            <TabsContent
              value="all"
              className="flex-grow flex flex-col p-0 m-0 h-full"
            >
              <ScrollArea className="h-[calc(100vh-320px)] min-h-[400px] dark:bg-zinc-900">
                <div className="p-6">
                  <DocumentList
                    documents={filteredDocuments}
                    isLoading={isLoading}
                    error={error}
                    refetch={refetch}
                    searchQuery={searchQuery}
                  />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent
              value="recent"
              className="flex-grow flex flex-col p-0 m-0 h-full"
            >
              <ScrollArea className="h-[calc(100vh-320px)] min-h-[400px] dark:bg-zinc-900">
                <div className="p-6">
                  <DocumentList
                    documents={recentDocuments.slice(0, 6)}
                    isLoading={isLoading}
                    error={error}
                    refetch={refetch}
                    searchQuery={searchQuery}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
