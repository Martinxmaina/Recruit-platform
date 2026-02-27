"use client";

import Link from "next/link";
import { User, Mail, Phone, MapPin, Briefcase, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Candidate } from "@/app/(dashboard)/candidates/actions";

interface CandidatesCardGridProps {
	candidates: Array<
		Candidate & {
			applications?: Array<{
				id: string;
				stage: string;
				status: string;
				screening_score: number | null;
				jobs?: { id: string; title: string } | null;
			}>;
		}
	>;
}

export function CandidatesCardGrid({ candidates }: CandidatesCardGridProps) {
	if (candidates.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<User className="mb-4 size-12 text-muted-foreground" />
				<p className="text-muted-foreground">No candidates found.</p>
			</div>
		);
	}

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{candidates.map((candidate) => {
				const applications = candidate.applications || [];
				const applicationsCount = applications.length;
				const latestApplication = applications[0];
				const avgScore =
					applications.length > 0
						? applications.reduce((sum, app) => sum + (app.screening_score ?? 0), 0) /
							applications.length
						: null;

				return (
					<Card key={candidate.id} className="flex flex-col hover:shadow-md transition-shadow">
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3">
									<Avatar className="size-12">
										<AvatarFallback className="bg-primary/10 text-primary">
											{getInitials(candidate.full_name)}
										</AvatarFallback>
									</Avatar>
									<div>
										<Link
											href={`/candidates/${candidate.id}`}
											className="font-semibold text-lg hover:underline"
										>
											{candidate.full_name}
										</Link>
										{candidate.current_title && (
											<p className="text-sm text-muted-foreground">
												{candidate.current_title}
											</p>
										)}
									</div>
								</div>
								{avgScore !== null && (
									<Badge variant={avgScore >= 70 ? "default" : avgScore >= 50 ? "secondary" : "outline"}>
										{Math.round(avgScore)}%
									</Badge>
								)}
							</div>
						</CardHeader>
						<CardContent className="flex-1 space-y-2">
							{candidate.current_company && (
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Briefcase className="size-4" />
									{candidate.current_company}
								</div>
							)}
							{candidate.email && (
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Mail className="size-4" />
									<span className="truncate">{candidate.email}</span>
								</div>
							)}
							{candidate.location && (
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<MapPin className="size-4" />
									{candidate.location}
								</div>
							)}
							{latestApplication && (
								<div className="pt-2 border-t">
									<p className="text-xs text-muted-foreground mb-1">Latest Application</p>
									<div className="flex items-center gap-2">
										<Badge variant="outline" className="text-xs">
											{latestApplication.stage}
										</Badge>
										{latestApplication.jobs && (
											<span className="text-xs text-muted-foreground truncate">
												{latestApplication.jobs.title}
											</span>
										)}
									</div>
								</div>
							)}
							{applicationsCount > 0 && (
								<p className="text-xs text-muted-foreground">
									{applicationsCount} application{applicationsCount !== 1 ? "s" : ""}
								</p>
							)}
						</CardContent>
						<CardFooter className="flex items-center justify-between pt-4 border-t">
							{candidate.linkedin_url && (
								<a
									href={candidate.linkedin_url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:underline text-sm flex items-center gap-1"
								>
									<ExternalLink className="size-3" />
									LinkedIn
								</a>
							)}
							<Button variant="outline" size="sm" asChild>
								<Link href={`/candidates/${candidate.id}`}>View Details</Link>
							</Button>
						</CardFooter>
					</Card>
				);
			})}
		</div>
	);
}
