import { notFound } from "next/navigation";
import { getJob } from "@/app/(dashboard)/jobs/actions";
import { getClients } from "@/app/(dashboard)/clients/actions";
import { JobForm } from "@/components/jobs/job-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditJobPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const [job, clients] = await Promise.all([getJob(id), getClients()]);

	if (!job) {
		notFound();
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Edit Job</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Update job information
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Job Information</CardTitle>
				</CardHeader>
				<CardContent>
					<JobForm
						job={job}
						clients={clients.map((c) => ({ id: c.id, name: c.name }))}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
