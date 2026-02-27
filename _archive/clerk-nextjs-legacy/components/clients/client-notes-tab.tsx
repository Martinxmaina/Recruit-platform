import { getNotes } from "@/app/(dashboard)/notes/actions";
import { NotesPanel } from "@/components/notes/notes-panel";

interface ClientNotesTabProps {
	clientId: string;
}

export async function ClientNotesTab({ clientId }: ClientNotesTabProps) {
	const notes = await getNotes("client", clientId);

	return <NotesPanel entityType="client" entityId={clientId} notes={notes} />;
}
