"use client";

import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopilot } from "./CopilotProvider";
import { cn } from "@/lib/utils";

interface CopilotButtonProps {
  className?: string;
}

export function CopilotButton({ className }: CopilotButtonProps) {
  const { isOpen, togglePanel, isLoading, pendingAction } = useCopilot();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={togglePanel}
      className={cn(
        "relative",
        isOpen && "bg-primary/10 text-primary",
        className
      )}
      title="Open Recruit AI"
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Sparkles className="size-4" />
      )}
      {pendingAction && !isOpen && (
        <span className="absolute -right-1 -top-1 flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex size-3 rounded-full bg-amber-500" />
        </span>
      )}
    </Button>
  );
}
