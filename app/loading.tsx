import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <h2 className="text-xl font-medium mt-4">Loading...</h2>
      <p className="text-muted-foreground mt-2">
        Please wait while we prepare your content
      </p>
    </div>
  );
}
