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

interface CandidatesFilterBarProps {
	onFiltersChange: (filters: {
		search?: string;
		source?: string;
		sort?: string;
	}) => void;
}

export function CandidatesFilterBar({ onFiltersChange }: CandidatesFilterBarProps) {
	const searchParams = useSearchParams();
	const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
	const [source, setSource] = useState<string>(
		() => searchParams.get("source") ?? "all"
	);
	const [sort, setSort] = useState<string>(
		() => searchParams.get("sort") ?? "created_at_desc"
	);
	const isMounted = useRef(false);

	useEffect(() => {
		setSearch(searchParams.get("search") ?? "");
		setSource(searchParams.get("source") ?? "all");
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
				source: source !== "all" ? source : undefined,
				sort: sort !== "created_at_desc" ? sort : undefined,
			});
		}, search ? 300 : 0);

		return () => clearTimeout(timeout);
	}, [search, source, sort, onFiltersChange]);

	const clearFilters = () => {
		setSearch("");
		setSource("all");
		setSort("created_at_desc");
		onFiltersChange({});
	};

	const hasActiveFilters = search || source !== "all" || sort !== "created_at_desc";
	const [filtersOpen, setFiltersOpen] = useState(true);

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center gap-3">
				<div className="relative min-w-[200px] flex-1">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search candidates..."
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
				<Select value={source} onValueChange={setSource}>
					<SelectTrigger className="w-[150px]">
						<SelectValue placeholder="Source" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Sources</SelectItem>
						<SelectItem value="linkedin">LinkedIn</SelectItem>
						<SelectItem value="indeed">Indeed</SelectItem>
						<SelectItem value="referral">Referral</SelectItem>
						<SelectItem value="manual">Manual</SelectItem>
						<SelectItem value="other">Other</SelectItem>
					</SelectContent>
				</Select>
				<Select value={sort} onValueChange={setSort}>
					<SelectTrigger className="w-[160px]">
						<SelectValue placeholder="Sort" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="created_at_desc">Newest first</SelectItem>
						<SelectItem value="created_at_asc">Oldest first</SelectItem>
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
					{source !== "all" && (
						<Badge variant="secondary" className="gap-1">
							Source: {source}
							<X
								className="size-3 cursor-pointer"
								onClick={() => setSource("all")}
							/>
						</Badge>
					)}
					{sort !== "created_at_desc" && (
						<Badge variant="secondary" className="gap-1">
							Sort: {sort === "created_at_asc" ? "Oldest first" : sort}
							<X
								className="size-3 cursor-pointer"
								onClick={() => setSort("created_at_desc")}
							/>
						</Badge>
					)}
				</div>
			)}
		</div>
	);
}
