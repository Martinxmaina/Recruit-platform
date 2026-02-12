"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ClientFormData } from "@/lib/validations/client";

export async function getClients() {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		redirect("/dashboard");
	}

	const supabase = await createAdminClient(userId);

	// Get organization_id from Supabase
	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) {
		return [];
	}

	const { data: clients, error } = await supabase
		.from("clients")
		.select("*")
		.eq("organization_id", org.id)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching clients:", error);
		return [];
	}

	return clients ?? [];
}

export async function getClient(id: string) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		redirect("/dashboard");
	}

	const supabase = await createAdminClient(userId);

	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) {
		return null;
	}

	const { data: client, error } = await supabase
		.from("clients")
		.select("*")
		.eq("id", id)
		.eq("organization_id", org.id)
		.single();

	if (error) {
		console.error("Error fetching client:", error);
		return null;
	}

	return client;
}

export async function createClient(data: ClientFormData) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		return { error: "Unauthorized" };
	}

	const supabase = await createAdminClient(userId);

	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) {
		return { error: "Organization not found" };
	}

	const { data: client, error } = await supabase
		.from("clients")
		.insert({
			organization_id: org.id,
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
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		return { error: "Unauthorized" };
	}

	const supabase = await createAdminClient(userId);

	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) {
		return { error: "Organization not found" };
	}

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
		.eq("organization_id", org.id)
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
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		return [];
	}

	const supabase = await createAdminClient(userId);

	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) {
		return [];
	}

	const { data: jobs, error } = await supabase
		.from("jobs")
		.select("*")
		.eq("client_id", clientId)
		.eq("organization_id", org.id)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching client jobs:", error);
		return [];
	}

	return jobs ?? [];
}

export async function getClientCandidates(clientId: string) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		return [];
	}

	const supabase = await createAdminClient(userId);

	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) {
		return [];
	}

	// Get job IDs for this client first
	const { data: jobs } = await supabase
		.from("jobs")
		.select("id")
		.eq("client_id", clientId)
		.eq("organization_id", org.id);

	if (!jobs || jobs.length === 0) {
		return [];
	}

	const jobIds = jobs.map((j) => j.id);

	// Get candidates through applications
	const { data: applications } = await supabase
		.from("applications")
		.select("candidate_id")
		.in("job_id", jobIds)
		.eq("organization_id", org.id);

	if (!applications || applications.length === 0) {
		return [];
	}

	const candidateIds = [...new Set(applications.map((a) => a.candidate_id))];

	const { data: candidates, error } = await supabase
		.from("candidates")
		.select("*")
		.in("id", candidateIds)
		.eq("organization_id", org.id);

	if (error) {
		console.error("Error fetching client candidates:", error);
		return [];
	}

	return candidates ?? [];
}

export async function getClientActivity(clientId: string) {
	const { userId, orgId } = await auth();

	if (!userId || !orgId) {
		return [];
	}

	const supabase = await createAdminClient(userId);

	const { data: org } = await supabase
		.from("organizations")
		.select("id")
		.eq("clerk_org_id", orgId)
		.single();

	if (!org) {
		return [];
	}

	// Get notifications related to this client (through jobs)
	const { data: notifications, error } = await supabase
		.from("notifications")
		.select("*")
		.eq("organization_id", org.id)
		.contains("metadata", { client_id: clientId })
		.order("created_at", { ascending: false })
		.limit(50);

	if (error) {
		console.error("Error fetching client activity:", error);
		return [];
	}

	return notifications ?? [];
}
