"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  FileIcon,
  PlusIcon,
  PenToolIcon,
  Loader2,
  Search,
  Clock,
} from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { LoadingSpinner } from "@/components/loading-spinner";
import { toast } from "sonner";
import { DateTime } from "luxon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HomePageProps {
  initialDocuments: any[];
}

export default function HomePage({ initialDocuments }: HomePageProps) {
  const [newDocTitle, setNewDocTitle] = useState("Untitled Document");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const {
    data: documents,
    isLoading,
    error,
    refetch,
  } = trpc.document.getDocuments.useQuery(undefined, {
    refetchOnWindowFocus: false,
    initialData: initialDocuments,
  });

  const createDocument = trpc.document.createDocument.useMutation({
    onSuccess: (data) => {
      toast.success("Document created", {
        description: `"${data.title}" has been created successfully.`,
      });
      setIsDialogOpen(false);
      refetch().then(() => {
        router.push(`/editor/${data.id}`);
      });
    },
    onError: (error) => {
      toast.error("Failed to create document", {
        description: error.message,
      });
    },
  });

  const handleCreateDocument = () => {
    createDocument.mutate({ title: newDocTitle || "Untitled Document" });
  };

  const filteredDocuments = documents?.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentDocuments = [...(filteredDocuments || [])].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 flex flex-col">
      {/* Hero section */}
      <div className="py-12 px-4 flex-shrink-0">
        <div className="container max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="mb-6 p-4 rounded-full bg-primary/10 animate-pulse">
            <PenToolIcon className="h-10 w-10 text-primary" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 bg-gradient-to-r from-primary to-primary/70 dark:from-primary dark:to-primary/80 bg-clip-text text-transparent">
            tldraw Editor
          </h1>

          <p className="text-xl text-muted-foreground max-w-[42rem] ">
            Create, design, and collaborate with our powerful drawing tool
            powered by tldraw
          </p>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
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
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Documents gallery */}
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
                    {isLoading ? (
                      <div className="flex justify-center py-12">
                        <LoadingSpinner
                          size="lg"
                          text="Loading your documents..."
                        />
                      </div>
                    ) : error ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">
                          Failed to load documents
                        </p>
                        <Button onClick={() => refetch()} variant="outline">
                          Try Again
                        </Button>
                      </div>
                    ) : filteredDocuments && filteredDocuments.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDocuments.map((doc) => (
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
                        <Dialog
                          open={isDialogOpen}
                          onOpenChange={setIsDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button>
                              <PlusIcon className="mr-2 h-4 w-4" />
                              Create Document
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent
                value="recent"
                className="flex-grow flex flex-col p-0 m-0 h-full"
              >
                <ScrollArea className="h-[calc(100vh-320px)] min-h-[400px] dark:bg-zinc-900">
                  <div className="p-6">
                    {isLoading ? (
                      <div className="flex justify-center py-12">
                        <LoadingSpinner
                          size="lg"
                          text="Loading your documents..."
                        />
                      </div>
                    ) : recentDocuments && recentDocuments.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentDocuments.slice(0, 6).map((doc) => (
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
                        <h3 className="text-lg font-medium mb-2">
                          No recent documents
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Your recently edited documents will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
