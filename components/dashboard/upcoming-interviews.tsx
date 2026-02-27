import { ChevronRight, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface UpcomingInterviewsProps {
	interviews: {
		id: string;
		candidate: string;
		jobTitle: string;
		date: string;
		time: string;
		status: string;
	}[];
}

const statusClass: Record<string, string> = {
	confirmed: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
	pending: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
	completed: "bg-muted text-muted-foreground",
	cancelled: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
	scheduled: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
};

export function UpcomingInterviews({ interviews }: UpcomingInterviewsProps) {
	return (
		<Card className="overflow-hidden border-none shadow-none bg-transparent">
			<CardHeader className="flex flex-row items-center justify-between px-0 pb-6">
				<h3 className="text-base font-bold">Upcoming Interviews</h3>
				<Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
					View All
					<ChevronRight className="size-3" />
				</Button>
			</CardHeader>
			<CardContent className="p-0">
				<div className="overflow-hidden rounded-xl border bg-card">
					<Table>
						<TableHeader>
							<TableRow className="bg-muted/30 hover:bg-muted/30">
								<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Candidate</TableHead>
								<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Job</TableHead>
								<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Time</TableHead>
								<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{interviews.length > 0 ? (
								interviews.map((row) => (
									<TableRow key={row.id} className="hover:bg-muted/10">
										<TableCell className="px-4 py-3">
											<div className="flex items-center gap-3">
												<div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
													{row.candidate.charAt(0)}
												</div>
												<span className="text-xs font-medium">{row.candidate}</span>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-xs text-muted-foreground">
											{row.jobTitle}
										</TableCell>
										<TableCell className="px-4 py-3">
											<div className="text-xs">
												<p className="font-medium">{row.date}</p>
												<p className="text-muted-foreground text-[10px]">{row.time}</p>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3">
											<span
												className={cn(
													"inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
													statusClass[row.status.toLowerCase()] || statusClass.pending
												)}
											>
												{row.status}
											</span>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={4} className="h-24 text-center text-xs text-muted-foreground">
										No upcoming interviews.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
