import { NextResponse } from "next/server";
import { getCurrentUserOrg } from "@/lib/api/helpers";

// For now, conversations are stored in memory/client-side
// In production, you'd store these in Supabase

export async function GET() {
  try {
    const ctx = await getCurrentUserOrg();
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return empty conversations for now
    // In production, fetch from database
    return NextResponse.json({
      conversations: [],
    });
  } catch (error) {
    console.error("Fetch conversations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
