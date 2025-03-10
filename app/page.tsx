import { Suspense } from "react";
import EditorPage from "@/components/editor-page";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Suspense fallback={<Skeleton className="h-screen w-full" />}>
        <EditorPage />
      </Suspense>
    </main>
  );
}
