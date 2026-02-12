import { getNotes } from "@/app/(dashboard)/notes/actions";
import { NotesPanel } from "@/components/notes/notes-panel";

interface CandidateNotesTabProps {
	candidateId: string;
}

export async function CandidateNotesTab({ candidateId }: CandidateNotesTabProps) {
	const notes = await getNotes("candidate", candidateId);

	return <NotesPanel entityType="candidate" entityId={candidateId} notes={notes} />;
}
