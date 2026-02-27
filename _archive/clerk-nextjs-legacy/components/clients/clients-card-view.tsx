"use client";

import Link from "next/link";
import { Building2, Mail, Phone, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Client } from "./clients-table";

interface ClientsCardViewProps {
	clients: Client[];
}

export function ClientsCardView({ clients }: ClientsCardViewProps) {
	if (clients.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Building2 className="mb-4 size-12 text-muted-foreground" />
				<p className="text-muted-foreground">No clients found.</p>
			</div>
		);
	}

	const statusColors: Record<string, "default" | "secondary" | "outline"> = {
		active: "default",
		inactive: "secondary",
		archived: "outline",
	};

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{clients.map((client) => {
				const initials = client.name
					.split(" ")
					.map((n) => n[0])
					.join("")
					.toUpperCase()
					.slice(0, 2);

				return (
					<Card key={client.id} className="hover:shadow-md transition-shadow">
						<CardContent className="pt-6">
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-center gap-3">
									<Avatar className="size-12">
										<AvatarFallback className="bg-primary/10 text-primary">
											{initials || <Building2 className="size-6" />}
										</AvatarFallback>
									</Avatar>
									<div>
										<Link
											href={`/clients/${client.id}`}
											className="font-semibold hover:underline"
										>
											{client.name}
										</Link>
										{client.industry && (
											<p className="text-sm text-muted-foreground">
												{client.industry}
											</p>
										)}
									</div>
								</div>
								<Badge variant={statusColors[client.status] ?? "default"}>
									{client.status}
								</Badge>
							</div>

							<div className="space-y-2 text-sm">
								{client.contact_person && (
									<p className="text-muted-foreground">
										Contact: {client.contact_person}
									</p>
								)}
								{client.contact_email && (
									<div className="flex items-center gap-2 text-muted-foreground">
										<Mail className="size-4" />
										<span className="truncate">{client.contact_email}</span>
									</div>
								)}
								{client.contact_phone && (
									<div className="flex items-center gap-2 text-muted-foreground">
										<Phone className="size-4" />
										<span>{client.contact_phone}</span>
									</div>
								)}
								{client.website && (
									<a
										href={client.website}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 text-primary hover:underline"
									>
										<Globe className="size-4" />
										<span className="truncate">{client.website}</span>
									</a>
								)}
							</div>

							<div className="mt-4 pt-4 border-t">
								<Link
									href={`/clients/${client.id}`}
									className="text-primary hover:underline text-sm font-medium"
								>
									View Details →
								</Link>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
