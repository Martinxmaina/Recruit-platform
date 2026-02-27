import { getClients } from "./actions";
import { ClientsTable } from "@/components/clients/clients-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ClientsPage() {
	const clients = await getClients();

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Clients</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Manage external client companies ({clients.length} total)
					</p>
				</div>
				<Button asChild>
					<Link href="/clients/new">
						<Plus className="mr-2 size-4" />
						Add Client
					</Link>
				</Button>
			</div>

			<ClientsTable initialData={clients} />
		</div>
	);
}
