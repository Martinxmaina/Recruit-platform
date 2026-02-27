"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { StickyNote, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { createNote, deleteNote } from "@/app/(dashboard)/notes/actions";
import type { Note } from "@/app/(dashboard)/notes/actions";

interface NotesPanelProps {
	entityType: string;
	entityId: string;
	notes: Note[];
}

export function NotesPanel({ entityType, entityId, notes }: NotesPanelProps) {
	const [content, setContent] = useState("");
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleSubmit = () => {
		if (!content.trim()) return;
		startTransition(async () => {
			const result = await createNote(entityType, entityId, content.trim());
			if (!result.error) {
				setContent("");
				router.refresh();
			}
		});
	};

	const handleDelete = (noteId: string) => {
		startTransition(async () => {
			await deleteNote(noteId);
			router.refresh();
		});
	};

	return (
		<div className="space-y-4">
			{/* Add note form */}
			<div className="space-y-2">
				<Textarea
					placeholder="Add a note..."
					value={content}
					onChange={(e) => setContent(e.target.value)}
					rows={3}
					className="text-sm"
				/>
				<Button
					size="sm"
					onClick={handleSubmit}
					disabled={isPending || !content.trim()}
					className="gap-1.5"
				>
					<Plus className="size-3.5" />
					{isPending ? "Adding..." : "Add Note"}
				</Button>
			</div>

			{/* Notes list */}
			{notes.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-8 text-center">
					<StickyNote className="mb-3 size-8 text-muted-foreground/50" />
					<p className="text-xs text-muted-foreground">No notes yet.</p>
				</div>
			) : (
				<div className="space-y-3">
					{notes.map((note) => (
						<Card key={note.id} className="group relative">
							<CardContent className="pt-4 pb-3 px-4">
								<p className="text-sm whitespace-pre-wrap">{note.content}</p>
								<div className="mt-2 flex items-center justify-between">
									<p className="text-[10px] text-muted-foreground">
										{note.author_name} &middot;{" "}
										{note.created_at
											? new Date(note.created_at).toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
													hour: "numeric",
													minute: "2-digit",
												})
											: "Just now"}
									</p>
									<Button
										variant="ghost"
										size="icon"
										className="size-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
										onClick={() => handleDelete(note.id)}
										disabled={isPending}
									>
										<Trash2 className="size-3" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
