import { Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CandidateExperienceTabProps {
	candidateId: string;
}

export function CandidateExperienceTab({
	candidateId,
}: CandidateExperienceTabProps) {
	// Mock work history data
	const workHistory = [
		{
			title: "Engineering Lead",
			company: "ScaleUp Systems",
			period: "2021 – Present",
			achievements: [
				"Architected and deployed a distributed microservices platform handling 1M+ req/sec.",
				"Led a team of 12 engineers, mentoring through career growth and technical challenges.",
			],
		},
		{
			title: "Senior Software Engineer",
			company: "CloudNexus Inc.",
			period: "2018 – 2021",
			achievements: [
				"Redesigned core data ingestion pipeline, reducing latency by 65%.",
				"Implemented comprehensive CI/CD workflows using GitHub Actions and ArgoCD.",
			],
		},
	];

	if (workHistory.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Briefcase className="mb-4 size-12 text-muted-foreground" />
				<p className="text-muted-foreground">No work history available.</p>
				<p className="mt-2 text-sm text-muted-foreground">
					Work history will be displayed here when available from enriched profile data.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
			{workHistory.map((item, index) => (
				<div
					key={index}
					className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
				>
					<div className="flex items-center justify-center size-10 rounded-full border border-background bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
						<Briefcase className="size-5" />
					</div>
					<div className="w-[calc(100%-4rem)] md:w-[45%] bg-card p-5 rounded-xl border border-border shadow-sm">
						<div className="flex items-center justify-between mb-1">
							<h4 className="font-bold">{item.title}</h4>
							<Badge
								variant={index === 0 ? "default" : "secondary"}
								className="text-[10px] font-medium px-2 py-0.5"
							>
								{item.period}
							</Badge>
						</div>
						<div className="text-sm font-medium text-muted-foreground mb-3">
							{item.company}
						</div>
						<ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
							{item.achievements.map((achievement, i) => (
								<li key={i}>{achievement}</li>
							))}
						</ul>
					</div>
				</div>
			))}
		</div>
	);
}
