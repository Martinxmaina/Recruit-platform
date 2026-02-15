"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type {
  CopilotContext,
  CopilotMessage,
  CopilotConversation,
  CopilotAction,
} from "@/lib/copilot/types";

interface CopilotState {
  isOpen: boolean;
  isLoading: boolean;
  conversations: CopilotConversation[];
  currentConversation: CopilotConversation | null;
  context: CopilotContext | null;
  pendingAction: CopilotAction | null;
  error: string | null;
}

interface CopilotActions {
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  sendMessage: (content: string) => Promise<void>;
  confirmAction: (actionId: string, confirmed: boolean) => Promise<void>;
  startNewConversation: () => void;
  selectConversation: (conversationId: string) => void;
  clearError: () => void;
}

type CopilotStore = CopilotState & CopilotActions;

const CopilotContext = createContext<CopilotStore | null>(null);

interface CopilotProviderProps {
  children: ReactNode;
  organizationId: string;
  userId: string;
  userRole: "admin" | "recruiter" | "client";
}

export function CopilotProvider({
  children,
  organizationId,
  userId,
  userRole,
}: CopilotProviderProps) {
  const pathname = usePathname();
  const [state, setState] = useState<CopilotState>({
    isOpen: false,
    isLoading: false,
    conversations: [],
    currentConversation: null,
    context: null,
    pendingAction: null,
    error: null,
  });

  // Parse current page context from pathname
  const parsePageContext = useCallback(
    (path: string): CopilotContext => {
      const segments = path.split("/").filter(Boolean);

      // Default context
      let entityType: CopilotContext["entityType"] = undefined;
      let entityId: CopilotContext["entityId"] = undefined;

      // Parse path to determine context
      // Examples: /candidates/123, /jobs/456, /dashboard
      if (segments.length >= 2) {
        const [type, id] = segments;
        if (
          ["candidates", "jobs", "clients", "applications", "interviews"].includes(type)
        ) {
          entityType = type.slice(0, -1) as CopilotContext["entityType"];
          if (type === "applications") entityType = "application";
          entityId = id;
        }
      }

      return {
        currentPage: segments[0] || "dashboard",
        currentPath: path,
        entityId,
        entityType,
        organizationId,
        userId,
        userRole,
      };
    },
    [organizationId, userId, userRole]
  );

  // Update context when path changes
  useEffect(() => {
    const context = parsePageContext(pathname);
    setState((prev) => ({ ...prev, context }));
  }, [pathname, parsePageContext]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await fetch("/api/copilot/conversations");
      if (response.ok) {
        const data = await response.json();
        setState((prev) => ({ ...prev, conversations: data.conversations || [] }));
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const openPanel = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: true }));
  }, []);

  const closePanel = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const togglePanel = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const startNewConversation = useCallback(() => {
    const newConversation: CopilotConversation = {
      id: `temp-${Date.now()}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setState((prev) => ({
      ...prev,
      currentConversation: newConversation,
      pendingAction: null,
      error: null,
    }));
  }, []);

  const selectConversation = useCallback((conversationId: string) => {
    setState((prev) => {
      const conversation = prev.conversations.find((c) => c.id === conversationId);
      return {
        ...prev,
        currentConversation: conversation || null,
        pendingAction: null,
        error: null,
      };
    });
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!state.context) return;

    const userMessage: CopilotMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    // Add user message to conversation
    setState((prev) => {
      const currentConv = prev.currentConversation || {
        id: `temp-${Date.now()}`,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        ...prev,
        isLoading: true,
        error: null,
        currentConversation: {
          ...currentConv,
          messages: [...currentConv.messages, userMessage],
          updatedAt: new Date(),
        },
      };
    });

    try {
      const response = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationId: state.currentConversation?.id?.startsWith("temp-")
            ? undefined
            : state.currentConversation?.id,
          context: state.context,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from copilot");
      }

      const data = await response.json();

      const assistantMessage: CopilotMessage = {
        id: `msg-${Date.now()}-response`,
        role: "assistant",
        content: data.message.content,
        timestamp: new Date(),
        actions: data.message.actions,
        metadata: data.message.metadata,
      };

      setState((prev) => {
        const currentConv = prev.currentConversation!;
        return {
          ...prev,
          isLoading: false,
          currentConversation: {
            ...currentConv,
            id: data.conversationId || currentConv.id,
            messages: [...currentConv.messages, assistantMessage],
            updatedAt: new Date(),
          },
          pendingAction: data.pendingAction || null,
        };
      });
    } catch (error) {
      console.error("Copilot error:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to get response. Please try again.",
      }));
    }
  }, [state.context, state.currentConversation]);

  const confirmAction = useCallback(
    async (actionId: string, confirmed: boolean) => {
      if (!state.currentConversation) return;

      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const response = await fetch("/api/copilot/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionId,
            conversationId: state.currentConversation!.id,
            confirmed,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to execute action");
        }

        const data = await response.json();

        // Add result message
        const resultMessage: CopilotMessage = {
          id: `msg-${Date.now()}-result`,
          role: "assistant",
          content: data.message || (confirmed ? "Action completed successfully." : "Action cancelled."),
          timestamp: new Date(),
        };

        setState((prev) => {
          const currentConv = prev.currentConversation!;
          return {
            ...prev,
            isLoading: false,
            currentConversation: {
              ...currentConv,
              messages: [...currentConv.messages, resultMessage],
              updatedAt: new Date(),
            },
            pendingAction: null,
          };
        });
      } catch (error) {
        console.error("Action execution error:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to execute action. Please try again.",
          pendingAction: null,
        }));
      }
    },
    [state.currentConversation]
  );

  const store: CopilotStore = {
    ...state,
    openPanel,
    closePanel,
    togglePanel,
    sendMessage,
    confirmAction,
    startNewConversation,
    selectConversation,
    clearError,
  };

  return (
    <CopilotContext.Provider value={store}>
      {children}
    </CopilotContext.Provider>
  );
}

export function useCopilot(): CopilotStore {
  const context = useContext(CopilotContext);
  if (!context) {
    throw new Error("useCopilot must be used within a CopilotProvider");
  }
  return context;
}
