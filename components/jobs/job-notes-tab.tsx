import { getNotes } from "@/app/(dashboard)/notes/actions";
import { NotesPanel } from "@/components/notes/notes-panel";

interface JobNotesTabProps {
	jobId: string;
}

export async function JobNotesTab({ jobId }: JobNotesTabProps) {
	const notes = await getNotes("job", jobId);

	return <NotesPanel entityType="job" entityId={jobId} notes={notes} />;
}
