"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JobsFilterBar } from "./jobs-filter-bar";
import { JobsCardGrid } from "./jobs-card-grid";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Job } from "@/app/(dashboard)/jobs/actions";

interface JobsListProps {
	initialJobs: Array<Job & { clients?: { name: string } | null }>;
	clients: Array<{ id: string; name: string }>;
}

export function JobsList({ initialJobs, clients }: JobsListProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [viewMode, setViewMode] = useState<"card" | "table">("card");

	// Get organization_id from initial jobs (all jobs belong to the same org)
	const organizationId = initialJobs[0]?.organization_id;

	// Set up Supabase Realtime subscription to listen for jobs table changes
	useEffect(() => {
		if (!organizationId) return;

		const supabase = createClient();

		const channel = supabase
			.channel("jobs-changes")
			.on(
				"postgres_changes",
				{
					event: "*", // INSERT, UPDATE, DELETE
					schema: "public",
					table: "jobs",
					filter: `organization_id=eq.${organizationId}`,
				},
				() => {
					// Refetch data from server when jobs table changes
					router.refresh();
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [organizationId, router]);

	const handleFiltersChange = (filters: {
		search?: string;
		status?: string;
		work_type?: string;
		country?: string;
		client_id?: string;
	}) => {
		const params = new URLSearchParams();
		if (filters.search) params.set("search", filters.search);
		if (filters.status) params.set("status", filters.status);
		if (filters.work_type) params.set("work_type", filters.work_type);
		if (filters.country) params.set("country", filters.country);
		if (filters.client_id) params.set("client_id", filters.client_id);
		router.push(`/jobs?${params.toString()}`);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Jobs</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Manage job openings ({initialJobs.length} total)
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant={viewMode === "card" ? "default" : "outline"}
						size="icon"
						onClick={() => setViewMode("card")}
					>
						<LayoutGrid className="size-4" />
					</Button>
					<Button
						variant={viewMode === "table" ? "default" : "outline"}
						size="icon"
						onClick={() => setViewMode("table")}
					>
						<List className="size-4" />
					</Button>
					<Button asChild>
						<Link href="/jobs/new">
							<Plus className="mr-2 size-4" />
							Add Job
						</Link>
					</Button>
				</div>
			</div>

			<JobsFilterBar
				clients={clients}
				onFiltersChange={handleFiltersChange}
			/>

			<JobsCardGrid jobs={initialJobs} />
		</div>
	);
}
