import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { ExecuteActionRequest, ExecuteActionResponse } from "@/lib/copilot/types";
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

    const body: ExecuteActionRequest = await request.json();
    const { actionId, conversationId, confirmed } = body;

    if (!actionId || !conversationId) {
      return NextResponse.json(
        { error: "Action ID and conversation ID are required" },
        { status: 400 }
      );
    }

    if (!confirmed) {
      return NextResponse.json({
        success: true,
        message: "Action cancelled. Let me know if you need anything else.",
      } as ExecuteActionResponse);
    }

    // Execute the action
    const result = await executeAction(ctx.orgId, ctx.userId, actionId, { ...body });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Execute action error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to execute action" },
      { status: 500 }
    );
  }
}

async function executeAction(
  orgId: string,
  userId: string,
  actionId: string,
  params: Record<string, unknown>
): Promise<ExecuteActionResponse> {
  const supabase = getSupabaseAdmin();

  // Get user name for notes
  const { data: member } = await supabase
    .from("org_members")
    .select("user_id")
    .eq("organization_id", orgId)
    .eq("user_id", userId)
    .single();

  // Action type is encoded in the ID (e.g., "action-create-candidate")
  const actionType = actionId.split("-")[1] || "unknown";

  switch (actionType) {
    case "create": {
      // Handle different create actions based on params
      if (params.fullName) {
        // Create candidate
        const { data: candidate, error } = await supabase
          .from("candidates")
          .insert({
            full_name: params.fullName,
            organization_id: orgId,
          })
          .select()
          .single();

        if (error) {
          return { success: false, message: `Failed to create candidate: ${error.message}` };
        }

        return {
          success: true,
          result: candidate,
          message: `Candidate "${params.fullName}" created successfully! You can view them at /candidates/${candidate.id}`,
        };
      }

      if (params.entityType && params.content) {
        // Add note
        const { error } = await supabase.from("notes").insert({
          entity_type: params.entityType as string,
          entity_id: params.entityId as string,
          content: params.content as string,
          author_id: userId,
          author_name: member?.user_id || "Unknown",
          organization_id: orgId,
        });

        if (error) {
          return { success: false, message: `Failed to add note: ${error.message}` };
        }

        return {
          success: true,
          message: `Note added successfully to ${params.entityType}.`,
        };
      }

      if (params.candidateName && params.time) {
        // Schedule interview - this requires finding the application first
        // For now, return a message asking for more info
        return {
          success: true,
          message: `To schedule an interview with ${params.candidateName} at ${params.time}, please provide the job position they applied for.`,
        };
      }

      return { success: false, message: "Unknown create action" };
    }

    case "update": {
      // Handle update actions
      return { success: false, message: "Update actions not yet implemented" };
    }

    default:
      return { success: false, message: `Unknown action type: ${actionType}` };
  }
}
