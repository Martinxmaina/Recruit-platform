import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { copilotTools } from "./llm-service";

// System prompt for the recruitment assistant
const SYSTEM_PROMPT = `You are an AI assistant for a recruitment platform called "Recruit AI". You help recruiters and hiring managers manage candidates, jobs, applications, and interviews.

## Your Capabilities:
- Search and view candidates, jobs, clients, and applications
- Get dashboard statistics and upcoming interviews
- Add notes to candidates, jobs, or clients
- Update application stages in the hiring pipeline
- Schedule interviews (with user confirmation for dates)

## Available Tools:
${copilotTools.map(t => `- **${t.name}**: ${t.description}`).join('\n')}

## CRITICAL INSTRUCTIONS:
When you need data from the system, you MUST respond with ONLY a JSON object, no other text:
{{"tool": "tool_name", "args": {{"arg1": "value1"}}}}

Examples:
- User: "Show me active jobs" -> {{"tool": "search_jobs", "args": {{"status": "active"}}}}
- User: "Find candidates in New York" -> {{"tool": "search_candidates", "args": {{"location": "New York"}}}}
- User: "Dashboard summary" -> {{"tool": "get_dashboard_stats", "args": {{}}}}
- User: "What interviews do I have?" -> {{"tool": "get_upcoming_interviews", "args": {{}}}}

For general questions about your capabilities or the current page, respond normally with helpful text.`;

// Create the LLM using GitHub Models
function createLLM() {
  const apiKey = process.env.GITHUB_TOKEN;

  if (!apiKey) {
    throw new Error("GITHUB_TOKEN is not configured");
  }

  return new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
    maxTokens: 1000,
    configuration: {
      apiKey: apiKey,
      baseURL: "https://models.inference.ai.azure.com",
    },
  });
}

// Create a simple agent prompt
function createAgentPrompt(context: {
  currentPage: string;
  entityType?: string;
  entityName?: string;
}) {
  let entityContext = "";
  if (context.entityType && context.entityName) {
    entityContext = `\n\nThe user is currently viewing ${context.entityType} "${context.entityName}".`;
  }

  return ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_PROMPT + entityContext + `\n\nCurrent page: ${context.currentPage}`],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);
}

// Parse tool call from response
function parseToolCall(content: string): { tool: string; args: Record<string, unknown> } | null {
  try {
    // Try to parse the entire content as JSON first
    const trimmed = content.trim();

    // Check if it looks like JSON
    if (trimmed.includes('"tool"') && trimmed.includes('"args"')) {
      // Try to extract JSON object
      const startIndex = trimmed.indexOf('{');
      const lastIndex = trimmed.lastIndexOf('}');

      if (startIndex !== -1 && lastIndex !== -1) {
        const jsonStr = trimmed.slice(startIndex, lastIndex + 1);
        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed.tool && typeof parsed.tool === 'string') {
            return {
              tool: parsed.tool,
              args: parsed.args || {}
            };
          }
        } catch {
          // JSON parse failed, continue to other methods
        }
      }
    }
  } catch (e) {
    console.error("Failed to parse tool call:", e);
  }
  return null;
}

// Detect intent from user message directly
function detectIntentFromMessage(message: string): { tool: string; args: Record<string, unknown> } | null {
  const lower = message.toLowerCase();

  // Dashboard/stats
  if (lower.includes('dashboard') || lower.includes('summary') || lower.includes('stats') || lower.includes('statistics')) {
    return { tool: 'get_dashboard_stats', args: {} };
  }

  // Jobs
  if (lower.includes('job') || lower.includes('position') || lower.includes('opening')) {
    const args: Record<string, unknown> = {};
    if (lower.includes('active') || lower.includes('live') || lower.includes('open')) {
      args.status = 'active';
    }
    if (lower.includes('how many')) {
      args.limit = 100;
    }
    return { tool: 'search_jobs', args };
  }

  // Candidates
  if (lower.includes('candidate') || lower.includes('applicant') || lower.includes('talent')) {
    const args: Record<string, unknown> = {};
    if (lower.includes('how many')) {
      args.limit = 100;
    }
    return { tool: 'search_candidates', args };
  }

  // Interviews
  if (lower.includes('interview') && (lower.includes('upcoming') || lower.includes('scheduled') || lower.includes('coming'))) {
    return { tool: 'get_upcoming_interviews', args: {} };
  }

  // Clients
  if (lower.includes('client') || lower.includes('company')) {
    return { tool: 'search_clients', args: {} };
  }

  return null;
}

// Process tool calls manually
async function processToolCalls(
  toolCall: { tool: string; args: Record<string, unknown> },
  orgId: string,
  userId: string,
  userName: string
): Promise<{ name: string; result: unknown }> {
  // Set environment variables for tools
  process.env.CURRENT_ORG_ID = orgId;
  process.env.CURRENT_USER_ID = userId;
  process.env.CURRENT_USER_NAME = userName;

  const tool = copilotTools.find((t) => t.name === toolCall.tool);
  if (tool) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (tool as any).invoke(toolCall.args);
      return { name: toolCall.tool, result: JSON.parse(result) };
    } catch (error) {
      console.error(`Tool ${toolCall.tool} error:`, error);
      return { name: toolCall.tool, result: { error: "Tool execution failed", details: String(error) } };
    }
  }
  return { name: toolCall.tool, result: { error: "Tool not found" } };
}

// Format results for display
function formatResultsDirectly(toolName: string, result: unknown): string {
  if (!result || typeof result !== "object") {
    return "No results found.";
  }

  const data = result as Record<string, unknown>;

  if (data.error) {
    return `Error: ${data.error}`;
  }

  // Format based on tool type
  if (toolName === "search_jobs" && Array.isArray(data.jobs)) {
    if (data.jobs.length === 0) {
      return "No jobs found matching your criteria.";
    }
    const jobs = data.jobs;
    return `Found **${jobs.length}** job(s):\n\n${jobs.map((j: { title?: string; status?: string; location?: string; seniority?: string }, i: number) =>
      `${i + 1}. **${j.title || "Untitled"}**\n   Status: ${j.status || "Unknown"}\n   Location: ${j.location || "Not specified"}${j.seniority ? ` | ${j.seniority}` : ""}`
    ).join("\n\n")}`;
  }

  if (toolName === "search_candidates" && Array.isArray(data.candidates)) {
    if (data.candidates.length === 0) {
      return "No candidates found matching your criteria.";
    }
    const candidates = data.candidates;
    return `Found **${candidates.length}** candidate(s):\n\n${candidates.map((c: { full_name?: string; current_title?: string; current_company?: string; location?: string }, i: number) =>
      `${i + 1}. **${c.full_name || "Unknown"}**\n   ${c.current_title || "No title"} at ${c.current_company || "Unknown"}\n   Location: ${c.location || "Not specified"}`
    ).join("\n\n")}`;
  }

  if (toolName === "get_dashboard_stats") {
    return `**Dashboard Summary:**
• **Total Candidates:** ${data.totalCandidates || 0}
• **Total Jobs:** ${data.totalJobs || 0}
• **Active Jobs:** ${data.activeJobs || 0}
• **Pending Applications:** ${data.pendingApplications || 0}
• **Upcoming Interviews:** ${data.upcomingInterviews || 0}`;
  }

  if (toolName === "get_upcoming_interviews" && Array.isArray(data.interviews)) {
    if (data.interviews.length === 0) {
      return "No upcoming interviews scheduled.";
    }
    return `**Upcoming Interviews:** ${data.interviews.length}\n\n${data.interviews.map((int: { scheduled_at?: string; status?: string; applications?: { candidates?: { full_name?: string }; jobs?: { title?: string } } }, i: number) => {
      const candidate = int.applications?.candidates?.full_name || "Unknown";
      const job = int.applications?.jobs?.title || "Unknown position";
      const time = int.scheduled_at ? new Date(int.scheduled_at).toLocaleString() : "TBD";
      return `${i + 1}. **${candidate}** - ${job}\n   Scheduled: ${time}`;
    }).join("\n\n")}`;
  }

  if (toolName === "search_applications" && Array.isArray(data.applications)) {
    if (data.applications.length === 0) {
      return "No applications found.";
    }
    return `Found **${data.applications.length}** application(s).`;
  }

  if (toolName === "search_clients" && Array.isArray(data.clients)) {
    if (data.clients.length === 0) {
      return "No clients found.";
    }
    return `Found **${data.clients.length}** client(s):\n\n${data.clients.map((c: { name?: string; contact_person?: string; status?: string; industry?: string }, i: number) =>
      `${i + 1}. **${c.name || "Unknown"}**\n   Contact: ${c.contact_person || "N/A"}\n   Status: ${c.status || "Unknown"}`
    ).join("\n\n")}`;
  }

  // Default: return JSON
  return JSON.stringify(data, null, 2);
}

// Run the agent with context
export async function runCopilotAgent(
  message: string,
  context: {
    orgId: string;
    userId: string;
    userName: string;
    currentPage: string;
    entityType?: string;
    entityId?: string;
    entityName?: string;
  }
): Promise<{
  success: boolean;
  content: string | unknown;
  error?: string;
}> {
  try {
    // Check if API key is configured
    if (!process.env.GITHUB_TOKEN) {
      return {
        success: false,
        content: "AI copilot is not configured. Please add GITHUB_TOKEN to your environment.",
        error: "Missing API key",
      };
    }

    const llm = createLLM();
    const prompt = createAgentPrompt(context);

    // First call - let the LLM decide if it needs tools
    const chain = prompt.pipe(llm);
    const response = await chain.invoke({
      input: message,
      chat_history: [],
    });

    // Get response content
    const content = typeof response.content === "string"
      ? response.content
      : String(response.content);

    console.log("LLM Response:", content.substring(0, 200));

    // Check if the LLM wants to use tools
    let toolCall = parseToolCall(content);

    // If LLM didn't output proper JSON, try to detect intent from original message
    if (!toolCall) {
      toolCall = detectIntentFromMessage(message);
      if (toolCall) {
        console.log("Intent detected from message:", toolCall);
      }
    } else {
      console.log("Tool call detected from LLM:", toolCall);
    }

    if (toolCall) {

      // Execute tool
      const toolResult = await processToolCalls(toolCall, context.orgId, context.userId, context.userName);
      console.log("Tool result:", JSON.stringify(toolResult.result).substring(0, 200));

      // Format results directly (faster and more reliable)
      const formattedResult = formatResultsDirectly(toolCall.tool, toolResult.result);

      return { success: true, content: formattedResult };
    }

    // No tool calls - return the direct response
    return {
      success: true,
      content,
    };
  } catch (error) {
    console.error("Agent error:", error);
    return {
      success: false,
      content: "I encountered an error processing your request. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
