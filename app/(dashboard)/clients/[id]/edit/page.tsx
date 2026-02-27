import { notFound } from "next/navigation";
import { getClient } from "@/app/(dashboard)/clients/actions";
import { ClientForm } from "@/components/clients/client-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditClientPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const client = await getClient(id);

	if (!client) {
		notFound();
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Edit Client</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Update client company information
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Client Information</CardTitle>
				</CardHeader>
				<CardContent>
					<ClientForm client={client} />
				</CardContent>
			</Card>
		</div>
	);
}
