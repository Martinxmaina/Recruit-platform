import { getJobs } from "./actions";
import { getClients } from "@/app/(dashboard)/clients/actions";
import { JobsList } from "@/components/jobs/jobs-list";
import { ExportJobsCsvButton } from "@/components/dashboard/csv-export-buttons";

export default async function JobsPage({
	searchParams,
}: {
	searchParams: Promise<{
		search?: string;
		status?: string;
		work_type?: string;
		country?: string;
		client_id?: string;
	}>;
}) {
	const params = await searchParams;
	const jobs = await getJobs({
		search: params.search,
		status: params.status,
		work_type: params.work_type,
		country: params.country,
		client_id: params.client_id,
	});
	const clients = await getClients();

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<ExportJobsCsvButton />
			</div>
			<JobsList
				initialJobs={jobs}
				clients={clients.map((c) => ({ id: c.id, name: c.name }))}
			/>
		</div>
	);
}
