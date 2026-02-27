import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Briefcase, Calendar, ExternalLink } from "lucide-react";
import { ResumeViewer } from "@/components/candidates/resume-viewer";
import type { Candidate } from "@/app/(dashboard)/candidates/actions";

interface CandidateOverviewTabProps {
	candidate: Candidate;
}

export function CandidateOverviewTab({ candidate }: CandidateOverviewTabProps) {
	return (
		<div className="grid gap-6 md:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Briefcase className="size-5" />
						Contact Information
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{candidate.email && (
						<div>
							<label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
								<Mail className="size-4" />
								Email
							</label>
							<a
								href={`mailto:${candidate.email}`}
								className="mt-1 text-primary hover:underline block"
							>
								{candidate.email}
							</a>
						</div>
					)}
					{candidate.phone && (
						<div>
							<label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
								<Phone className="size-4" />
								Phone
							</label>
							<a
								href={`tel:${candidate.phone}`}
								className="mt-1 text-primary hover:underline block"
							>
								{candidate.phone}
							</a>
						</div>
					)}
					{candidate.location && (
						<div>
							<label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
								<MapPin className="size-4" />
								Location
							</label>
							<p className="mt-1">{candidate.location}</p>
						</div>
					)}
					{candidate.linkedin_url && (
						<div>
							<label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
								<ExternalLink className="size-4" />
								LinkedIn
							</label>
							<a
								href={candidate.linkedin_url}
								target="_blank"
								rel="noopener noreferrer"
								className="mt-1 text-primary hover:underline block"
							>
								{candidate.linkedin_url}
							</a>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Professional Information</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{candidate.current_title && (
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Current Title
							</label>
							<p className="mt-1">{candidate.current_title}</p>
						</div>
					)}
					{candidate.current_company && (
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Current Company
							</label>
							<p className="mt-1">{candidate.current_company}</p>
						</div>
					)}
					{candidate.source && (
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Source
							</label>
							<p className="mt-1 capitalize">{candidate.source}</p>
						</div>
					)}
					<div>
						<label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<Calendar className="size-4" />
							Created
						</label>
						<p className="mt-1">
							{candidate.created_at
								? new Date(candidate.created_at).toLocaleDateString()
								: "—"}
						</p>
					</div>
				</CardContent>
			</Card>

			{candidate.resume_url && (
				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle>Resume</CardTitle>
					</CardHeader>
					<CardContent>
						<ResumeViewer
							resumeUrl={candidate.resume_url}
							candidateName={candidate.full_name}
						/>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
