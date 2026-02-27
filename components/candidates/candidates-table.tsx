"use client";

import * as React from "react";
import Link from "next/link";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, User, Mail, Briefcase } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Candidate } from "@/app/(dashboard)/candidates/actions";
import { AddToTrackingButton } from "@/components/tracking/add-to-tracking-button";

type CandidateWithApplications = Candidate & {
	applications?: Array<{
		id: string;
		stage: string;
		status: string;
		screening_score: number | null;
		jobs?: { id: string; title: string } | null;
	}>;
};

const columns: ColumnDef<CandidateWithApplications>[] = [
	{
		accessorKey: "full_name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="h-8 px-2"
				>
					Candidate
					<ArrowUpDown className="ml-2 size-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const candidate = row.original;
			const initials = candidate.full_name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2);

			return (
				<div className="flex items-center gap-3">
					<Avatar className="size-8">
						<AvatarFallback className="bg-primary/10 text-primary">
							{initials}
						</AvatarFallback>
					</Avatar>
					<Link
						href={`/candidates/${candidate.id}`}
						className="font-medium hover:underline"
					>
						{candidate.full_name}
					</Link>
				</div>
			);
		},
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => {
			return (
				<span className="text-muted-foreground">
					{row.getValue("email") || "—"}
				</span>
			);
		},
	},
	{
		accessorKey: "current_title",
		header: "Current Role",
		cell: ({ row }) => {
			const candidate = row.original;
			return (
				<div className="text-sm">
					{candidate.current_title && (
						<div className="font-medium">{candidate.current_title}</div>
					)}
					{candidate.current_company && (
						<div className="text-muted-foreground">{candidate.current_company}</div>
					)}
					{!candidate.current_title && !candidate.current_company && "—"}
				</div>
			);
		},
	},
	{
		id: "applied_to",
		header: "Applied To",
		cell: ({ row }) => {
			const candidate = row.original;
			const applications = candidate.applications || [];
			if (applications.length === 0) {
				return <span className="text-muted-foreground">—</span>;
			}
			const latestApp = applications[0];
			return (
				<div className="text-sm">
					{latestApp.jobs && (
						<Link
							href={`/jobs/${latestApp.jobs.id}`}
							className="text-primary hover:underline"
						>
							{latestApp.jobs.title}
						</Link>
					)}
					{applications.length > 1 && (
						<div className="text-xs text-muted-foreground">
							+{applications.length - 1} more
						</div>
					)}
				</div>
			);
		},
	},
	{
		id: "stage",
		header: "Stage",
		cell: ({ row }) => {
			const candidate = row.original;
			const applications = candidate.applications || [];
			if (applications.length === 0) {
				return <span className="text-muted-foreground">—</span>;
			}
			const latestApp = applications[0];
			return (
				<Badge variant="outline" className="text-xs">
					{latestApp.stage}
				</Badge>
			);
		},
	},
	{
		id: "score",
		header: "Score",
		cell: ({ row }) => {
			const candidate = row.original;
			const applications = candidate.applications || [];
			if (applications.length === 0) {
				return <span className="text-muted-foreground">—</span>;
			}
			const scores = applications
				.map((app) => app.screening_score)
				.filter((s): s is number => s !== null);
			if (scores.length === 0) {
				return <span className="text-muted-foreground">—</span>;
			}
			const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
			return (
				<Badge
					variant={avgScore >= 70 ? "default" : avgScore >= 50 ? "secondary" : "outline"}
				>
					{Math.round(avgScore)}%
				</Badge>
			);
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const candidate = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem asChild>
							<Link href={`/candidates/${candidate.id}`}>View details</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href={`/candidates/${candidate.id}/edit`}>Edit</Link>
						</DropdownMenuItem>
						<DropdownMenuItem className="text-destructive">
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
	{
		id: "tracking",
		header: "Tracking",
		cell: ({ row }) => {
			const candidate = row.original;
			return <AddToTrackingButton candidateId={candidate.id} />;
		},
	},
];

interface CandidatesTableProps {
	initialData: CandidateWithApplications[];
}

export function CandidatesTable({ initialData }: CandidatesTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [data] = React.useState<CandidateWithApplications[]>(initialData);

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
	});

	return (
		<div className="w-full space-y-4">
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No candidates found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2">
				<div className="text-muted-foreground text-sm">
					{table.getFilteredRowModel().rows.length} candidate(s)
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
