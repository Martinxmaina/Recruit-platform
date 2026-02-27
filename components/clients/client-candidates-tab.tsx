import { getClientCandidates } from "@/app/(dashboard)/clients/actions";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserSearch } from "lucide-react";

interface ClientCandidatesTabProps {
	clientId: string;
}

export async function ClientCandidatesTab({ clientId }: ClientCandidatesTabProps) {
	const candidates = await getClientCandidates(clientId);

	if (candidates.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<UserSearch className="mb-4 size-12 text-muted-foreground" />
				<p className="text-muted-foreground">
					No candidates found for this client.
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Candidate</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Current Company</TableHead>
						<TableHead>Current Title</TableHead>
						<TableHead>Location</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{candidates.map((candidate) => {
						const initials = `${candidate.full_name?.[0] ?? ""}${candidate.full_name?.split(" ")[1]?.[0] ?? ""}`.toUpperCase();
						return (
							<TableRow key={candidate.id}>
								<TableCell>
									<div className="flex items-center gap-3">
										<Avatar className="size-8">
											<AvatarFallback className="text-xs">
												{initials || "?"}
											</AvatarFallback>
										</Avatar>
										<span className="font-medium">{candidate.full_name}</span>
									</div>
								</TableCell>
								<TableCell className="text-muted-foreground">
									{candidate.email || "—"}
								</TableCell>
								<TableCell className="text-muted-foreground">
									{candidate.current_company || "—"}
								</TableCell>
								<TableCell className="text-muted-foreground">
									{candidate.current_title || "—"}
								</TableCell>
								<TableCell className="text-muted-foreground">
									{candidate.location || "—"}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
