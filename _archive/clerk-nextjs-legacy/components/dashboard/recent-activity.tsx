import { Zap } from "lucide-react";
import { Search, Mail, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActivityItemProps {
	title: string;
	description: string;
	time: string;
	icon: React.ReactNode;
	isLast?: boolean;
}

function ActivityItem({
	title,
	description,
	time,
	icon,
	isLast,
}: ActivityItemProps) {
	return (
		<div className="relative flex gap-4">
			{!isLast && (
				<div className="absolute left-4 top-10 bottom-0 w-px bg-border" />
			)}
			<div
				className={cn(
					"z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted border border-border"
				)}
			>
				{icon}
			</div>
			<div className="min-w-0 pb-6">
				<p className="text-sm font-medium">{title}</p>
				<p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{description}</p>
				<p className="mt-1 text-[10px] text-muted-foreground/70">{time}</p>
			</div>
		</div>
	);
}

interface RecentActivityProps {
	activity: {
		id: string;
		title: string;
		description: string;
		time: string;
	}[];
}

export function RecentActivity({ activity }: RecentActivityProps) {
	return (
		<Card className="h-full border-none shadow-none bg-transparent">
			<CardHeader className="flex flex-row items-center justify-between px-0 pb-6">
				<h3 className="flex items-center gap-2 text-base font-bold">
					<Zap className="size-4 text-primary" />
					Recent Activity
				</h3>
			</CardHeader>
			<CardContent className="px-0">
				{activity.length > 0 ? (
					activity.map((item, index) => (
						<ActivityItem
							key={item.id}
							{...item}
							icon={<RefreshCw className="size-3.5 text-muted-foreground" />}
							isLast={index === activity.length - 1}
						/>
					))
				) : (
					<p className="text-xs text-muted-foreground">No recent activity.</p>
				)}
			</CardContent>
		</Card>
	);
}
