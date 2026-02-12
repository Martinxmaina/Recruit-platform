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
import { ArrowUpDown, MoreHorizontal, Building2, LayoutGrid, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
import { ClientsCardView } from "./clients-card-view";

export type Client = {
	id: string;
	name: string;
	industry: string | null;
	status: string;
	contact_email: string | null;
	contact_person: string | null;
	contact_phone: string | null;
	website: string | null;
	address: string | null;
	created_at: string | null;
	updated_at: string | null;
};

const columns: ColumnDef<Client>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="h-8 px-2"
				>
					Company
					<ArrowUpDown className="ml-2 size-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const client = row.original;
			return (
				<div className="flex items-center gap-3">
					<Avatar className="size-8">
						<AvatarFallback className="bg-primary/10 text-primary">
							<Building2 className="size-4" />
						</AvatarFallback>
					</Avatar>
					<Link
						href={`/clients/${client.id}`}
						className="font-medium hover:underline"
					>
						{client.name}
					</Link>
				</div>
			);
		},
	},
	{
		accessorKey: "industry",
		header: "Industry",
		cell: ({ row }) => {
			return (
				<span className="text-muted-foreground">
					{row.getValue("industry") || "—"}
				</span>
			);
		},
	},
	{
		accessorKey: "contact_person",
		header: "Contact",
		cell: ({ row }) => {
			const client = row.original;
			return (
				<div className="text-sm">
					{client.contact_person && (
						<div className="font-medium">{client.contact_person}</div>
					)}
					{client.contact_email && (
						<div className="text-muted-foreground">{client.contact_email}</div>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.getValue("status") as string;
			return (
				<Badge
					variant={
						status === "active"
							? "default"
							: status === "inactive"
								? "secondary"
								: "outline"
					}
				>
					{status.charAt(0).toUpperCase() + status.slice(1)}
				</Badge>
			);
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const client = row.original;

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
							<Link href={`/clients/${client.id}`}>View details</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href={`/clients/${client.id}/edit`}>Edit</Link>
						</DropdownMenuItem>
						<DropdownMenuItem className="text-destructive">
							Archive
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

interface ClientsTableProps {
	initialData: Client[];
}

export function ClientsTable({ initialData }: ClientsTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [viewMode, setViewMode] = React.useState<"table" | "card">("table");
	const [data] = React.useState<Client[]>(initialData);

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

	// Filter data for card view
	const filteredData = React.useMemo(() => {
		let filtered = data;

		// Apply status filter
		const statusFilter = columnFilters.find((f) => f.id === "status");
		if (statusFilter?.value && statusFilter.value !== "all") {
			filtered = filtered.filter((client) => client.status === statusFilter.value);
		}

		// Apply search filter
		const nameFilter = columnFilters.find((f) => f.id === "name");
		if (nameFilter?.value) {
			const searchTerm = (nameFilter.value as string).toLowerCase();
			filtered = filtered.filter(
				(client) =>
					client.name.toLowerCase().includes(searchTerm) ||
					client.industry?.toLowerCase().includes(searchTerm)
			);
		}

		return filtered;
	}, [data, columnFilters]);

	return (
		<div className="w-full space-y-4">
			<div className="flex items-center gap-4">
				<Input
					placeholder="Search clients..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<Select
					value={(columnFilters.find((f) => f.id === "status")?.value as string) ?? "all"}
					onValueChange={(value) => {
						if (value === "all") {
							setColumnFilters((prev) => prev.filter((f) => f.id !== "status"));
						} else {
							setColumnFilters((prev) => [
								...prev.filter((f) => f.id !== "status"),
								{ id: "status", value },
							]);
						}
					}}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Filter by status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="active">Active</SelectItem>
						<SelectItem value="inactive">Inactive</SelectItem>
						<SelectItem value="archived">Archived</SelectItem>
					</SelectContent>
				</Select>
				<div className="ml-auto flex items-center gap-2">
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
				</div>
			</div>

			{viewMode === "card" ? (
				<ClientsCardView clients={filteredData} />
			) : (
				<>
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
											No clients found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
					<div className="flex items-center justify-end space-x-2">
						<div className="text-muted-foreground text-sm">
							{table.getFilteredRowModel().rows.length} client(s)
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
				</>
			)}
		</div>
	);
}
