import { Briefcase, Users, Calendar, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
	stats: {
		activeJobs: number;
		candidates: number;
		interviewsThisWeek: number;
		placements: number;
	};
}

interface StatCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	icon: React.ReactNode;
	iconClassName?: string;
	trend?: { label: string; up: boolean };
}

function StatCard({ title, value, subtitle, icon, iconClassName, trend }: StatCardProps) {
	return (
		<Card className="transition-all hover:shadow-sm">
			<CardContent className="pt-6">
				<div className="mb-4 flex items-center justify-between">
					<span
						className={cn(
							"flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary",
							iconClassName
						)}
					>
						{icon}
					</span>
					{subtitle && (
						<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
							{subtitle}
						</span>
					)}
				</div>
				<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
				<p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
				{trend && (
					<div
						className={cn(
							"mt-2 flex items-center gap-1 text-xs font-medium",
							trend.up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
						)}
					>
						{trend.up ? (
							<TrendingUp className="size-3" />
						) : (
							<TrendingDown className="size-3" />
						)}
						{trend.label}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export function StatsCards({ stats }: StatsCardsProps) {
	const statItems = [
		{
			title: "Active Jobs",
			value: stats.activeJobs,
			subtitle: "Active",
			icon: <Briefcase className="size-5" />,
			trend: { label: "Stable", up: true }, // Placeholder trend logic
		},
		{
			title: "Total Candidates",
			value: stats.candidates,
			subtitle: "Database",
			icon: <Users className="size-5" />,
			trend: { label: "+5%", up: true },
		},
		{
			title: "Interviews",
			value: stats.interviewsThisWeek,
			subtitle: "This Week",
			icon: <Calendar className="size-5" />,
			trend: { label: "Scheduled", up: true },
		},
		{
			title: "Placements",
			value: stats.placements,
			subtitle: "Total Hired",
			icon: <CheckCircle2 className="size-5" />,
			trend: { label: "+2", up: true },
		},
	];

	return (
		<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			{statItems.map((stat) => (
				<StatCard key={stat.title} {...stat} />
			))}
		</div>
	);
}
