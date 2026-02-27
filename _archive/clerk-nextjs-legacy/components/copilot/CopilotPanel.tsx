"use client";

import { useEffect, useRef } from "react";
import {
  X,
  Send,
  Loader2,
  CheckCircle,
  XCircle,
  Plus,
  MessageSquare,
  Sparkles,
  Bot,
  Users,
  Briefcase,
  Calendar,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCopilot } from "./CopilotProvider";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export function CopilotPanel() {
  const {
    isOpen,
    isLoading,
    currentConversation,
    pendingAction,
    error,
    closePanel,
    sendMessage,
    confirmAction,
    startNewConversation,
    clearError,
    context,
  } = useCopilot();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput("");
    await sendMessage(message);
  };

  const handleConfirmAction = async (confirmed: boolean) => {
    if (!pendingAction) return;
    await confirmAction(pendingAction.id, confirmed);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 border-l border-border bg-background shadow-2xl flex flex-col h-screen">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Recruit AI</h2>
            <p className="text-xs text-muted-foreground">
              {getContextLabel(context)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={startNewConversation}
            title="New conversation"
            className="h-8 w-8"
          >
            <Plus className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={closePanel} className="h-8 w-8">
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {/* Messages - with constrained height */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-4 p-4">
          {!currentConversation?.messages.length ? (
            <WelcomeScreen onSuggestionClick={sendMessage} />
          ) : (
            currentConversation.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}

          {/* Pending Action Confirmation */}
          {pendingAction && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/50">
              <div className="mb-2 flex items-center gap-2">
                <Bot className="size-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Confirm Action
                </span>
              </div>
              <p className="mb-3 text-sm text-amber-700 dark:text-amber-300">
                {pendingAction.description}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleConfirmAction(true)}
                  disabled={isLoading}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <CheckCircle className="mr-1 size-3" />
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleConfirmAction(false)}
                  disabled={isLoading}
                  className="border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900"
                >
                  <XCircle className="mr-1 size-3" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground px-3 py-2">
              <Loader2 className="size-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/50">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              <Button
                size="sm"
                variant="link"
                onClick={clearError}
                className="h-auto p-0 text-red-600 dark:text-red-400 mt-1"
              >
                Dismiss
              </Button>
            </div>
          )}

          <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border p-4 bg-card">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about candidates, jobs..."
            disabled={isLoading || !!pendingAction}
            className="flex-1 h-10"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="h-10 w-10"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </form>
        <p className="mt-2 text-xs text-muted-foreground">
          Press Enter to send
        </p>
      </div>
    </div>
  );
}

function getContextLabel(context: { currentPage?: string } | null): string {
  if (!context?.currentPage) return "Ready to help";
  const labels: Record<string, string> = {
    dashboard: "On Dashboard",
    candidates: "Viewing Candidates",
    jobs: "Viewing Jobs",
    clients: "Viewing Clients",
    interviews: "Viewing Interviews",
    settings: "In Settings",
  };
  return labels[context.currentPage] || `On ${context.currentPage}`;
}

function WelcomeScreen({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) {
  return (
    <div className="flex flex-col items-center py-6">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
        <Sparkles className="size-7 text-primary" />
      </div>
      <h3 className="mb-1 text-lg font-semibold">Recruit AI Assistant</h3>
      <p className="mb-5 text-center text-sm text-muted-foreground px-4">
        I can help you search, manage, and take actions on your recruitment data.
      </p>
      <div className="w-full space-y-2">
        <QuickSuggestion
          icon={<Users className="size-4" />}
          text="Find candidates"
          onClick={() => onSuggestionClick("Show me all candidates")}
        />
        <QuickSuggestion
          icon={<Briefcase className="size-4" />}
          text="View active jobs"
          onClick={() => onSuggestionClick("Show me active jobs")}
        />
        <QuickSuggestion
          icon={<Calendar className="size-4" />}
          text="Upcoming interviews"
          onClick={() => onSuggestionClick("What interviews do I have coming up?")}
        />
        <QuickSuggestion
          icon={<FileText className="size-4" />}
          text="Dashboard summary"
          onClick={() => onSuggestionClick("Give me a dashboard summary")}
        />
      </div>
    </div>
  );
}

function QuickSuggestion({
  icon,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-left text-sm transition-all hover:bg-muted hover:border-primary/30"
    >
      <span className="text-muted-foreground">{icon}</span>
      <span>{text}</span>
    </button>
  );
}

function MessageBubble({
  message,
}: {
  message: { id: string; role: string; content: string; timestamp: Date };
}) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex flex-col gap-1.5", isUser ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[90%] rounded-2xl px-4 py-2.5 text-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted rounded-bl-md"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="mb-2 list-disc pl-4 last:mb-0">{children}</ul>,
              ol: ({ children }) => <ol className="mb-2 list-decimal pl-4 last:mb-0">{children}</ol>,
              li: ({ children }) => <li className="mb-0.5">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              code: ({ children }) => (
                <code className="rounded bg-background/50 px-1 py-0.5 font-mono text-xs">
                  {children}
                </code>
              ),
              h1: ({ children }) => <h1 className="mb-2 text-lg font-bold">{children}</h1>,
              h2: ({ children }) => <h2 className="mb-2 text-base font-bold">{children}</h2>,
              h3: ({ children }) => <h3 className="mb-1 text-sm font-semibold">{children}</h3>,
              a: ({ href, children }) => (
                <a href={href} className="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
      <span className="text-[10px] text-muted-foreground px-1">
        {message.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
}
