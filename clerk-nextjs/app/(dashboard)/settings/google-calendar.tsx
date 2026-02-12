"use client";

import { useState } from "react";
import { CalendarDays, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GoogleCalendarSettingsProps {
	isConnected: boolean;
	authUrl: string;
}

export function GoogleCalendarSettings({ isConnected, authUrl }: GoogleCalendarSettingsProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-sm">
					<CalendarDays className="size-4" />
					Google Calendar Integration
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-medium">Calendar Sync</p>
						<p className="text-xs text-muted-foreground">
							Sync interviews to your Google Calendar automatically.
						</p>
					</div>
					{isConnected ? (
						<Badge variant="default" className="gap-1">
							<Check className="size-3" />
							Connected
						</Badge>
					) : (
						<Button asChild size="sm" className="gap-1.5">
							<a href={authUrl}>
								<ExternalLink className="size-3.5" />
								Connect
							</a>
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
