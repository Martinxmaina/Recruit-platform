"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	Users,
	Briefcase,
	UserSearch,
	Zap,
	Settings,
	Layers,
	CalendarDays,
	Globe,
	GitBranch,
	BookmarkCheck,
	LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/(auth)/actions";

const allNavItems = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "recruiter"] },
	{ href: "/clients", label: "Clients", icon: Users, roles: ["admin", "recruiter"] },
	{ href: "/jobs", label: "Jobs", icon: Briefcase, roles: ["admin", "recruiter", "client"] },
	{ href: "/candidates", label: "Candidates", icon: UserSearch, roles: ["admin", "recruiter"] },
	{ href: "/pipelines", label: "Pipelines", icon: GitBranch, roles: ["admin", "recruiter"] },
	{ href: "/tracking", label: "Tracking", icon: BookmarkCheck, roles: ["admin", "recruiter"] },
	{ href: "/interviews", label: "Interviews", icon: CalendarDays, roles: ["admin", "recruiter"] },
	{ href: "/portal", label: "Client Portal", icon: Globe, roles: ["client"] },
	{ href: "/automation", label: "Automation", icon: Zap, roles: ["admin"] },
	{ href: "/settings", label: "Settings", icon: Settings, roles: ["admin", "recruiter"] },
];

interface SidebarProps {
	className?: string;
	role?: string;
	userEmail?: string;
}

export function Sidebar({ className, role = "recruiter", userEmail }: SidebarProps) {
	const pathname = usePathname();
	const navItems = allNavItems.filter((item) => item.roles.includes(role));

	return (
		<aside className={cn("flex w-64 shrink-0 flex-col border-r border-border bg-card", className)} aria-label="Main navigation">
			<div className="flex items-center gap-3 p-6">
				<div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
					<Layers className="size-5" />
				</div>
				<div>
					<h1 className="text-lg font-bold leading-tight">RecruitPro</h1>
					<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
						Multi-tenant
					</p>
				</div>
			</div>
			<ScrollArea className="flex-1 px-4">
				<nav className="space-y-1 py-2" aria-label="Navigation menu">
					{navItems.map(({ href, label, icon: Icon }) => {
						const isActive = pathname === href || pathname.startsWith(`${href}/`);
						return (
							<Tooltip key={href} delayDuration={0}>
								<TooltipTrigger asChild>
									<Link
										href={href}
										className={cn(
											"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
											isActive
												? "bg-primary/10 text-primary"
												: "text-muted-foreground hover:bg-muted hover:text-foreground"
										)}
									>
										<Icon className="size-5 shrink-0" />
										<span>{label}</span>
									</Link>
								</TooltipTrigger>
								<TooltipContent side="right">{label}</TooltipContent>
							</Tooltip>
						);
					})}
				</nav>
			</ScrollArea>
			<div className="border-t border-border p-4">
				<div className="flex items-center gap-3 rounded-lg px-2 py-2">
					<span className="truncate text-sm text-muted-foreground" title={userEmail}>
						{userEmail ?? "User"}
					</span>
					<form action={signOut} className="ml-auto">
						<Button type="submit" variant="ghost" size="icon" className="size-8" aria-label="Sign out">
							<LogOut className="size-4" />
						</Button>
					</form>
				</div>
			</div>
		</aside>
	);
}
