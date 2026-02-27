"use client";

import Link from "next/link";
import { Briefcase, MapPin, Globe, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils/date";
import type { Job } from "@/app/(dashboard)/jobs/actions";

interface JobsCardGridProps {
	jobs: Array<Job & { clients?: { name: string } | null }>;
}

export function JobsCardGrid({ jobs }: JobsCardGridProps) {
	if (jobs.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Briefcase className="mb-4 size-12 text-muted-foreground" />
				<p className="text-muted-foreground">No jobs found.</p>
			</div>
		);
	}

	const statusColors: Record<string, "default" | "secondary" | "outline"> = {
		open: "default",
		closed: "secondary",
		"on-hold": "outline",
		filled: "secondary",
	};

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{jobs.map((job) => {
				const clientName = job.clients?.name || "No Client";
				const initials = clientName
					.split(" ")
					.map((n) => n[0])
					.join("")
					.toUpperCase()
					.slice(0, 2);

				return (
					<Card key={job.id} className="flex flex-col hover:shadow-md transition-shadow">
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<Link
										href={`/jobs/${job.id}`}
										className="font-semibold text-lg hover:underline"
									>
										{job.title}
									</Link>
									<div className="mt-2 flex items-center gap-2">
										<Avatar className="size-6">
											<AvatarFallback className="bg-primary/10 text-primary text-xs">
												{initials}
											</AvatarFallback>
										</Avatar>
										<span className="text-sm text-muted-foreground">
											{clientName}
										</span>
									</div>
								</div>
								<Badge variant={statusColors[job.status] ?? "default"}>
									{job.status}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="flex-1 space-y-2">
							{job.location && (
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<MapPin className="size-4" />
									{job.location}
									{job.country && `, ${job.country}`}
								</div>
							)}
							{job.work_type && (
								<Badge variant="outline" className="w-fit">
									{job.work_type}
								</Badge>
							)}
							{job.description && (
								<p className="text-sm text-muted-foreground line-clamp-2">
									{job.description}
								</p>
							)}
						</CardContent>
						<CardFooter className="flex items-center justify-between pt-4 border-t">
							{job.posted_at && (
								<div className="flex items-center gap-1 text-xs text-muted-foreground">
									<Calendar className="size-3" />
									{new Date(job.posted_at).toLocaleDateString()}
								</div>
							)}
							<Button variant="outline" size="sm" asChild>
								<Link href={`/jobs/${job.id}`}>View Details</Link>
							</Button>
						</CardFooter>
					</Card>
				);
			})}
		</div>
	);
}
