"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { removeFromTracking } from "@/app/(dashboard)/tracking/actions";

interface RemoveFromTrackingButtonProps {
	trackedId: string;
}

export function RemoveFromTrackingButton({ trackedId }: RemoveFromTrackingButtonProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleRemove = () => {
		startTransition(async () => {
			const result = await removeFromTracking(trackedId);
			if (result?.error) {
				console.error(result.error);
				return;
			}
			router.refresh();
		});
	};

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			aria-label="Remove from tracking"
			disabled={isPending}
			onClick={handleRemove}
		>
			<Trash2 className="size-4 text-destructive" />
		</Button>
	);
}
