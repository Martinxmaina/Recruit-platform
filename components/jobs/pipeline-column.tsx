"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PipelineApplicationCard } from "./pipeline-application-card";

interface PipelineColumnProps {
	stage: {
		id: string;
		name: string;
		sort_order: number;
	};
	applications: Array<{
		id: string;
		candidate_id: string;
		stage: string;
		screening_score: number | null;
		applied_at: string | null;
		candidates: {
			full_name: string;
			email: string | null;
			current_title: string | null;
		};
	}>;
}

export function PipelineColumn({ stage, applications }: PipelineColumnProps) {
	const { setNodeRef, isOver } = useDroppable({
		id: stage.id,
	});

	const applicationIds = applications.map((app) => app.id);

	return (
		<div className="flex flex-col h-[600px] min-w-[260px] w-[260px] sm:min-w-[280px] sm:w-[280px] lg:min-w-[300px] lg:w-[300px]" role="group" aria-label={`${stage.name} stage - ${applications.length} candidates`}>
			<div
				className={`p-4 border-b bg-muted/50 rounded-t-lg ${
					isOver ? "bg-primary/10 border-primary" : ""
				}`}
			>
				<div className="flex items-center justify-between">
					<h3 className="font-semibold">{stage.name}</h3>
					<Badge variant="secondary">{applications.length}</Badge>
				</div>
			</div>
			<ScrollArea className="flex-1 border-x border-b rounded-b-lg">
				<div
					ref={setNodeRef}
					className={`p-3 min-h-[500px] space-y-2 ${
						isOver ? "bg-primary/5" : ""
					}`}
				>
					{applications.length === 0 ? (
						<div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
							No applications
						</div>
					) : (
						<SortableContext
							items={applicationIds}
							strategy={verticalListSortingStrategy}
						>
							{applications.map((application) => (
								<PipelineApplicationCard
									key={application.id}
									application={application}
								/>
							))}
						</SortableContext>
					)}
				</div>
			</ScrollArea>
		</div>
	);
}
