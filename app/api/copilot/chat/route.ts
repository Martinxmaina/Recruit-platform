import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { runCopilotAgent } from "@/lib/copilot/agent-service";
import type { CopilotChatRequest, CopilotChatResponse } from "@/lib/copilot/types";
import { getCurrentUserOrg } from "@/lib/api/helpers";

// Initialize Supabase admin client
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await getCurrentUserOrg();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CopilotChatRequest = await request.json();
    const { message, conversationId, context } = body;

    if (!message || !context) {
      return NextResponse.json(
        { error: "Message and context are required" },
        { status: 400 }
      );
    }

    // Check if GitHub token is configured
    if (!process.env.GITHUB_TOKEN) {
      // Fallback to rule-based responses if no API key
      return NextResponse.json(await getFallbackResponse(message, context, ctx.orgId, ctx.userId));
    }

    // Get user info for context
    const supabase = getSupabaseAdmin();
    const { data: member } = await supabase
      .from("org_members")
      .select("role")
      .eq("organization_id", ctx.orgId)
      .eq("user_id", ctx.userId)
      .single();

    // Get entity name if viewing a specific entity
    let entityName: string | undefined;
    if (context.entityType && context.entityId) {
      const table = context.entityType === "candidate" ? "candidates" :
                    context.entityType === "job" ? "jobs" :
                    context.entityType === "client" ? "clients" : null;

      if (table) {
        const nameField = context.entityType === "candidate" ? "full_name" : "name";
        const { data } = await supabase
          .from(table)
          .select(nameField)
          .eq("id", context.entityId)
          .eq("organization_id", ctx.orgId)
          .single();
        entityName = data ? (data as Record<string, unknown>)[nameField] as string : undefined;
      }
    }

    // Run the LLM agent
    const result = await runCopilotAgent(message, {
      orgId: ctx.orgId,
      userId: ctx.userId,
      userName: member?.role || "User",
      currentPage: context.currentPage,
      entityType: context.entityType,
      entityId: context.entityId,
      entityName,
    });

    // Parse the response
    let responseContent: string;
    if (typeof result.content === "string") {
      responseContent = result.content;
    } else if (Array.isArray(result.content)) {
      responseContent = result.content
        .map((c) => {
          if (typeof c === "string") return c;
          if (c && typeof c === "object" && "text" in c) return c.text || "";
          return "";
        })
        .join("");
    } else {
      responseContent = String(result.content);
    }

    return NextResponse.json({
      message: {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      },
      conversationId: conversationId || `conv-${Date.now()}`,
    } as CopilotChatResponse);
  } catch (error) {
    console.error("Copilot chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}

// Fallback for when OpenAI is not configured
async function getFallbackResponse(
  message: string,
  context: CopilotChatRequest["context"],
  orgId: string,
  userId: string
): Promise<CopilotChatResponse> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const lowerMessage = message.toLowerCase();

  // Dashboard stats
  if (lowerMessage.includes("stats") || lowerMessage.includes("summary") || lowerMessage.includes("dashboard")) {
    const [candidates, jobs, applications, interviews] = await Promise.all([
      supabase.from("candidates").select("id", { count: "exact" }).eq("organization_id", orgId),
      supabase.from("jobs").select("id, status", { count: "exact" }).eq("organization_id", orgId),
      supabase.from("applications").select("id, status").eq("organization_id", orgId),
      supabase.from("interviews").select("id").eq("organization_id", orgId).gte("scheduled_at", new Date().toISOString()),
    ]);

    const content = `Here's your recruitment dashboard summary:

• **Total Candidates:** ${candidates.count || 0}
• **Total Jobs:** ${jobs.count || 0}
• **Active Jobs:** ${jobs.data?.filter(j => j.status === "active").length || 0}
• **Pending Applications:** ${applications.data?.filter(a => a.status === "active").length || 0}
• **Upcoming Interviews:** ${interviews.data?.length || 0}

Would you like more details on any of these?`;

    return {
      message: { id: `msg-${Date.now()}`, role: "assistant", content, timestamp: new Date() },
      conversationId: `conv-${Date.now()}`,
    };
  }

  // Default response
  return {
    message: {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: `I'm your recruitment assistant. You can ask me to:

• **Search** for candidates, jobs, or clients
• **View** upcoming interviews or dashboard stats
• **Add notes** to candidates, jobs, or clients

How can I help you today?`,
      timestamp: new Date(),
    },
    conversationId: `conv-${Date.now()}`,
  };
}
