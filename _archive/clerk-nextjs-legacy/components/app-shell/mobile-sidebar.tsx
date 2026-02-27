"use client";

import { useState } from "react";
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
	Menu,
	LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { signOut } from "@/app/(auth)/actions";

const navItems = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/clients", label: "Clients", icon: Users },
	{ href: "/jobs", label: "Jobs", icon: Briefcase },
	{ href: "/candidates", label: "Candidates", icon: UserSearch },
	{ href: "/automation", label: "Automation", icon: Zap },
	{ href: "/settings", label: "Settings", icon: Settings },
] as const;

interface MobileSidebarProps {
	userEmail?: string;
}

export function MobileSidebar({ userEmail }: MobileSidebarProps) {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden">
					<Menu className="size-5" />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-64 p-0">
				<SheetHeader className="p-6">
					<SheetTitle className="flex items-center gap-3">
						<div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<Layers className="size-5" />
						</div>
						<div>
							<h1 className="text-lg font-bold leading-tight">RecruitPro</h1>
							<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
								Multi-tenant
							</p>
						</div>
					</SheetTitle>
				</SheetHeader>
				<ScrollArea className="flex-1 px-4">
					<nav className="space-y-1 py-2">
						{navItems.map(({ href, label, icon: Icon }) => {
							const isActive = pathname === href || pathname.startsWith(`${href}/`);
							return (
								<Link
									key={href}
									href={href}
									onClick={() => setOpen(false)}
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
			</SheetContent>
		</Sheet>
	);
}
