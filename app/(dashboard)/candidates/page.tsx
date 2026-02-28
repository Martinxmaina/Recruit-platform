import { getCandidates } from "./actions";
import { getJobs } from "@/app/(dashboard)/jobs/actions";
import { CandidatesList } from "@/components/candidates/candidates-list";
import { ExportCandidatesCsvButton } from "@/components/dashboard/csv-export-buttons";

export default async function CandidatesPage({
	searchParams,
}: {
	searchParams: Promise<{
		search?: string;
		source?: string;
		location?: string;
		job_id?: string;
		date_range?: string;
		sort?: string;
		group_by?: string;
	}>;
}) {
	const params = await searchParams;
	const [candidates, jobs] = await Promise.all([
		getCandidates({
			search: params.search,
			source: params.source,
			location: params.location,
			job_id: params.job_id,
			date_range:
				params.date_range === "7" || params.date_range === "30" || params.date_range === "90"
					? params.date_range
					: undefined,
			sort:
				params.sort === "old" || params.sort === "name_asc" || params.sort === "name_desc"
					? params.sort
					: "new",
		}),
		getJobs(),
	]);

	const groupBy =
		params.group_by === "stage" || params.group_by === "job" ? params.group_by : "none";

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<ExportCandidatesCsvButton />
			</div>
			<CandidatesList
				initialCandidates={candidates}
				jobs={jobs.map((j) => ({ id: j.id, title: j.title }))}
				initialGroupBy={groupBy}
				initialSort={params.sort ?? "new"}
				initialLocation={params.location}
				initialJobId={params.job_id}
				initialDateRange={params.date_range ?? "all"}
				initialSource={params.source}
			/>
		</div>
	);
}
