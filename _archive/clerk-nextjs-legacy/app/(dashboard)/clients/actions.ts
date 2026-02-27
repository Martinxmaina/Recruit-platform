"use server";

import { getCurrentUserOrg } from "@/lib/api/helpers";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ClientFormData } from "@/lib/validations/client";

export async function getClients() {
	const ctx = await getCurrentUserOrg();
	if (!ctx) redirect("/dashboard");

	const supabase = await createAdminClient(ctx.userId);
	const { data: clients, error } = await supabase
		.from("clients")
		.select("*")
		.eq("organization_id", ctx.orgId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching clients:", error);
		return [];
	}

	return clients ?? [];
}

export async function getClient(id: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) redirect("/dashboard");

	const supabase = await createAdminClient(ctx.userId);
	const { data: client, error } = await supabase
		.from("clients")
		.select("*")
		.eq("id", id)
		.eq("organization_id", ctx.orgId)
		.single();

	if (error) {
		console.error("Error fetching client:", error);
		return null;
	}

	return client;
}

export async function createClient(data: ClientFormData) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId);
	const { data: client, error } = await supabase
		.from("clients")
		.insert({
			organization_id: ctx.orgId,
			name: data.name,
			industry: data.industry || null,
			status: data.status,
			contact_email: data.contact_email || null,
			contact_person: data.contact_person || null,
			contact_phone: data.contact_phone || null,
			website: data.website || null,
			address: data.address || null,
		})
		.select()
		.single();

	if (error) {
		console.error("Error creating client:", error);
		return { error: error.message };
	}

	revalidatePath("/clients");
	return { data: client };
}

export async function updateClient(id: string, data: ClientFormData) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return { error: "Unauthorized" };

	const supabase = await createAdminClient(ctx.userId);
	const { data: client, error } = await supabase
		.from("clients")
		.update({
			name: data.name,
			industry: data.industry || null,
			status: data.status,
			contact_email: data.contact_email || null,
			contact_person: data.contact_person || null,
			contact_phone: data.contact_phone || null,
			website: data.website || null,
			address: data.address || null,
			updated_at: new Date().toISOString(),
		})
		.eq("id", id)
		.eq("organization_id", ctx.orgId)
		.select()
		.single();

	if (error) {
		console.error("Error updating client:", error);
		return { error: error.message };
	}

	revalidatePath("/clients");
	revalidatePath(`/clients/${id}`);
	return { data: client };
}

export async function getClientJobs(clientId: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return [];

	const supabase = await createAdminClient(ctx.userId);
	const { data: jobs, error } = await supabase
		.from("jobs")
		.select("*")
		.eq("client_id", clientId)
		.eq("organization_id", ctx.orgId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching client jobs:", error);
		return [];
	}

	return jobs ?? [];
}

export async function getClientCandidates(clientId: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return [];

	const supabase = await createAdminClient(ctx.userId);
	const { data: jobs } = await supabase
		.from("jobs")
		.select("id")
		.eq("client_id", clientId)
		.eq("organization_id", ctx.orgId);

	if (!jobs || jobs.length === 0) {
		return [];
	}

	const jobIds = jobs.map((j) => j.id);
	const { data: applications } = await supabase
		.from("applications")
		.select("candidate_id")
		.in("job_id", jobIds)
		.eq("organization_id", ctx.orgId);

	if (!applications || applications.length === 0) {
		return [];
	}

	const candidateIds = [...new Set(applications.map((a) => a.candidate_id))];
	const { data: candidates, error } = await supabase
		.from("candidates")
		.select("*")
		.in("id", candidateIds)
		.eq("organization_id", ctx.orgId);

	if (error) {
		console.error("Error fetching client candidates:", error);
		return [];
	}

	return candidates ?? [];
}

export async function getClientActivity(clientId: string) {
	const ctx = await getCurrentUserOrg();
	if (!ctx) return [];

	const supabase = await createAdminClient(ctx.userId);
	const { data: notifications, error } = await supabase
		.from("notifications")
		.select("*")
		.eq("organization_id", ctx.orgId)
		.contains("metadata", { client_id: clientId })
		.order("created_at", { ascending: false })
		.limit(50);

	if (error) {
		console.error("Error fetching client activity:", error);
		return [];
	}

	return notifications ?? [];
}
