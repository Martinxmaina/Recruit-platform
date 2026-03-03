"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface JobsFilterBarProps {
	onFiltersChange: (filters: {
		search?: string;
		status?: string;
		work_type?: string;
		country?: string;
		client_id?: string;
		sort?: string;
	}) => void;
	clients: Array<{ id: string; name: string }>;
}

export function JobsFilterBar({ onFiltersChange, clients }: JobsFilterBarProps) {
	const searchParams = useSearchParams();
	const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
	const [status, setStatus] = useState<string>(
		() => searchParams.get("status") ?? "all"
	);
	const [workType, setWorkType] = useState<string>(
		() => searchParams.get("work_type") ?? "all"
	);
	const [country, setCountry] = useState<string>(
		() => searchParams.get("country") ?? "all"
	);
	const [clientId, setClientId] = useState<string>(
		() => searchParams.get("client_id") ?? "all"
	);
	const [sort, setSort] = useState<string>(
		() => searchParams.get("sort") ?? "created_at_desc"
	);
	const [filtersOpen, setFiltersOpen] = useState(true);
	const isMounted = useRef(false);

	useEffect(() => {
		setSearch(searchParams.get("search") ?? "");
		setStatus(searchParams.get("status") ?? "all");
		setWorkType(searchParams.get("work_type") ?? "all");
		setCountry(searchParams.get("country") ?? "all");
		setClientId(searchParams.get("client_id") ?? "all");
		setSort(searchParams.get("sort") ?? "created_at_desc");
	}, [searchParams]);

	useEffect(() => {
		if (!isMounted.current) {
			isMounted.current = true;
			return;
		}
		const timeout = setTimeout(() => {
			onFiltersChange({
				search: search || undefined,
				status: status !== "all" ? status : undefined,
				work_type: workType !== "all" ? workType : undefined,
				country: country !== "all" ? country : undefined,
				client_id: clientId !== "all" ? clientId : undefined,
				sort: sort !== "created_at_desc" ? sort : undefined,
			});
		}, search ? 300 : 0);

		return () => clearTimeout(timeout);
	}, [search, status, workType, country, clientId, sort, onFiltersChange]);

	const clearFilters = () => {
		setSearch("");
		setStatus("all");
		setWorkType("all");
		setCountry("all");
		setClientId("all");
		setSort("created_at_desc");
		onFiltersChange({});
	};

	const hasActiveFilters =
		search ||
		status !== "all" ||
		workType !== "all" ||
		country !== "all" ||
		clientId !== "all" ||
		sort !== "created_at_desc";

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center gap-3">
				<div className="relative min-w-[200px] flex-1">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search jobs..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-10"
					/>
				</div>
				<Button
					variant="outline"
					size="sm"
					className="gap-1.5 shrink-0"
					onClick={() => setFiltersOpen(!filtersOpen)}
					aria-expanded={filtersOpen}
				>
					<Filter className="size-3.5" />
					Filters
				</Button>
			</div>

			<div className={`flex flex-wrap items-center gap-3 ${filtersOpen ? "flex" : "hidden"}`}>
				<Select value={sort} onValueChange={setSort}>
					<SelectTrigger className="w-[160px]">
						<SelectValue placeholder="Sort" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="created_at_desc">Newest first</SelectItem>
						<SelectItem value="created_at_asc">Oldest first</SelectItem>
					</SelectContent>
				</Select>
				<Select value={status} onValueChange={setStatus}>
					<SelectTrigger className="w-[150px]">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="open">Open</SelectItem>
						<SelectItem value="closed">Closed</SelectItem>
						<SelectItem value="on-hold">On Hold</SelectItem>
						<SelectItem value="filled">Filled</SelectItem>
					</SelectContent>
				</Select>

				<Select value={workType} onValueChange={setWorkType}>
					<SelectTrigger className="w-[150px]">
						<SelectValue placeholder="Work Type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Types</SelectItem>
						<SelectItem value="remote">Remote</SelectItem>
						<SelectItem value="onsite">Onsite</SelectItem>
						<SelectItem value="hybrid">Hybrid</SelectItem>
					</SelectContent>
				</Select>

				<Select value={country} onValueChange={setCountry}>
					<SelectTrigger className="w-[150px]">
						<SelectValue placeholder="Country" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Countries</SelectItem>
						<SelectItem value="USA">USA</SelectItem>
						<SelectItem value="UK">UK</SelectItem>
						<SelectItem value="Canada">Canada</SelectItem>
						<SelectItem value="Kenya">Kenya</SelectItem>
					</SelectContent>
				</Select>

				<Select value={clientId} onValueChange={setClientId}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Client" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Clients</SelectItem>
						{clients.map((client) => (
							<SelectItem key={client.id} value={client.id}>
								{client.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{hasActiveFilters && (
					<Button variant="ghost" size="sm" onClick={clearFilters}>
						<X className="mr-2 size-4" />
						Clear
					</Button>
				)}
			</div>

			{hasActiveFilters && (
				<div className="flex flex-wrap items-center gap-2">
					{status !== "all" && (
						<Badge variant="secondary" className="gap-1">
							Status: {status}
							<X
								className="size-3 cursor-pointer"
								onClick={() => {
									setStatus("all");
								}}
							/>
						</Badge>
					)}
					{workType !== "all" && (
						<Badge variant="secondary" className="gap-1">
							Type: {workType}
							<X
								className="size-3 cursor-pointer"
								onClick={() => setWorkType("all")}
							/>
						</Badge>
					)}
					{country !== "all" && (
						<Badge variant="secondary" className="gap-1">
							Country: {country}
							<X
								className="size-3 cursor-pointer"
								onClick={() => setCountry("all")}
							/>
						</Badge>
					)}
					{clientId !== "all" && (
						<Badge variant="secondary" className="gap-1">
							Client: {clients.find((c) => c.id === clientId)?.name}
							<X
								className="size-3 cursor-pointer"
								onClick={() => setClientId("all")}
							/>
						</Badge>
					)}
				</div>
			)}
		</div>
	);
}
