"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/date";
import { GripVertical } from "lucide-react";

interface ApplicationCardProps {
	application: {
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
	};
}

export function PipelineApplicationCard({ application }: ApplicationCardProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: application.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const initials = application.candidates.full_name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<Card
			ref={setNodeRef}
			style={style}
			className={`cursor-grab active:cursor-grabbing ${isDragging ? "ring-2 ring-primary" : ""}`}
		>
			<CardContent className="p-4">
				<div className="flex items-start gap-3">
					<div
						{...attributes}
						{...listeners}
						className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
					>
						<GripVertical className="size-4" />
					</div>
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-2">
							<Avatar className="size-8">
								<AvatarFallback className="bg-primary/10 text-primary text-xs">
									{initials}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 min-w-0">
								<Link
									href={`/candidates/${application.candidate_id}`}
									className="font-medium text-sm hover:underline block truncate"
								>
									{application.candidates.full_name}
								</Link>
								{application.candidates.current_title && (
									<p className="text-xs text-muted-foreground truncate">
										{application.candidates.current_title}
									</p>
								)}
							</div>
						</div>
						{application.screening_score !== null && (
							<div className="mb-2">
								<Badge
									variant={
										application.screening_score >= 70
											? "default"
											: application.screening_score >= 50
												? "secondary"
												: "outline"
									}
									className="text-xs"
								>
									{application.screening_score}%
								</Badge>
							</div>
						)}
						{application.applied_at && (
							<p className="text-xs text-muted-foreground">
								Applied {formatDate(application.applied_at)}
							</p>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
