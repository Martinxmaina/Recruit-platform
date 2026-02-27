"use client";

import { ErrorFallback } from "@/components/ui/error-fallback";

export default function JobDetailError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return <ErrorFallback error={error} reset={reset} title="Failed to load job details" />;
}
