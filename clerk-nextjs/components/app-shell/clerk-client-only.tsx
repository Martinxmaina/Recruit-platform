"use client";

import { useEffect, useState } from "react";

export function ClerkClientOnly({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="flex items-center gap-3 rounded-lg px-2 py-2">
				<div className="size-8 rounded-full bg-muted animate-pulse" />
			</div>
		);
	}

	return <>{children}</>;
}
