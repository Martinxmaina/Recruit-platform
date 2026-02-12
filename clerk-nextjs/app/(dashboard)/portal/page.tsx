import { getPortalJobs, getPortalShortlist } from "./actions";
import { ClientJobList } from "@/components/portal/client-job-list";
import { ClientShortlist } from "@/components/portal/client-shortlist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function PortalPage() {
	const [jobs, shortlist] = await Promise.all([
		getPortalJobs(),
		getPortalShortlist(),
	]);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-xl font-bold tracking-tight">Client Portal</h1>
				<p className="text-sm text-muted-foreground">
					View your jobs, track candidates, and review shortlists.
				</p>
			</div>

			<Tabs defaultValue="jobs" className="space-y-4">
				<TabsList>
					<TabsTrigger value="jobs">Active Jobs ({jobs.length})</TabsTrigger>
					<TabsTrigger value="shortlist">Shortlist ({shortlist.length})</TabsTrigger>
				</TabsList>

				<TabsContent value="jobs">
					<ClientJobList jobs={jobs} />
				</TabsContent>

				<TabsContent value="shortlist">
					<ClientShortlist candidates={shortlist} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
