"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { markAsRead, markAllAsRead } from "@/app/(dashboard)/notifications/actions";
import type { Notification } from "@/app/(dashboard)/notifications/actions";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
	notifications: Notification[];
	unreadCount: number;
}

export function NotificationBell({ notifications, unreadCount }: NotificationBellProps) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleMarkAsRead = (id: string) => {
		startTransition(async () => {
			await markAsRead(id);
			router.refresh();
		});
	};

	const handleMarkAllAsRead = () => {
		startTransition(async () => {
			await markAllAsRead();
			router.refresh();
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="relative" aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}>
					<Bell className="size-4" />
					{unreadCount > 0 && (
						<span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
							{unreadCount > 9 ? "9+" : unreadCount}
						</span>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-80">
				<DropdownMenuLabel className="flex items-center justify-between">
					<span className="text-sm font-semibold">Notifications</span>
					{unreadCount > 0 && (
						<Button
							variant="ghost"
							size="sm"
							className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
							onClick={handleMarkAllAsRead}
							disabled={isPending}
						>
							<CheckCheck className="mr-1 size-3" />
							Mark all read
						</Button>
					)}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<ScrollArea className="max-h-[300px]">
					{notifications.length === 0 ? (
						<div className="py-6 text-center text-xs text-muted-foreground">
							No notifications
						</div>
					) : (
						notifications.map((n) => (
							<DropdownMenuItem
								key={n.id}
								className={cn(
									"flex flex-col items-start gap-1 px-3 py-2.5 cursor-pointer",
									!n.read_at && "bg-primary/5"
								)}
								onClick={() => {
									if (!n.read_at) handleMarkAsRead(n.id);
									if (n.link) router.push(n.link);
								}}
							>
								<div className="flex w-full items-start justify-between gap-2">
									<span className="text-xs font-medium">{n.title}</span>
									{!n.read_at && (
										<span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
									)}
								</div>
								{n.message && (
									<span className="text-[11px] text-muted-foreground line-clamp-2">
										{n.message}
									</span>
								)}
								<span className="text-[10px] text-muted-foreground/70">
									{n.created_at
										? new Date(n.created_at).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												hour: "numeric",
												minute: "2-digit",
											})
										: "Just now"}
								</span>
							</DropdownMenuItem>
						))
					)}
				</ScrollArea>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
