"use client";

import { useState, useEffect } from "react";
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
	}) => void;
}

export function CandidatesFilterBar({ onFiltersChange }: CandidatesFilterBarProps) {
	const [search, setSearch] = useState("");
	const [source, setSource] = useState<string>("all");

	useEffect(() => {
		const timeout = setTimeout(() => {
			onFiltersChange({
				search: search || undefined,
				source: source !== "all" ? source : undefined,
			});
		}, search ? 300 : 0);

		return () => clearTimeout(timeout);
	}, [search, source, onFiltersChange]);

	const clearFilters = () => {
		setSearch("");
		setSource("all");
		onFiltersChange({});
	};

	const hasActiveFilters = search || source !== "all";

	const [filtersOpen, setFiltersOpen] = useState(false);

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3">
				<div className="relative flex-1">
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
					className="gap-1.5 md:hidden"
					onClick={() => setFiltersOpen(!filtersOpen)}
				>
					<Filter className="size-3.5" />
					Filters
				</Button>
			</div>

			<div className={`flex-wrap items-center gap-3 ${filtersOpen ? "flex" : "hidden md:flex"}`}>
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
				</div>
			)}
		</div>
	);
}
