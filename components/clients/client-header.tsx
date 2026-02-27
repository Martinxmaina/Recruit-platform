import Link from "next/link";
import { Building2, Globe, Mail, Phone, MapPin, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Client } from "./clients-table";

interface ClientHeaderProps {
	client: Client;
}

export function ClientHeader({ client }: ClientHeaderProps) {
	const initials = client.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	const statusColors: Record<string, "default" | "secondary" | "outline"> = {
		active: "default",
		inactive: "secondary",
		archived: "outline",
	};

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-6">
					<Avatar className="size-20 rounded-lg">
						<AvatarFallback className="rounded-lg bg-primary/10 text-primary text-2xl">
							{initials || <Building2 className="size-10" />}
						</AvatarFallback>
					</Avatar>
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<h1 className="text-3xl font-bold">{client.name}</h1>
							<Badge variant={statusColors[client.status] ?? "default"}>
								{client.status.charAt(0).toUpperCase() + client.status.slice(1)}
							</Badge>
						</div>
						{client.industry && (
							<p className="text-muted-foreground">{client.industry}</p>
						)}
						<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
							{client.website && (
								<a
									href={client.website}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 hover:text-foreground"
								>
									<Globe className="size-4" />
									<span className="truncate max-w-xs">{client.website}</span>
								</a>
							)}
							{client.contact_email && (
								<a
									href={`mailto:${client.contact_email}`}
									className="flex items-center gap-2 hover:text-foreground"
								>
									<Mail className="size-4" />
									{client.contact_email}
								</a>
							)}
							{client.contact_phone && (
								<a
									href={`tel:${client.contact_phone}`}
									className="flex items-center gap-2 hover:text-foreground"
								>
									<Phone className="size-4" />
									{client.contact_phone}
								</a>
							)}
							{client.address && (
								<div className="flex items-center gap-2">
									<MapPin className="size-4" />
									{client.address}
								</div>
							)}
						</div>
						{client.contact_person && (
							<p className="text-sm">
								<span className="text-muted-foreground">Contact: </span>
								{client.contact_person}
							</p>
						)}
					</div>
				</div>
				<Button variant="outline" asChild>
					<Link href={`/clients/${client.id}/edit`}>
						<Edit className="mr-2 size-4" />
						Edit
					</Link>
				</Button>
			</div>
		</div>
	);
}
