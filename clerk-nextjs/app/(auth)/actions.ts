"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ensureUserHasOrg } from "@/lib/sync-org";
import { acceptInvite } from "@/app/(dashboard)/settings/actions";

export async function signIn(formData: FormData) {
	const email = (formData.get("email") as string)?.trim();
	const password = formData.get("password") as string;
	if (!email || !password) {
		redirect("/sign-in?error=" + encodeURIComponent("Email and password are required"));
	}
	const supabase = await createClient();
	const { error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) redirect("/sign-in?error=" + encodeURIComponent(error.message));
	redirect("/dashboard");
}

export async function signUp(formData: FormData) {
	const email = (formData.get("email") as string)?.trim();
	const password = formData.get("password") as string;
	if (!email || !password) {
		redirect("/sign-up?error=" + encodeURIComponent("Email and password are required"));
	}
	const supabase = await createClient();
	const { data, error } = await supabase.auth.signUp({ email, password });
	if (error) redirect("/sign-up?error=" + encodeURIComponent(error.message));
	if (data.user) {
		try {
			await ensureUserHasOrg(data.user.id, data.user.email ?? undefined);
		} catch {
			// non-fatal
		}
		const inviteToken = (formData.get("invite") as string)?.trim();
		if (inviteToken) {
			try {
				await acceptInvite(data.user.id, inviteToken);
			} catch {
				// non-fatal
			}
		}
	}
	redirect("/dashboard");
}

export async function signOut() {
	const supabase = await createClient();
	await supabase.auth.signOut();
	redirect("/sign-in");
}
