import { NextRequest, NextResponse } from "next/server";
import { exchangeCode } from "@/lib/google/calendar";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserOrg } from "@/lib/api/helpers";

export async function GET(request: NextRequest) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	const code = request.nextUrl.searchParams.get("code");
	if (!code) {
		return NextResponse.redirect(
			new URL("/settings?error=no_code", request.url)
		);
	}

	try {
		const tokens = await exchangeCode(code);

		const supabase = await createAdminClient(ctx.userId);
		await supabase
			.from("org_members")
			.update({ google_calendar_token: tokens as any })
			.eq("organization_id", ctx.orgId)
			.eq("user_id", ctx.userId);

		return NextResponse.redirect(
			new URL("/settings?gcal=connected", request.url)
		);
	} catch (err) {
		console.error("Google Calendar OAuth error:", err);
		return NextResponse.redirect(
			new URL("/settings?error=gcal_auth_failed", request.url)
		);
	}
}
