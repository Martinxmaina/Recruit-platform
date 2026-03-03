import Link from "next/link";
import { Zap, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActivityItemProps {
	user_name: string;
	description: string;
	time: string;
	link: string | null;
	icon: React.ReactNode;
	isLast?: boolean;
}

function ActivityItem({
	user_name,
	description,
	time,
	link,
	icon,
	isLast,
}: ActivityItemProps) {
	const content = (
		<>
			<p className="text-sm">
				<span className="font-semibold">{user_name}</span>{" "}
				<span className="text-muted-foreground">{description}</span>
			</p>
			<p className="mt-1 text-[10px] text-muted-foreground/70">{time}</p>
		</>
	);
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
				{link ? (
					<Link href={link} className="block hover:opacity-90 line-clamp-2">
						{content}
					</Link>
				) : (
					content
				)}
			</div>
		</div>
	);
}

export type RecentActivityItem = {
	id: string;
	user_name: string;
	description: string;
	time: string;
	link: string | null;
};

interface RecentActivityProps {
	activity: RecentActivityItem[];
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
							user_name={item.user_name}
							description={item.description}
							time={item.time}
							link={item.link}
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
