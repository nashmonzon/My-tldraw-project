import { Clock, FileIcon, Trash2, Edit } from "lucide-react";
import { DateTime } from "luxon";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";

interface DocumentCardProps {
  title: string;
  updatedAt: string;
  href: string;
}

export const DocumentCard = ({ title, updatedAt, href }: DocumentCardProps) => {
  return (
    <Link href={href} className="block group">
      <Card className="h-full transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/20 hover:-translate-y-2 border-border/50 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="pb-2">
          <CardTitle className="group-hover:text-primary transition-colors line-clamp-1 text-lg font-semibold">
            {title}
          </CardTitle>
          <CardDescription className="flex items-center gap-1 text-sm text-muted-foreground/80">
            <Clock className="h-3 w-3" />
            {DateTime.fromISO(updatedAt).toRelative()}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="relative group-hover:scale-110 transition-transform duration-300">
            <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
            <FileIcon className="h-16 w-16 text-primary relative z-10" />
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground bg-muted/30 dark:bg-muted/20 py-3 border-t border-border/50">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
