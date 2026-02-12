"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Format date helper function
const formatDate = (date: Date) => {
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

const formatTime = (date: Date) => {
	return date.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
};
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Calendar, X } from "lucide-react";
import { deleteInterview, updateInterviewStatus } from "@/app/(dashboard)/interviews/actions";
import { InterviewStatusBadge } from "./interview-status-badge";

interface Interview {
	id: string;
	application_id: string;
	scheduled_at: string;
	status: string;
	notes: string | null;
	applications: {
		id: string;
		candidates: {
			id: string;
			full_name: string;
			email: string | null;
		};
		jobs: {
			id: string;
			title: string;
		};
	};
}

interface InterviewsListProps {
	interviews: Interview[];
	onUpdate?: () => void;
}

export function InterviewsList({ interviews, onUpdate }: InterviewsListProps) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this interview?")) return;

		startTransition(async () => {
			const result = await deleteInterview(id);
			if (result.error) {
				alert(`Failed to delete interview: ${result.error}`);
				return;
			}
			router.refresh();
			onUpdate?.();
		});
	};

	const handleStatusChange = async (id: string, status: string) => {
		startTransition(async () => {
			const result = await updateInterviewStatus(id, status);
			if (result.error) {
				alert(`Failed to update status: ${result.error}`);
				return;
			}
			router.refresh();
			onUpdate?.();
		});
	};

	if (interviews.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Calendar className="mb-4 size-12 text-muted-foreground" />
				<p className="text-muted-foreground">No interviews scheduled.</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Candidate</TableHead>
						<TableHead>Job</TableHead>
						<TableHead>Scheduled At</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="w-[100px]">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{interviews.map((interview) => {
						const candidate = interview.applications.candidates;
						const job = interview.applications.jobs;
						const scheduledDate = new Date(interview.scheduled_at);

						return (
							<TableRow key={interview.id}>
								<TableCell>
									<Link
										href={`/candidates/${candidate.id}`}
										className="font-medium hover:underline"
									>
										{candidate.full_name}
									</Link>
									{candidate.email && (
										<div className="text-sm text-muted-foreground">
											{candidate.email}
										</div>
									)}
								</TableCell>
								<TableCell>
									<Link
										href={`/jobs/${job.id}`}
										className="font-medium hover:underline"
									>
										{job.title}
									</Link>
								</TableCell>
								<TableCell>
									<div className="font-medium">{formatDate(scheduledDate)}</div>
									<div className="text-sm text-muted-foreground">
										{formatTime(scheduledDate)}
									</div>
								</TableCell>
								<TableCell>
									<InterviewStatusBadge status={interview.status} />
								</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon">
												<MoreHorizontal className="size-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											{interview.status === "scheduled" && (
												<>
													<DropdownMenuItem
														onClick={() =>
															handleStatusChange(interview.id, "completed")
														}
													>
														Mark as Completed
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															handleStatusChange(interview.id, "cancelled")
														}
													>
														Cancel Interview
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															handleStatusChange(interview.id, "rescheduled")
														}
													>
														Mark as Rescheduled
													</DropdownMenuItem>
												</>
											)}
											<DropdownMenuItem
												onClick={() => handleDelete(interview.id)}
												className="text-destructive"
											>
												<X className="mr-2 size-4" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
