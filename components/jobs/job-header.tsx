import Link from "next/link";
import Image from "next/image";
import { Briefcase, MapPin, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Job } from "@/app/(dashboard)/jobs/actions";

interface JobHeaderProps {
	job: Job & { clients?: { name: string } | null };
}

function formatEmploymentType(value: string): string {
	if (value === "FULL_TIME") return "Full-time";
	if (value === "PART_TIME") return "Part-time";
	if (value === "CONTRACT") return "Contract";
	if (value === "TEMPORARY") return "Temporary";
	if (value === "INTERNSHIP") return "Internship";
	return value.replace(/_/g, " ");
}

function getStringArray(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return value.filter((item): item is string => typeof item === "string");
}

export function JobHeader({ job }: JobHeaderProps) {
	const clientName = job.clients?.name || "No Client";
	const orgName = job.organization_name || clientName;
	const initials = orgName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
	const employmentTypes = getStringArray(job.employment_type);

	const statusColors: Record<string, "default" | "secondary" | "outline"> = {
		open: "default",
		closed: "secondary",
		"on-hold": "outline",
		filled: "secondary",
	};

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						{job.organization_logo ? (
							<div className="relative size-12 shrink-0 overflow-hidden rounded-lg border bg-muted">
								<Image
									src={job.organization_logo}
									alt=""
									fill
									className="object-contain"
									unoptimized
								/>
							</div>
						) : (
							<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<Briefcase className="size-6" />
							</div>
						)}
						<div>
							<h1 className="text-3xl font-bold">{job.title}</h1>
							<div className="mt-2 flex items-center gap-3">
								<Avatar className="size-6">
									<AvatarFallback className="bg-primary/10 text-primary text-xs">
										{initials}
									</AvatarFallback>
								</Avatar>
								<span className="text-muted-foreground">
									{job.organization_name || clientName}
								</span>
								{job.organization_name && clientName !== "No Client" && (
									<span className="text-muted-foreground text-xs">
										(Client: {clientName})
									</span>
								)}
							</div>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-4">
						<Badge variant={statusColors[job.status] ?? "default"}>
							{job.status}
						</Badge>
						{job.seniority && (
							<Badge variant="outline">{job.seniority}</Badge>
						)}
						{employmentTypes.length > 0 &&
							employmentTypes.map((t) => (
								<Badge key={t} variant="outline">
									{formatEmploymentType(t)}
								</Badge>
							))}
						{job.work_type && employmentTypes.length === 0 && (
							<Badge variant="outline">{job.work_type}</Badge>
						)}
						{job.location && (
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<MapPin className="size-4" />
								{job.location}
								{job.country && `, ${job.country}`}
							</div>
						)}
					</div>
				</div>
				<Button variant="outline" asChild>
					<Link href={`/jobs/${job.id}/edit`}>
						<Edit className="mr-2 size-4" />
						Edit
					</Link>
				</Button>
			</div>
		</div>
	);
}
