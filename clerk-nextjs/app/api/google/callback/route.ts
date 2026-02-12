import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { exchangeCode } from "@/lib/google/calendar";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
	const { userId, orgId } = await auth();
	if (!userId || !orgId) {
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

		// Store tokens in org_members
		const supabase = await createAdminClient(userId);
		const { data: org } = await supabase
			.from("organizations")
			.select("id")
			.eq("clerk_org_id", orgId)
			.single();

		if (org) {
			await supabase
				.from("org_members")
				.update({ google_calendar_token: tokens as any })
				.eq("organization_id", org.id)
				.eq("user_id", userId);
		}

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
