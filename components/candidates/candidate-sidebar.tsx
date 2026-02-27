import { Mail, Phone, MapPin, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AddToJobDialog } from "@/components/applications/add-to-job-dialog";
import { AddToTrackingButton } from "@/components/tracking/add-to-tracking-button";
import { ResumeViewer } from "@/components/candidates/resume-viewer";
import type { Candidate } from "@/app/(dashboard)/candidates/actions";

interface CandidateSidebarProps {
	candidate: Candidate;
	jobs: Array<{ id: string; title: string; clients?: { name: string } | null }>;
	applications?: Array<{
		id: string;
		stage: string;
		jobs: { title: string };
	}>;
	isTracked?: boolean;
}

export function CandidateSidebar({
	candidate,
	jobs,
	applications = [],
	isTracked = false,
}: CandidateSidebarProps) {
	const initials = candidate.full_name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	// Mock skills data
	const primarySkills = [
		"TypeScript",
		"Node.js",
		"React & Next.js",
		"PostgreSQL",
		"Kubernetes",
		"AWS Architecture",
	];
	const secondarySkills = ["GraphQL", "Rust"];

	// Mock application progress - use real pipeline stages if available
	const progressStages = [
		{ name: "Technical Screen", status: "completed", date: "Completed yesterday" },
		{ name: "Phone Interview", status: "completed", date: "Completed 3 days ago" },
		{ name: "Culture Fit", status: "scheduled", date: "Scheduled for Oct 24" },
	];

	// Get latest application stage if available
	const latestApplication = applications[0];
	const currentStage = latestApplication?.stage || "New";

	return (
		<aside className="space-y-6">
			{/* Profile Summary Card */}
			<Card>
				<CardContent className="p-6">
					<div className="flex flex-col items-center text-center">
						<div className="relative">
							<Avatar className="size-32 rounded-full border-4 border-primary/10">
								<AvatarFallback className="rounded-full bg-primary/10 text-primary text-3xl">
									{initials}
								</AvatarFallback>
							</Avatar>
							<span className="absolute bottom-2 right-2 size-5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
						</div>
						<h1 className="mt-4 text-2xl font-bold">{candidate.full_name}</h1>
						{candidate.current_title && (
							<p className="text-primary font-medium">{candidate.current_title}</p>
						)}
						{candidate.location && (
							<div className="mt-2 flex items-center gap-2 text-muted-foreground text-sm">
								<MapPin className="size-4" />
								{candidate.location}
								{candidate.location?.toLowerCase().includes("remote") ? "" : " • Open to Remote"}
							</div>
						)}
						<div className="flex gap-3 mt-6 w-full">
							{candidate.resume_url ? (
								<ResumeViewer
									resumeUrl={candidate.resume_url}
									candidateName={candidate.full_name}
								/>
							) : (
								<Button className="flex-1" variant="default" disabled>
									<Download className="mr-2 size-4" />
									CV
								</Button>
							)}
							<AddToJobDialog candidateId={candidate.id} jobs={jobs} />
						</div>
						<div className="mt-3 w-full">
							<AddToTrackingButton
								candidateId={candidate.id}
								isTracked={isTracked}
							/>
						</div>
					</div>
					<hr className="my-6 border-border" />
					<div className="space-y-4">
						{candidate.email && (
							<div className="flex items-center gap-3 text-sm">
								<Mail className="size-4 text-muted-foreground" />
								<a
									href={`mailto:${candidate.email}`}
									className="text-foreground hover:text-primary"
								>
									{candidate.email}
								</a>
							</div>
						)}
						{candidate.phone && (
							<div className="flex items-center gap-3 text-sm">
								<Phone className="size-4 text-muted-foreground" />
								<a
									href={`tel:${candidate.phone}`}
									className="text-foreground hover:text-primary"
								>
									{candidate.phone}
								</a>
							</div>
						)}
						{candidate.linkedin_url && (
							<div className="flex items-center gap-3 text-sm">
								<ExternalLink className="size-4 text-muted-foreground" />
								<a
									href={candidate.linkedin_url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:underline"
								>
									{candidate.linkedin_url.replace(/^https?:\/\//, "")}
								</a>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Technical Skills */}
			<Card>
				<CardContent className="p-6">
					<h3 className="text-sm font-bold uppercase tracking-wider mb-4">
						Core Competencies
					</h3>
					<div className="flex flex-wrap gap-2">
						{primarySkills.map((skill) => (
							<Badge
								key={skill}
								variant="default"
								className="bg-primary/10 text-primary hover:bg-primary/20"
							>
								{skill}
							</Badge>
						))}
						{secondarySkills.map((skill) => (
							<Badge key={skill} variant="secondary">
								{skill}
							</Badge>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Application Progress */}
			<Card>
				<CardContent className="p-6">
					<h3 className="text-sm font-bold uppercase tracking-wider mb-4">
						Application Progress
					</h3>
					<div className="space-y-4">
						{progressStages.map((stage, index) => (
							<div key={stage.name} className="flex gap-3">
								<div className="flex flex-col items-center">
									<div
										className={`size-2 rounded-full mt-1.5 ${
											stage.status === "completed"
												? "bg-primary"
												: "bg-muted"
										}`}
									></div>
									{index < progressStages.length - 1 && (
										<div className="w-px h-full bg-border my-1"></div>
									)}
								</div>
								<div>
									<p
										className={`text-xs font-bold ${
											stage.status === "completed"
												? "text-foreground"
												: "text-muted-foreground"
										}`}
									>
										{stage.name}
									</p>
									<p className="text-[10px] text-muted-foreground">{stage.date}</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</aside>
	);
}
