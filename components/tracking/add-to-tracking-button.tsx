"use client";

import { useState, useTransition } from "react";
import { BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToTracking } from "@/app/(dashboard)/tracking/actions";
import { useRouter } from "next/navigation";

interface AddToTrackingButtonProps {
	candidateId: string;
	isTracked?: boolean;
}

export function AddToTrackingButton({
	candidateId,
	isTracked = false,
}: AddToTrackingButtonProps) {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleAdd = () => {
		setError(null);
		startTransition(async () => {
			const result = await addToTracking(candidateId);
			if (result.error) {
				setError(result.error);
				return;
			}
			router.refresh();
		});
	};

	return (
		<div className="w-full">
			<Button
				type="button"
				variant={isTracked ? "secondary" : "outline"}
				className="w-full"
				disabled={isTracked || isPending}
				onClick={handleAdd}
			>
				<BookmarkPlus className="mr-2 size-4" />
				{isTracked ? "In Tracking" : isPending ? "Adding..." : "Add to Tracking"}
			</Button>
			{error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
		</div>
	);
}
