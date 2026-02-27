/**
 * Format a date consistently across server and client
 * Uses explicit locale and format options to prevent hydration mismatches
 */
export function formatDate(date: Date | string): string {
	return new Date(date).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}
