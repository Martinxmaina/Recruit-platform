"use client";

import { useState } from "react";
import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
	closestCorners,
} from "@dnd-kit/core";
import { updateApplication } from "@/app/(dashboard)/applications/actions";
import { sendPipelineWebhook } from "@/app/(dashboard)/applications/webhook";
import { PipelineColumn } from "./pipeline-column";
import { PipelineApplicationCard } from "./pipeline-application-card";
import type { PipelineStage } from "@/app/(dashboard)/pipeline-stages/actions";

interface Application {
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
}

interface JobPipelineKanbanProps {
	stages: PipelineStage[];
	applications: Application[];
	jobTitle?: string;
}

export function JobPipelineKanban({ stages, applications, jobTitle = "" }: JobPipelineKanbanProps) {
	const [activeId, setActiveId] = useState<string | null>(null);
	const [optimisticApplications, setOptimisticApplications] = useState(applications);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	);

	// Group applications by stage (exact match first, then case-insensitive fallback)
	const applicationsByStage = stages.reduce(
		(acc, stage) => {
			acc[stage.name] = optimisticApplications.filter((app) => {
				// Exact match (preferred)
				if (app.stage === stage.name) return true;
				// Case-insensitive fallback
				if (app.stage?.toLowerCase() === stage.name.toLowerCase()) {
					console.warn(
						`Stage name mismatch: application stage "${app.stage}" doesn't match pipeline stage "${stage.name}" (case-insensitive match)`
					);
					return true;
				}
				return false;
			});
			return acc;
		},
		{} as Record<string, Application[]>
	);

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);

		if (!over) return;

		const applicationId = active.id as string;
		const overId = over.id as string;

		// Find the target stage
		// If dropped on a stage column, over.id is stage.id
		// If dropped on another card, find that card's stage
		let targetStage = stages.find((s) => s.id === overId);
		
		if (!targetStage) {
			// Dropped on another card, find that card's stage
			const targetApplication = optimisticApplications.find((app) => app.id === overId);
			if (!targetApplication) return;
			targetStage = stages.find((s) => s.name === targetApplication.stage);
			if (!targetStage) return;
		}

		// Find the application being dragged
		const application = optimisticApplications.find((app) => app.id === applicationId);
		if (!application || application.stage === targetStage.name) return;

		const fromStage = application.stage;

		// Optimistic update
		const updatedApplications = optimisticApplications.map((app) =>
			app.id === applicationId ? { ...app, stage: targetStage.name } : app
		);
		setOptimisticApplications(updatedApplications);

		// Update on server
		try {
			const result = await updateApplication(applicationId, {
				stage: targetStage.name,
			});

			if (result.error) {
				// Revert optimistic update on error
				setOptimisticApplications(applications);
				alert(`Failed to update stage: ${result.error}`);
				return;
			}

			// Fire n8n webhook (non-blocking)
			sendPipelineWebhook({
				application_id: applicationId,
				candidate_name: application.candidates.full_name,
				candidate_email: application.candidates.email ?? null,
				job_title: jobTitle,
				from_stage: fromStage,
				to_stage: targetStage.name,
				timestamp: new Date().toISOString(),
			}).catch(console.error);
		} catch (error) {
			// Revert optimistic update on error
			setOptimisticApplications(applications);
			alert("Failed to update stage. Please try again.");
		}
	};

	const activeApplication = activeId
		? optimisticApplications.find((app) => app.id === activeId)
		: null;

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: "600px" }} role="region" aria-label="Candidate pipeline board">
				{stages.map((stage) => (
					<PipelineColumn
						key={stage.id}
						stage={stage}
						applications={applicationsByStage[stage.name] || []}
					/>
				))}
			</div>
			<DragOverlay>
				{activeApplication ? (
					<div className="rotate-3 opacity-90">
						<PipelineApplicationCard application={activeApplication} />
					</div>
				) : null}
			</DragOverlay>
		</DndContext>
	);
}
