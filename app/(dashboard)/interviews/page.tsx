import { getInterviews } from "./actions";
import { getJobs } from "@/app/(dashboard)/jobs/actions";
import { formatDate } from "@/lib/utils/date";
import { InterviewsCalendar } from "@/components/interviews/interviews-calendar";
import { InterviewsFilterBar } from "@/components/interviews/interviews-filter-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function InterviewsPage({
	searchParams,
}: {
	searchParams: Promise<{ job_id?: string; status?: string; upcoming?: string }>;
}) {
	const params = await searchParams;
	const upcoming =
		params.upcoming === "true" ? true : params.upcoming === "false" ? false : undefined;
	const [interviews, jobs] = await Promise.all([
		getInterviews({
			job_id: params.job_id,
			status: params.status,
			upcoming,
		}),
		getJobs(),
	]);
	const jobsForFilter = jobs.map((j) => ({ id: j.id, title: j.title }));

	const calendarInterviews = interviews.map((i: any) => {
		const raw = i.scheduled_at ?? "";
		const scheduledAt = raw && !raw.endsWith("Z") ? `${raw.replace(/Z?$/, "")}Z` : raw;
		return {
		id: i.id,
		scheduled_at: scheduledAt,
		status: i.status,
		candidate_name: i.applications?.candidates?.full_name ?? "Unknown",
		job_title: i.applications?.jobs?.title ?? "Unknown",
		notes: i.notes ?? null,
		interviewer_name: i.interviewer_name ?? null,
		stage: i.applications?.stage ?? null,
	};
	});

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-xl font-bold tracking-tight">Interviews</h1>
				<p className="text-sm text-muted-foreground">
					View and manage scheduled interviews.
				</p>
			</div>

			<InterviewsFilterBar
				jobs={jobsForFilter}
				initialJobId={params.job_id}
				initialStatus={params.status}
				initialUpcoming={params.upcoming ?? ""}
			/>

			<Tabs defaultValue="calendar" className="space-y-4">
				<TabsList>
					<TabsTrigger value="calendar">Calendar</TabsTrigger>
					<TabsTrigger value="list">List</TabsTrigger>
				</TabsList>

				<TabsContent value="calendar">
					<InterviewsCalendar interviews={calendarInterviews} />
				</TabsContent>

				<TabsContent value="list">
					<Card>
						<CardHeader>
							<CardTitle className="text-sm">All Interviews</CardTitle>
						</CardHeader>
						<CardContent>
							{interviews.length === 0 ? (
								<p className="py-8 text-center text-sm text-muted-foreground">
									No interviews scheduled.
								</p>
							) : (
								<div className="space-y-3">
									{interviews.map((interview: any) => (
										<div
											key={interview.id}
											className="flex items-center justify-between rounded-lg border p-3"
										>
											<div className="space-y-1">
												<p className="text-sm font-medium">
													{interview.applications?.candidates?.full_name ?? "Unknown Candidate"}
												</p>
												<p className="text-xs text-muted-foreground">
													{interview.applications?.jobs?.title ?? "Unknown Job"}
												</p>
											</div>
											<div className="flex items-center gap-3">
												<div className="text-right">
													<p className="text-xs font-medium">
														{formatDate(interview.scheduled_at)}
													</p>
													<p className="text-[10px] text-muted-foreground">
														{new Date(interview.scheduled_at).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
														})}
													</p>
												</div>
												<Badge
													variant={
														interview.status === "completed"
															? "default"
															: interview.status === "cancelled"
																? "destructive"
																: "secondary"
													}
													className="text-[10px]"
												>
													{interview.status}
												</Badge>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
