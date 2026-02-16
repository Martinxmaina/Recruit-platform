import { auth } from "@clerk/nextjs/server";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { UpcomingInterviews } from "@/components/dashboard/upcoming-interviews";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { PipelineFunnelChart } from "@/components/dashboard/pipeline-funnel-chart";
import { InterviewAnalytics } from "@/components/dashboard/interview-analytics";
import {
	getDashboardStats,
	getUpcomingInterviews,
	getRecentActivity,
	getApplicationsOverTime,
	getJobStatusDistribution,
	getPipelineConversionMetrics,
	getInterviewAnalytics,
} from "@/app/(dashboard)/dashboard/actions";

const EMPTY_STATS = {
	activeJobs: 0,
	candidates: 0,
	interviewsThisWeek: 0,
	placements: 0,
};
const EMPTY_INTERVIEW_ANALYTICS = {
	completionRate: 0,
	avgDaysToHire: 0,
	byStatus: [] as { name: string; value: number }[],
};

export default async function DashboardPage() {
	const { sessionClaims } = await auth();
	const firstName = sessionClaims?.firstName as string | undefined;
	const displayName = firstName ?? "there";

	const supabaseConfigured =
		!!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

	const [stats, interviews, activity, appTrends, jobStatus, pipelineFunnel, interviewAnalytics] =
		supabaseConfigured
			? await Promise.all([
					getDashboardStats(),
					getUpcomingInterviews(),
					getRecentActivity(),
					getApplicationsOverTime(),
					getJobStatusDistribution(),
					getPipelineConversionMetrics(),
					getInterviewAnalytics(),
				])
			: [
					EMPTY_STATS,
					[],
					[],
					[],
					[],
					[],
					EMPTY_INTERVIEW_ANALYTICS,
				];

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-bold tracking-tight">Dashboard</h2>
					<p className="text-sm text-muted-foreground">
						Welcome back, {displayName}. Overview of your recruitment pipeline.
					</p>
				</div>
			</div>

			<StatsCards stats={stats} />

			<DashboardCharts
				applicationsOverTime={appTrends}
				jobStatusDistribution={jobStatus}
			/>

			{/* Pipeline funnel + interview analytics */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<PipelineFunnelChart data={pipelineFunnel} />
				<InterviewAnalytics
					completionRate={interviewAnalytics.completionRate}
					avgDaysToHire={interviewAnalytics.avgDaysToHire}
					byStatus={interviewAnalytics.byStatus}
				/>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<UpcomingInterviews interviews={interviews} />
				</div>
				<div className="lg:col-span-1">
					<RecentActivity activity={activity} />
				</div>
			</div>
		</div>
	);
}
