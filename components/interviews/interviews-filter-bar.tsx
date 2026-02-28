"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface InterviewsFilterBarProps {
	jobs: Array<{ id: string; title: string }>;
	initialJobId?: string;
	initialStatus?: string;
	initialUpcoming?: string;
}

export function InterviewsFilterBar({
	jobs,
	initialJobId = "",
	initialStatus = "",
	initialUpcoming = "",
}: InterviewsFilterBarProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const updateParams = (updates: { job_id?: string; status?: string; upcoming?: string }) => {
		const params = new URLSearchParams(searchParams.toString());
		if (updates.job_id !== undefined) (updates.job_id ? params.set("job_id", updates.job_id) : params.delete("job_id"));
		if (updates.status !== undefined) (updates.status ? params.set("status", updates.status) : params.delete("status"));
		if (updates.upcoming !== undefined) (updates.upcoming ? params.set("upcoming", updates.upcoming) : params.delete("upcoming"));
		router.push(`/interviews?${params.toString()}`);
	};

	const clearFilters = () => router.push("/interviews");

	const hasActiveFilters = initialJobId || initialStatus || initialUpcoming;

	return (
		<div className="flex flex-wrap items-center gap-3">
			<Select
				value={initialJobId || "all"}
				onValueChange={(v) => updateParams({ job_id: v === "all" ? "" : v })}
			>
				<SelectTrigger className="w-[200px]">
					<SelectValue placeholder="Job" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All jobs</SelectItem>
					{jobs.map((j) => (
						<SelectItem key={j.id} value={j.id}>
							{j.title}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select
				value={initialStatus || "all"}
				onValueChange={(v) => updateParams({ status: v === "all" ? "" : v })}
			>
				<SelectTrigger className="w-[160px]">
					<SelectValue placeholder="Status" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All statuses</SelectItem>
					<SelectItem value="scheduled">Scheduled</SelectItem>
					<SelectItem value="completed">Completed</SelectItem>
					<SelectItem value="cancelled">Cancelled</SelectItem>
					<SelectItem value="rescheduled">Rescheduled</SelectItem>
				</SelectContent>
			</Select>
			<Select
				value={initialUpcoming || "all"}
				onValueChange={(v) => updateParams({ upcoming: v === "all" ? "" : v })}
			>
				<SelectTrigger className="w-[140px]">
					<SelectValue placeholder="Time" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All</SelectItem>
					<SelectItem value="true">Upcoming</SelectItem>
					<SelectItem value="false">Past</SelectItem>
				</SelectContent>
			</Select>
			{hasActiveFilters && (
				<Button variant="ghost" size="sm" className="gap-1" onClick={clearFilters}>
					<X className="size-3.5" />
					Clear filters
				</Button>
			)}
		</div>
	);
}
