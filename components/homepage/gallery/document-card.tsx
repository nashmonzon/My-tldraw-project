import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DocumentClient } from "@/lib/document-store";
import { Clock, FileIcon } from "lucide-react";
import { DateTime } from "luxon";
import Link from "next/link";

interface DocumentCardProps {
  document: DocumentClient; // Ajusta el tipo según tu implementación
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Link href={`/editor/${document.id}`} className="block group">
      <Card className="h-full transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/10 hover:-translate-y-1 border-border/50 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="group-hover:text-primary transition-colors line-clamp-1">
            {document.title}
          </CardTitle>
          <CardDescription className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {DateTime.fromISO(document.updatedAt).toRelative()}
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
  );
}
