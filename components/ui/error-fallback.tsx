"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorFallbackProps {
	error: Error & { digest?: string };
	reset: () => void;
	title?: string;
}

export function ErrorFallback({
	error,
	reset,
	title = "Something went wrong",
}: ErrorFallbackProps) {
	return (
		<Card className="mx-auto mt-12 max-w-md border-destructive/20">
			<CardContent className="flex flex-col items-center py-10 text-center">
				<AlertTriangle className="mb-4 size-10 text-destructive" />
				<h2 className="text-lg font-semibold">{title}</h2>
				<p className="mt-2 text-sm text-muted-foreground">
					{error.message || "An unexpected error occurred. Please try again."}
				</p>
				{error.digest && (
					<p className="mt-1 text-[10px] text-muted-foreground/70">
						Error ID: {error.digest}
					</p>
				)}
				<Button onClick={reset} className="mt-6 gap-2" variant="outline">
					<RefreshCw className="size-4" />
					Try Again
				</Button>
			</CardContent>
		</Card>
	);
}
