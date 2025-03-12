"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Loader2, Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { AIChatMessage } from "./ai-chat-message";

interface AIChatPanelProps {
  isOpen: boolean;
}

export function AIChatPanel({ isOpen }: AIChatPanelProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/chat",
    });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll al final cuando los mensajes cambian
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  return (
    <Card className="h-[500px] rounded-b-none rounded-t-lg border shadow-xl flex flex-col">
      <CardHeader className="px-4 py-3 border-b flex-shrink-0">
        <CardTitle className="text-lg font-medium">AI Assistant</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0 relative overflow-hidden">
        <ScrollArea className="h-full">
          {error && (
            <div className="m-2 sticky top-0 z-10 p-4 rounded-md bg-red-100 border border-red-400 dark:bg-red-900/30 dark:border-red-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {error.message.includes("Failed to fetch")
                    ? "Unable to connect to the server. Please check your internet connection."
                    : "An error occurred while processing your request. Please try again."}
                </p>
              </div>
            </div>
          )}

          {/* Mensajes */}
          <div className="p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-6">
                <p>How can I help you with your drawing project?</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <AIChatMessage key={index} message={message} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-3 border-t flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Ask something..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
