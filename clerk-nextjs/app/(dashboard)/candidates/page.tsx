import { getCandidates } from "./actions";
import { CandidatesList } from "@/components/candidates/candidates-list";
import { ExportCandidatesCsvButton } from "@/components/dashboard/csv-export-buttons";

export default async function CandidatesPage({
	searchParams,
}: {
	searchParams: Promise<{
		search?: string;
		source?: string;
		sort?: string;
	}>;
}) {
	const params = await searchParams;
	const candidates = await getCandidates({
		search: params.search,
		source: params.source,
		sort: params.sort,
	});

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<ExportCandidatesCsvButton />
			</div>
			<CandidatesList
				initialCandidates={candidates}
			/>
		</div>
	);
}
