import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar, Globe, MapPin } from "lucide-react";
import type { Client } from "./clients-table";

interface ClientOverviewProps {
	client: Client;
}

export function ClientOverview({ client }: ClientOverviewProps) {
	return (
		<div className="grid gap-6 md:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Building2 className="size-5" />
						Company Information
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<label className="text-sm font-medium text-muted-foreground">
							Company Name
						</label>
						<p className="mt-1">{client.name}</p>
					</div>
					{client.industry && (
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Industry
							</label>
							<p className="mt-1">{client.industry}</p>
						</div>
					)}
					{client.website && (
						<div>
							<label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
								<Globe className="size-4" />
								Website
							</label>
							<a
								href={client.website}
								target="_blank"
								rel="noopener noreferrer"
								className="mt-1 text-primary hover:underline"
							>
								{client.website}
							</a>
						</div>
					)}
					{client.address && (
						<div>
							<label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
								<MapPin className="size-4" />
								Address
							</label>
							<p className="mt-1">{client.address}</p>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Contact Information</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{client.contact_person && (
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Contact Person
							</label>
							<p className="mt-1">{client.contact_person}</p>
						</div>
					)}
					{client.contact_email && (
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Email
							</label>
							<a
								href={`mailto:${client.contact_email}`}
								className="mt-1 text-primary hover:underline"
							>
								{client.contact_email}
							</a>
						</div>
					)}
					{client.contact_phone && (
						<div>
							<label className="text-sm font-medium text-muted-foreground">
								Phone
							</label>
							<a
								href={`tel:${client.contact_phone}`}
								className="mt-1 text-primary hover:underline"
							>
								{client.contact_phone}
							</a>
						</div>
					)}
					<div>
						<label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<Calendar className="size-4" />
							Created
						</label>
						<p className="mt-1">
							{client.created_at
								? new Date(client.created_at).toLocaleDateString()
								: "—"}
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
