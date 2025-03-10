import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, PenToolIcon } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-4xl px-4 py-16 flex flex-col items-center text-center">
        <div className="mb-8 p-4 rounded-full bg-primary/10">
          <PenToolIcon className="h-12 w-12 text-primary" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          tldraw Editor
        </h1>

        <p className="text-xl text-muted-foreground max-w-[42rem] mb-8">
          Create, design, and collaborate with our powerful drawing tool powered
          by tldraw
        </p>

        <Link href="/editor">
          <Button size="lg" className="group">
            Open Editor
            <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>

        <div className="mt-16 relative w-full max-w-3xl aspect-video rounded-lg overflow-hidden border shadow-xl">
          <div className="absolute inset-0 bg-muted/20 backdrop-blur-sm flex items-center justify-center">
            <img
              src="https://sjc.microlink.io/hTX8sYh4hhlePUChRU8IEH2fMFnWmLWHE3LvJ1qupZ6tKENJJiRVN4SH6YhorQJsZrkYaMpls7RoCd8XAmgQUQ.jpeg"
              alt="tldraw Editor Preview"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
            <Link
              href="/editor"
              className="absolute inset-0 flex items-center justify-center"
            >
              <Button variant="secondary" size="lg" className="shadow-lg">
                Start Drawing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
