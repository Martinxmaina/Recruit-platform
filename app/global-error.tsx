"use client";

/**
 * Global error boundary. Replaces the root layout when active.
 * Must define its own html/body. Do NOT use usePathname/useRouter here—
 * Next's default boundary can crash with "Cannot read properties of null (reading 'useContext')"
 * when the navigation context is unavailable during error render.
 */
export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html lang="en">
			<body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center" }}>
				<h2>Something went wrong</h2>
				<p style={{ color: "#666", marginTop: "0.5rem" }}>
					{error.message || "An unexpected error occurred."}
				</p>
				{error.digest && (
					<p style={{ fontSize: "12px", color: "#999", marginTop: "0.25rem" }}>
						Error ID: {error.digest}
					</p>
				)}
				<button
					type="button"
					onClick={() => reset()}
					style={{
						marginTop: "1rem",
						padding: "0.5rem 1rem",
						cursor: "pointer",
						background: "#000",
						color: "#fff",
						border: "none",
						borderRadius: "4px",
					}}
				>
					Try again
				</button>
			</body>
		</html>
	);
}
