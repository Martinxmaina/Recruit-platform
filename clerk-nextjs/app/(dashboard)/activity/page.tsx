import { getUserActivity, getActivityStats } from "./actions";
import { UserWorklog } from "@/components/activity/user-worklog";

export default async function ActivityPage() {
	// Get activities for the last 30 days
	const endDate = new Date();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - 30);

	const [activities, stats] = await Promise.all([
		getUserActivity({
			start: startDate.toISOString(),
			end: endDate.toISOString(),
		}),
		getActivityStats({
			start: startDate.toISOString(),
			end: endDate.toISOString(),
		}),
	]);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">My Activity & Worklog</h1>
				<p className="text-sm text-muted-foreground">
					Track your work activities, time spent, and all actions performed.
				</p>
			</div>

			<UserWorklog activities={activities} stats={stats} />
		</div>
	);
}
