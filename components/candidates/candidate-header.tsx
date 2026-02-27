import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink, Edit, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AddToJobDialog } from "@/components/applications/add-to-job-dialog";
import { getJobs } from "@/app/(dashboard)/jobs/actions";
import type { Candidate } from "@/app/(dashboard)/candidates/actions";

interface CandidateHeaderProps {
	candidate: Candidate;
	jobs: Array<{ id: string; title: string; clients?: { name: string } | null }>;
}

export function CandidateHeader({ candidate, jobs }: CandidateHeaderProps) {
	const initials = candidate.full_name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-6">
					<Avatar className="size-20 rounded-lg">
						<AvatarFallback className="rounded-lg bg-primary/10 text-primary text-2xl">
							{initials}
						</AvatarFallback>
					</Avatar>
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<h1 className="text-3xl font-bold">{candidate.full_name}</h1>
							{candidate.source && (
								<Badge variant="outline">{candidate.source}</Badge>
							)}
						</div>
						{candidate.current_title && candidate.current_company && (
							<p className="text-muted-foreground">
								{candidate.current_title} at {candidate.current_company}
							</p>
						)}
						<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
							{candidate.email && (
								<a
									href={`mailto:${candidate.email}`}
									className="flex items-center gap-2 hover:text-foreground"
								>
									<Mail className="size-4" />
									{candidate.email}
								</a>
							)}
							{candidate.phone && (
								<a
									href={`tel:${candidate.phone}`}
									className="flex items-center gap-2 hover:text-foreground"
								>
									<Phone className="size-4" />
									{candidate.phone}
								</a>
							)}
							{candidate.location && (
								<div className="flex items-center gap-2">
									<MapPin className="size-4" />
									{candidate.location}
								</div>
							)}
							{candidate.linkedin_url && (
								<a
									href={candidate.linkedin_url}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 hover:text-foreground"
								>
									<ExternalLink className="size-4" />
									LinkedIn
								</a>
							)}
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<AddToJobDialog candidateId={candidate.id} jobs={jobs} />
					{candidate.resume_url && (
						<Button variant="outline" size="sm" asChild>
							<a href={candidate.resume_url} target="_blank" rel="noopener noreferrer">
								<Download className="mr-2 size-4" />
								Resume
							</a>
						</Button>
					)}
					<Button variant="outline" asChild>
						<Link href={`/candidates/${candidate.id}/edit`}>
							<Edit className="mr-2 size-4" />
							Edit
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
