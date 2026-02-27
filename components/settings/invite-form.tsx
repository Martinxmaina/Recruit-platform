"use client";

import { useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Mail, Send } from "lucide-react";
import { inviteMemberAction } from "@/app/(dashboard)/settings/actions";

interface InviteFormProps {
	orgId: string;
}

export function InviteForm({ orgId }: InviteFormProps) {
	const [state, formAction, isPending] = useActionState(inviteMemberAction, {
		success: false,
		message: "",
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Mail className="size-5" />
					Invite Member
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form action={formAction} className="space-y-4">
					{/* Hidden field for orgId context (server action reads from auth, but kept for reference) */}
					<input type="hidden" name="orgId" value={orgId} />

					<div className="grid gap-4 sm:grid-cols-3">
						<div className="sm:col-span-2">
							<Label htmlFor="email">Email address</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="colleague@company.com"
								required
								disabled={isPending}
							/>
						</div>
						<div>
							<Label htmlFor="role">Role</Label>
							<Select name="role" defaultValue="org:member">
								<SelectTrigger id="role">
									<SelectValue placeholder="Select role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="org:admin">Admin</SelectItem>
									<SelectItem value="org:member">Member</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<Button type="submit" disabled={isPending} className="gap-2">
							<Send className="size-4" />
							{isPending ? "Sending..." : "Send Invite"}
						</Button>
						{state.message && (
							<p
								className={`text-sm ${
									state.success
										? "text-green-600"
										: "text-destructive"
								}`}
							>
								{state.message}
							</p>
						)}
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
