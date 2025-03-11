import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function DocumentCardSkeleton() {
  return (
    <Card className="h-full transition-all duration-300 border-border/50 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">
          <Skeleton className="h-6 w-3/4" />
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl"></div>
          <Skeleton className="h-16 w-16 rounded-full relative z-10" />
        </div>
      </CardContent>
      <CardFooter className="text-sm bg-muted/30 dark:bg-muted/10 py-2">
        <Skeleton className="h-4 w-36" />
      </CardFooter>
    </Card>
  );
}
