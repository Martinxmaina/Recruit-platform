import { getClients } from "@/app/(dashboard)/clients/actions";
import { JobForm } from "@/components/jobs/job-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewJobPage() {
	const clients = await getClients();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Add New Job</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Create a new job opening
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Job Information</CardTitle>
				</CardHeader>
				<CardContent>
					<JobForm clients={clients.map((c) => ({ id: c.id, name: c.name }))} />
				</CardContent>
			</Card>
		</div>
	);
}
