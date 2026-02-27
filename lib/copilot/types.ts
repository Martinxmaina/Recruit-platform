// Types for the AI Copilot system

export type CopilotRole = 'admin' | 'recruiter' | 'client';

export interface CopilotContext {
  currentPage: string;
  currentPath: string;
  entityId?: string;
  entityType?: 'candidate' | 'job' | 'client' | 'application' | 'interview';
  organizationId: string;
  userId: string;
  userRole: CopilotRole;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  actions?: CopilotAction[];
  metadata?: {
    toolUsed?: string;
    entitiesReferenced?: EntityReference[];
    confidence?: number;
  };
}

export interface EntityReference {
  id: string;
  type: 'candidate' | 'job' | 'client' | 'application' | 'interview';
  name: string;
}

export interface CopilotAction {
  id: string;
  type: 'navigate' | 'create' | 'update' | 'delete' | 'query';
  label: string;
  description: string;
  status: 'pending' | 'confirmed' | 'executed' | 'failed';
  requiresConfirmation: boolean;
  params?: Record<string, unknown>;
  result?: unknown;
}

export interface CopilotConversation {
  id: string;
  title?: string;
  messages: CopilotMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Tool definitions for the LangGraph agent
export type ToolName =
  | 'search_candidates'
  | 'get_candidate'
  | 'create_candidate'
  | 'update_candidate'
  | 'search_jobs'
  | 'get_job'
  | 'create_job'
  | 'update_job'
  | 'search_applications'
  | 'update_application_stage'
  | 'schedule_interview'
  | 'get_upcoming_interviews'
  | 'search_clients'
  | 'get_client'
  | 'add_note'
  | 'get_dashboard_stats';

export interface ToolDefinition {
  name: ToolName;
  description: string;
  parameters: JSONSchema;
  required: string[];
  permission?: CopilotRole[];
}

interface JSONSchema {
  type: 'object';
  properties: Record<string, {
    type: string;
    description: string;
    enum?: string[];
  }>;
}

// Agent state for LangGraph
export interface AgentState {
  messages: CopilotMessage[];
  context: CopilotContext;
  currentTool?: ToolName;
  toolArgs?: Record<string, unknown>;
  pendingAction?: CopilotAction;
  requiresConfirmation: boolean;
  error?: string;
}

// API request/response types
export interface CopilotChatRequest {
  message: string;
  conversationId?: string;
  context: CopilotContext;
}

export interface CopilotChatResponse {
  message: CopilotMessage;
  conversationId: string;
  requiresConfirmation?: boolean;
  pendingAction?: CopilotAction;
}

export interface ExecuteActionRequest {
  actionId: string;
  conversationId: string;
  confirmed: boolean;
}

export interface ExecuteActionResponse {
  success: boolean;
  result?: unknown;
  message?: string;
}
