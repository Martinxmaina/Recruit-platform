import Link from "next/link";
import { GitBranch, ArrowRight } from "lucide-react";
import { getJobs } from "@/app/(dashboard)/jobs/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function PipelinesPage() {
	const jobs = await getJobs();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Pipelines</h1>
				<p className="text-sm text-muted-foreground">
					Manage candidate pipelines separately from the candidates database.
				</p>
			</div>

			{jobs.length === 0 ? (
				<Card>
					<CardContent className="py-10 text-center">
						<p className="text-sm text-muted-foreground">
							No jobs found. Create a job to start using pipelines.
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{jobs.map((job) => (
						<Card key={job.id}>
							<CardHeader className="space-y-2">
								<div className="flex items-start justify-between gap-2">
									<CardTitle className="text-base leading-tight">
										{job.title}
									</CardTitle>
									<Badge variant={job.status === "open" ? "default" : "secondary"}>
										{job.status}
									</Badge>
								</div>
								{job.clients?.name ? (
									<p className="text-xs text-muted-foreground">
										Client: {job.clients.name}
									</p>
								) : null}
							</CardHeader>
							<CardContent>
								<Button asChild className="w-full">
									<Link href={`/jobs/${job.id}?tab=pipeline`}>
										<GitBranch className="mr-2 size-4" />
										Open Pipeline
										<ArrowRight className="ml-2 size-4" />
									</Link>
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
