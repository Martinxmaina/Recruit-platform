"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MobileSidebar } from "./mobile-sidebar";
import { NotificationBell } from "./notification-bell";
import { CopilotButton } from "@/components/copilot";
import type { Notification } from "@/app/(dashboard)/notifications/actions";

interface HeaderProps {
	notifications?: Notification[];
	unreadCount?: number;
	userEmail?: string;
}

export function Header({ notifications = [], unreadCount = 0, userEmail }: HeaderProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-8" role="banner">
				<div className="flex max-w-xl flex-1 items-center gap-4">
					<MobileSidebar userEmail={userEmail} />
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={() => setOpen(true)}
					>
						<Search className="size-5" />
					</Button>
					<div className="relative hidden w-full md:block">
						<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						<Button
							variant="outline"
							className="w-full justify-start rounded-lg border-0 bg-muted pl-10 text-left text-sm text-muted-foreground hover:bg-muted/80"
							onClick={() => setOpen(true)}
						>
							Search candidates, jobs, or clients...
							<kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
								<span className="text-xs">⌘</span>K
							</kbd>
						</Button>
					</div>
				</div>
				<div className="ml-4 flex items-center gap-2">
					<CopilotButton />
					<NotificationBell notifications={notifications} unreadCount={unreadCount} />
					<Button asChild>
						<Link href="/jobs?new=1" className="gap-2" aria-label="Create new job">
							<Plus className="size-4" />
							<span className="hidden sm:inline">New Job</span>
						</Link>
					</Button>
				</div>
			</header>

			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Search candidates, jobs, or clients..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Suggestions">
						<CommandItem>
							<Search className="mr-2 size-4" />
							<span>Search candidates...</span>
						</CommandItem>
						<CommandItem>
							<Search className="mr-2 size-4" />
							<span>Search jobs...</span>
						</CommandItem>
						<CommandItem>
							<Search className="mr-2 size-4" />
							<span>Search clients...</span>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}
