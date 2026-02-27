import { getJobApplications } from "@/app/(dashboard)/applications/actions";
import { getPipelineStages } from "@/app/(dashboard)/pipeline-stages/actions";
import { JobPipelineKanban } from "./job-pipeline-kanban";

interface JobPipelineTabProps {
	jobId: string;
	jobTitle?: string;
}

export async function JobPipelineTab({ jobId, jobTitle }: JobPipelineTabProps) {
	try {
		const [applications, stages] = await Promise.all([
			getJobApplications(jobId),
			getPipelineStages(),
		]);

		if (stages.length === 0) {
			console.warn("No pipeline stages found for organization");
			return (
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<p className="text-muted-foreground">
						No pipeline stages configured. Please configure stages in settings.
					</p>
				</div>
			);
		}

		// Filter out applications without candidate data
		const validApplications = applications.filter(
			(app: any) => app.candidates && app.candidates.full_name
		);

		return (
			<div className="space-y-4">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-sm text-muted-foreground">
						Drag and drop applications to move them between stages
					</p>
					<div className="text-xs text-muted-foreground">
						{stages.length} stages, {validApplications.length} applications
					</div>
				</div>
				<JobPipelineKanban stages={stages} applications={validApplications} jobTitle={jobTitle} />
			</div>
		);
	} catch (error) {
		console.error("Error loading pipeline tab:", error);
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<p className="text-destructive">
					Failed to load pipeline. Please try refreshing the page.
				</p>
			</div>
		);
	}
}
