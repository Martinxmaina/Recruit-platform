"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CandidatesFilterBar } from "./candidates-filter-bar";
import { CandidatesTable } from "./candidates-table";
import { CandidatesCardGrid } from "./candidates-card-grid";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import type { Candidate } from "@/app/(dashboard)/candidates/actions";

type CandidateWithApplications = Candidate & {
	applications?: Array<{
		id: string;
		stage: string;
		status: string;
		screening_score: number | null;
		jobs?: { id: string; title: string } | null;
	}>;
};

interface CandidatesListProps {
	initialCandidates: CandidateWithApplications[];
}

export function CandidatesList({ initialCandidates }: CandidatesListProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [viewMode, setViewMode] = useState<"table" | "card">("table");

	const handleFiltersChange = (filters: {
		search?: string;
		source?: string;
	}) => {
		const params = new URLSearchParams();
		if (filters.search) params.set("search", filters.search);
		if (filters.source) params.set("source", filters.source);
		router.push(`/candidates?${params.toString()}`);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Candidates</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Manage candidate database ({initialCandidates.length} total)
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant={viewMode === "table" ? "default" : "outline"}
						size="icon"
						onClick={() => setViewMode("table")}
					>
						<List className="size-4" />
					</Button>
					<Button
						variant={viewMode === "card" ? "default" : "outline"}
						size="icon"
						onClick={() => setViewMode("card")}
					>
						<LayoutGrid className="size-4" />
					</Button>
					<Button asChild>
						<Link href="/candidates/new">
							<Plus className="mr-2 size-4" />
							Add Candidate
						</Link>
					</Button>
				</div>
			</div>

			<CandidatesFilterBar onFiltersChange={handleFiltersChange} />

			{viewMode === "card" ? (
				<CandidatesCardGrid candidates={initialCandidates} />
			) : (
				<CandidatesTable initialData={initialCandidates} />
			)}
		</div>
	);
}
