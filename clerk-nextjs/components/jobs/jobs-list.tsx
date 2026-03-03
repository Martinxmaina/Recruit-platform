"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { JobsFilterBar } from "./jobs-filter-bar";
import { JobsCardGrid } from "./jobs-card-grid";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Plus, LayoutGrid, List, Briefcase, UserSearch } from "lucide-react";
import Link from "next/link";
import { sendJobsToJobSearchWebhook, type Job } from "@/app/(dashboard)/jobs/actions";

interface JobsListProps {
	initialJobs: Array<Job & { clients?: { name: string } | null }>;
	clients: Array<{ id: string; name: string }>;
}

export function JobsList({ initialJobs, clients }: JobsListProps) {
	const router = useRouter();
	const [viewMode, setViewMode] = useState<"card" | "table">("card");
	const [isPending, startTransition] = useTransition();

	const handleFiltersChange = useCallback(
		(filters: {
			search?: string;
			status?: string;
			work_type?: string;
			country?: string;
			client_id?: string;
			sort?: string;
		}) => {
			const params = new URLSearchParams();
			if (filters.search) params.set("search", filters.search);
			if (filters.status) params.set("status", filters.status);
			if (filters.work_type) params.set("work_type", filters.work_type);
			if (filters.country) params.set("country", filters.country);
			if (filters.client_id) params.set("client_id", filters.client_id);
			if (filters.sort) params.set("sort", filters.sort);
			router.push(`/jobs?${params.toString()}`);
		},
		[router]
	);

	const handleSendToJobSearch = () => {
		startTransition(async () => {
			const result = await sendJobsToJobSearchWebhook(initialJobs);
			if (result.error) {
				alert(result.error);
				return;
			}
			alert("Jobs sent to Job Search.");
		});
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
					<Button
						variant="outline"
						onClick={handleSendToJobSearch}
						disabled={isPending || initialJobs.length === 0}
					>
						<UserSearch className="mr-2 size-4" />
						{isPending ? "Sending…" : "Look for candidates"}
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

			{viewMode === "card" ? (
				<div data-view="card">
					<JobsCardGrid jobs={initialJobs} />
				</div>
			) : (
				<div data-view="table">
					{initialJobs.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<Briefcase className="mb-4 size-12 text-muted-foreground" />
							<p className="text-muted-foreground">No jobs found.</p>
						</div>
					) : (
						<div className="overflow-x-auto rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Title</TableHead>
										<TableHead>Client</TableHead>
										<TableHead>Location</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Work type</TableHead>
										<TableHead>Posted</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{initialJobs.map((job) => (
										<TableRow key={job.id}>
											<TableCell>
												<Link
													href={`/jobs/${job.id}`}
													className="font-medium hover:underline"
												>
													{job.title}
												</Link>
											</TableCell>
											<TableCell className="text-muted-foreground">
												{job.clients?.name ?? "—"}
											</TableCell>
											<TableCell className="text-muted-foreground">
												{job.location ?? job.country ?? "—"}
											</TableCell>
											<TableCell>
												<span className="capitalize">{job.status}</span>
											</TableCell>
											<TableCell className="text-muted-foreground">
												{job.work_type ?? "—"}
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{job.posted_at
													? new Date(job.posted_at).toLocaleDateString()
													: "—"}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
