"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Users, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils/date";
import {
	updateMemberRole,
	removeMember,
	type SettingsMember,
} from "@/app/(dashboard)/settings/actions";

interface MembersListProps {
	members: SettingsMember[];
}

export function MembersList({ members }: MembersListProps) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleRoleChange = (memberId: string, newRole: string) => {
		startTransition(async () => {
			const result = await updateMemberRole(memberId, newRole);
			if (result.error) {
				alert(`Failed to update role: ${result.error}`);
			}
			router.refresh();
		});
	};

	const handleRemove = (memberUserId: string) => {
		if (!confirm("Remove this member from the organization?")) return;
		startTransition(async () => {
			const result = await removeMember(memberUserId);
			if (result.error) {
				alert(`Failed to remove member: ${result.error}`);
			}
			router.refresh();
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Users className="size-5" />
					Members ({members.length})
				</CardTitle>
			</CardHeader>
			<CardContent>
				{members.length === 0 ? (
					<p className="py-8 text-center text-sm text-muted-foreground">
						No members found.
					</p>
				) : (
					<ScrollArea className="h-[400px]">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Member</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Joined</TableHead>
									<TableHead className="w-[80px]">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{members.map((member) => {
									const initials = `${member.firstName?.[0] ?? ""}${member.lastName?.[0] ?? ""}`.toUpperCase();
									return (
										<TableRow key={member.id}>
											<TableCell>
												<div className="flex items-center gap-3">
													<Avatar className="size-8">
														<AvatarImage src={member.imageUrl ?? undefined} alt={`${member.firstName} ${member.lastName}`} />
														<AvatarFallback className="text-xs">
															{initials || "?"}
														</AvatarFallback>
													</Avatar>
													<span className="font-medium text-sm">
														{member.firstName || member.lastName
															? `${member.firstName} ${member.lastName}`.trim()
															: member.email || member.id.slice(0, 8)}
													</span>
												</div>
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{member.email || "—"}
											</TableCell>
											<TableCell>
												<Select
													defaultValue={member.role}
													onValueChange={(val) => handleRoleChange(member.id, val)}
													disabled={isPending}
												>
													<SelectTrigger className="h-7 w-[110px] text-xs">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="admin">Admin</SelectItem>
														<SelectItem value="member">Member</SelectItem>
													</SelectContent>
												</Select>
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{member.createdAt
													? formatDate(member.createdAt)
													: "—"}
											</TableCell>
											<TableCell>
												<Button
													variant="ghost"
													size="icon"
													className="size-7 text-muted-foreground hover:text-destructive"
													aria-label="Remove member"
													onClick={() => handleRemove(member.id)}
													disabled={isPending}
												>
													<Trash2 className="size-3.5" />
												</Button>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</ScrollArea>
				)}
			</CardContent>
		</Card>
	);
}
