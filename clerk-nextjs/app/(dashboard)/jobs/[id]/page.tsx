import { notFound } from "next/navigation";
import { getJob } from "@/app/(dashboard)/jobs/actions";
import { JobHeader } from "@/components/jobs/job-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobDescriptionTab } from "@/components/jobs/job-description-tab";
import { JobApplicantsTab } from "@/components/jobs/job-applicants-tab";
import { JobPipelineTab } from "@/components/jobs/job-pipeline-tab";
import { JobScreeningTab } from "@/components/jobs/job-screening-tab";
import { JobInterviewsTab } from "@/components/jobs/job-interviews-tab";
import { JobActivityTab } from "@/components/jobs/job-activity-tab";
import { JobNotesTab } from "@/components/jobs/job-notes-tab";

export default async function JobDetailsPage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ tab?: string }>;
}) {
	const { id } = await params;
	const { tab } = await searchParams;
	const job = await getJob(id);

	if (!job) {
		notFound();
	}

	const allowedTabs = [
		"description",
		"applicants",
		"pipeline",
		"screening",
		"interviews",
		"notes",
		"activity",
	] as const;
	const defaultTab = allowedTabs.includes((tab ?? "") as (typeof allowedTabs)[number])
		? (tab as (typeof allowedTabs)[number])
		: "description";

	return (
		<div className="space-y-6">
			<JobHeader job={job} />

			<Tabs defaultValue={defaultTab} className="space-y-4">
				<TabsList>
					<TabsTrigger value="description">Description</TabsTrigger>
					<TabsTrigger value="applicants">Applicants</TabsTrigger>
					<TabsTrigger value="pipeline">Pipeline</TabsTrigger>
					<TabsTrigger value="screening">Screening</TabsTrigger>
					<TabsTrigger value="interviews">Interviews</TabsTrigger>
					<TabsTrigger value="notes">Notes</TabsTrigger>
					<TabsTrigger value="activity">Activity</TabsTrigger>
				</TabsList>

				<TabsContent value="description" className="space-y-4">
					<JobDescriptionTab job={job} />
				</TabsContent>

				<TabsContent value="applicants" className="space-y-4">
					<JobApplicantsTab jobId={job.id} />
				</TabsContent>

				<TabsContent value="pipeline" className="space-y-4">
					<JobPipelineTab jobId={job.id} jobTitle={job.title} />
				</TabsContent>

				<TabsContent value="screening" className="space-y-4">
					<JobScreeningTab jobId={job.id} />
				</TabsContent>

				<TabsContent value="interviews" className="space-y-4">
					<JobInterviewsTab jobId={job.id} />
				</TabsContent>

				<TabsContent value="notes" className="space-y-4">
					<JobNotesTab jobId={job.id} />
				</TabsContent>

				<TabsContent value="activity" className="space-y-4">
					<JobActivityTab jobId={job.id} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
