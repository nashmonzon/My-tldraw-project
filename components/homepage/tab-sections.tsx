import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentClient } from "@/lib/document-store";
import { DocumentList } from "./document-list";
import { RecentDocuments } from "./recent-documents";

interface TabSectionsProps extends TabContentProps {
  defaultTab?: string;
}

export interface TabContentProps {
  documents: DocumentClient[];
  filteredDocuments: DocumentClient[];
  recentDocuments: DocumentClient[];
  isLoading: boolean;
  searchQuery: string;
}

export function TabSections({
  defaultTab = "all",
  ...props
}: TabSectionsProps) {
  return (
    <Tabs defaultValue={defaultTab} className="flex-grow flex flex-col">
      <div className="px-6 pt-4 border-b">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
      </div>

      <div className="flex-grow flex flex-col overflow-hidden">
        {["all", "recent"].map((tabValue) => (
          <TabsContent
            key={tabValue}
            value={tabValue}
            className="flex-grow flex flex-col p-0 m-0 h-full"
          >
            <ScrollArea className="h-[calc(100vh-320px)] min-h-[400px] dark:bg-zinc-900">
              <div className="p-6">{getTabContent(tabValue, props)}</div>
            </ScrollArea>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}

const getTabContent = (
  value: string,
  props: TabContentProps
): React.ReactNode => {
  const contents: Record<string, React.ReactNode> = {
    all: (
      <DocumentList
        documents={props.filteredDocuments}
        isLoading={props.isLoading}
        searchQuery={props.searchQuery}
      />
    ),
    recent: (
      <RecentDocuments
        documents={props.recentDocuments.slice(0, 6)}
        isLoading={props.isLoading}
      />
    ),
  };

  return contents[value] ?? null;
};
