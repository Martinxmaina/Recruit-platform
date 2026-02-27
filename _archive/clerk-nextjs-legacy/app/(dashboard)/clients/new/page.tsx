import { ClientForm } from "@/components/clients/client-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewClientPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Add New Client</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Create a new client company profile
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Client Information</CardTitle>
				</CardHeader>
				<CardContent>
					<ClientForm />
				</CardContent>
			</Card>
		</div>
	);
}
