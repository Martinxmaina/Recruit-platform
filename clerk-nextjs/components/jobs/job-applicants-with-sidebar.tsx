"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/date";

interface JobApplicantsWithSidebarProps {
	applications: any[];
}

function getInitials(name: string | null | undefined) {
	if (!name) return "?";
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export function JobApplicantsWithSidebar({
	applications,
}: JobApplicantsWithSidebarProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const selectedApplication = applications[selectedIndex] ?? applications[0];
	const candidate = selectedApplication?.candidates ?? null;

	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<div className="lg:col-span-2">
				<div className="overflow-hidden rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Candidate</TableHead>
								<TableHead>Applied Date</TableHead>
								<TableHead>Stage</TableHead>
								<TableHead>Screening Score</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{applications.map((application: any, index: number) => {
								const c = application.candidates;
								if (!c) return null;
								const initials = getInitials(c.full_name);
								const isSelected = index === selectedIndex;

								return (
									<TableRow
										key={application.id}
										className={isSelected ? "bg-muted/40" : ""}
										onClick={() => setSelectedIndex(index)}
									>
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar className="size-8">
													<AvatarFallback className="bg-primary/10 text-primary">
														{initials}
													</AvatarFallback>
												</Avatar>
												<div>
													<div className="font-medium">{c.full_name}</div>
													{c.email && (
														<div className="text-sm text-muted-foreground">
															{c.email}
														</div>
													)}
												</div>
											</div>
										</TableCell>
										<TableCell className="text-muted-foreground">
											{application.applied_at
												? formatDate(application.applied_at)
												: "—"}
										</TableCell>
										<TableCell>
											<Badge variant="outline">{application.stage}</Badge>
										</TableCell>
										<TableCell>
											{application.screening_score !== null &&
											application.screening_score !== undefined ? (
												<Badge
													variant={
														application.screening_score >= 70
															? "default"
															: application.screening_score >= 50
																? "secondary"
																: "outline"
													}
												>
													{application.screening_score}%
												</Badge>
											) : (
												<span className="text-muted-foreground">—</span>
											)}
										</TableCell>
										<TableCell>
											<Badge
												variant={
													application.status === "active"
														? "default"
														: application.status === "rejected"
															? "secondary"
															: "outline"
												}
											>
												{application.status}
											</Badge>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</div>

			<div className="lg:col-span-1">
				{candidate ? (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between gap-2">
								<span>{candidate.full_name}</span>
								<Badge variant="outline" className="text-xs">
									{selectedApplication.stage}
								</Badge>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4 text-sm">
							<div className="space-y-1">
								{candidate.current_title && (
									<div className="font-medium">{candidate.current_title}</div>
								)}
								{candidate.current_company && (
									<div className="text-muted-foreground">
										{candidate.current_company}
									</div>
								)}
							</div>

							<div className="space-y-1">
								{candidate.email && (
									<div className="flex justify-between gap-2">
										<span className="text-muted-foreground">Email</span>
										<a
											href={`mailto:${candidate.email}`}
											className="truncate text-right text-primary hover:underline"
										>
											{candidate.email}
										</a>
									</div>
								)}
								{candidate.phone && (
									<div className="flex justify-between gap-2">
										<span className="text-muted-foreground">Phone</span>
										<a
											href={`tel:${candidate.phone}`}
											className="truncate text-right"
										>
											{candidate.phone}
										</a>
									</div>
								)}
								{candidate.location && (
									<div className="flex justify-between gap-2">
										<span className="text-muted-foreground">Location</span>
										<span className="truncate text-right">
											{candidate.location}
										</span>
									</div>
								)}
								{candidate.source && (
									<div className="flex justify-between gap-2">
										<span className="text-muted-foreground">Source</span>
										<span className="truncate text-right">
											{candidate.source}
										</span>
									</div>
								)}
								{candidate.linkedin_url && (
									<div className="flex justify-between gap-2">
										<span className="text-muted-foreground">LinkedIn</span>
										<a
											href={candidate.linkedin_url}
											target="_blank"
											rel="noopener noreferrer"
											className="truncate text-right text-primary hover:underline"
										>
											{candidate.linkedin_url.replace(/^https?:\/\//, "")}
										</a>
									</div>
								)}
							</div>

							<div className="space-y-1">
								<div className="flex justify-between gap-2">
									<span className="text-muted-foreground">Applied</span>
									<span className="text-right">
										{selectedApplication.applied_at
											? formatDate(selectedApplication.applied_at)
											: "—"}
									</span>
								</div>
								<div className="flex justify-between gap-2">
									<span className="text-muted-foreground">Status</span>
									<span className="text-right">
										{selectedApplication.status}
									</span>
								</div>
								<div className="flex justify-between gap-2">
									<span className="text-muted-foreground">
										Screening score
									</span>
									<span className="text-right">
										{selectedApplication.screening_score ??
											"—"}
									</span>
								</div>
							</div>

							<div className="pt-2">
								<Button asChild variant="outline" className="w-full">
									<Link href={`/candidates/${candidate.id}`}>
										Open full profile
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				) : (
					<Card>
						<CardContent className="py-10 text-center text-sm text-muted-foreground">
							No candidate details available.
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}

