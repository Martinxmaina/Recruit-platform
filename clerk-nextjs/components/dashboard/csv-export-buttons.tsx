"use client";

import { useTransition } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	getCandidatesForExport,
	getJobsForExport,
} from "@/app/(dashboard)/dashboard/actions";

function toCsv(rows: Record<string, unknown>[]) {
	if (rows.length === 0) return "";
	const headers = Object.keys(rows[0]);
	const lines = [
		headers.join(","),
		...rows.map((row) =>
			headers
				.map((h) => {
					const val = row[h] ?? "";
					const str = String(val).replace(/"/g, '""');
					return `"${str}"`;
				})
				.join(",")
		),
	];
	return lines.join("\n");
}

function downloadCsv(csv: string, filename: string) {
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

export function ExportCandidatesCsvButton() {
	const [isPending, startTransition] = useTransition();

	const handleExport = () => {
		startTransition(async () => {
			const data = await getCandidatesForExport();
			const csv = toCsv(data);
			downloadCsv(csv, `candidates-${new Date().toISOString().slice(0, 10)}.csv`);
		});
	};

	return (
		<Button variant="outline" size="sm" onClick={handleExport} disabled={isPending} className="gap-1.5">
			<Download className="size-3.5" />
			{isPending ? "Exporting..." : "Export CSV"}
		</Button>
	);
}

export function ExportJobsCsvButton() {
	const [isPending, startTransition] = useTransition();

	const handleExport = () => {
		startTransition(async () => {
			const data = await getJobsForExport();
			const csv = toCsv(data);
			downloadCsv(csv, `jobs-${new Date().toISOString().slice(0, 10)}.csv`);
		});
	};

	return (
		<Button variant="outline" size="sm" onClick={handleExport} disabled={isPending} className="gap-1.5">
			<Download className="size-3.5" />
			{isPending ? "Exporting..." : "Export CSV"}
		</Button>
	);
}
