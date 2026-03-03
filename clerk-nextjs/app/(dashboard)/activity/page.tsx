import { getUserActivity, getOrgActivity, getActivityStats } from "./actions";
import { UserWorklog } from "@/components/activity/user-worklog";

export default async function ActivityPage() {
	const endDate = new Date();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - 30);
	const dateRange = {
		start: startDate.toISOString(),
		end: endDate.toISOString(),
	};

	const [activities, orgActivities, stats] = await Promise.all([
		getUserActivity(dateRange),
		getOrgActivity(dateRange),
		getActivityStats(dateRange),
	]);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Activity & Workflow</h1>
				<p className="text-sm text-muted-foreground">
					Track your work and see all team actions in one place.
				</p>
			</div>

			<UserWorklog
				activities={activities}
				orgActivities={orgActivities}
				stats={stats}
			/>
		</div>
	);
}
