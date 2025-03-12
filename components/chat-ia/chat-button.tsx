"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import { AIChatPanel } from "./ai-chat-panel";
import { cn } from "@/lib/utils";

export function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-4 rounded-full p-3 shadow-lg transition-all duration-300 z-50",
          isOpen
            ? "bg-destructive hover:bg-destructive/90"
            : "bg-primary hover:bg-primary/90"
        )}
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </Button>

      <div
        className={cn(
          "fixed bottom-0 right-0 z-40 w-full sm:w-[400px] transition-transform duration-300 ease-in-out",
          isOpen ? "translate-y-[-110px]" : "translate-y-full"
        )}
      >
        <AIChatPanel isOpen={isOpen} />
      </div>
    </>
  );
}
