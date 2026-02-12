import { notFound } from "next/navigation";
import { getClient } from "@/app/(dashboard)/clients/actions";
import { ClientHeader } from "@/components/clients/client-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientOverview } from "@/components/clients/client-overview";
import { ClientJobsTab } from "@/components/clients/client-jobs-tab";
import { ClientCandidatesTab } from "@/components/clients/client-candidates-tab";
import { ClientActivityTab } from "@/components/clients/client-activity-tab";
import { ClientNotesTab } from "@/components/clients/client-notes-tab";

export default async function ClientDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const client = await getClient(id);

	if (!client) {
		notFound();
	}

	return (
		<div className="space-y-6">
			<ClientHeader client={client} />

			<Tabs defaultValue="overview" className="space-y-4">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="jobs">Active Jobs</TabsTrigger>
					<TabsTrigger value="candidates">Candidates</TabsTrigger>
					<TabsTrigger value="activity">Activity</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-4">
					<ClientOverview client={client} />
				</TabsContent>

				<TabsContent value="jobs" className="space-y-4">
					<ClientJobsTab clientId={client.id} />
				</TabsContent>

				<TabsContent value="candidates" className="space-y-4">
					<ClientCandidatesTab clientId={client.id} />
				</TabsContent>

				<TabsContent value="notes" className="space-y-4">
					<ClientNotesTab clientId={client.id} />
				</TabsContent>

				<TabsContent value="activity" className="space-y-4">
					<ClientActivityTab clientId={client.id} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
