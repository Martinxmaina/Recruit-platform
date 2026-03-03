"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { updateMyDisplayName } from "@/app/(dashboard)/settings/actions";

interface DisplayNameFormProps {
	initialDisplayName: string | null;
}

export function DisplayNameForm({ initialDisplayName }: DisplayNameFormProps) {
	const [name, setName] = useState(initialDisplayName ?? "");
	const [isPending, startTransition] = useTransition();
	const [message, setMessage] = useState<"success" | "error" | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setMessage(null);
		startTransition(async () => {
			const result = await updateMyDisplayName(name || null);
			if (result.error) setMessage("error");
			else setMessage("success");
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<User className="size-5" />
					Your display name
				</CardTitle>
				<p className="text-sm text-muted-foreground">
					Shown in activity log (e.g. who moved a candidate, scheduled an interview).
					Leave blank to show &quot;System&quot;.
				</p>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
					<div className="min-w-[200px] flex-1">
						<Label htmlFor="displayName" className="sr-only">
							Display name
						</Label>
						<Input
							id="displayName"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g. Jane Smith"
							disabled={isPending}
						/>
					</div>
					<Button type="submit" disabled={isPending}>
						{isPending ? "Saving…" : "Save"}
					</Button>
					{message === "success" && (
						<span className="text-sm text-green-600">Saved.</span>
					)}
					{message === "error" && (
						<span className="text-sm text-destructive">Failed to save.</span>
					)}
				</form>
			</CardContent>
		</Card>
	);
}
