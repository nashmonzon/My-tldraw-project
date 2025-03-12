"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Message } from "ai";

interface AIChatMessageProps {
  message: Message;
}

export function AIChatMessage({ message }: AIChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-3 text-sm",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className={cn("h-8 w-8", isUser ? "bg-primary" : "bg-muted")}>
        <AvatarFallback>{isUser ? "U" : "AI"}</AvatarFallback>
        {!isUser && <AvatarImage src="/ai-avatar.png" alt="AI" />}
      </Avatar>
      <div
        className={cn(
          "rounded-lg px-3 py-2 max-w-[80%]",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
