"use client";

import { useState, useCallback, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
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
import { Mail, Send, Copy, Check } from "lucide-react";
import { inviteMemberAction } from "@/app/(dashboard)/settings/actions";

interface InviteFormProps {
	orgId: string;
	appUrl: string;
}

export function InviteForm({ orgId, appUrl }: InviteFormProps) {
	const router = useRouter();
	const [state, formAction, isPending] = useActionState(inviteMemberAction, {
		success: false,
		message: "",
	});
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (state.success) router.refresh();
	}, [state.success, router]);
	const baseUrl =
		appUrl || (typeof window !== "undefined" ? window.location.origin : "");
	const signUpUrl = baseUrl ? `${baseUrl}/sign-up` : "";

	const copyLink = useCallback(() => {
		if (!signUpUrl) return;
		navigator.clipboard.writeText(signUpUrl).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	}, [signUpUrl]);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Mail className="size-5" />
					Invite Member
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Share your sign-up link */}
				<div className="space-y-2">
					<Label className="text-muted-foreground">Share your sign-up link</Label>
					<div className="flex gap-2">
						<Input
							readOnly
							value={signUpUrl}
							className="font-mono text-sm"
							aria-label="Sign-up URL"
						/>
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={copyLink}
							disabled={!signUpUrl}
							aria-label="Copy link"
						>
							{copied ? <Check className="size-4" /> : <Copy className="size-4" />}
						</Button>
					</div>
					{copied && <p className="text-xs text-muted-foreground">Copied!</p>}
				</div>

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
