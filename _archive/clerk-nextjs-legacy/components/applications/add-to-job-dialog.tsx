"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createApplication } from "@/app/(dashboard)/applications/actions";

interface AddToJobDialogProps {
	candidateId: string;
	jobs: Array<{ id: string; title: string; clients?: { name: string } | null }>;
}

export function AddToJobDialog({ candidateId, jobs }: AddToJobDialogProps) {
	const [open, setOpen] = useState(false);
	const [selectedJobId, setSelectedJobId] = useState<string>("");
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleSubmit = () => {
		if (!selectedJobId) {
			alert("Please select a job");
			return;
		}

		startTransition(async () => {
			const result = await createApplication(candidateId, selectedJobId);
			if (result.error) {
				alert(`Error: ${result.error}`);
			} else {
				setOpen(false);
				setSelectedJobId("");
				router.refresh();
			}
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 size-4" />
					Add to Job
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Candidate to Job</DialogTitle>
					<DialogDescription>
						Select a job to add this candidate to. This will create a new application.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="job">Job</Label>
						<Select value={selectedJobId} onValueChange={setSelectedJobId}>
							<SelectTrigger id="job">
								<SelectValue placeholder="Select a job" />
							</SelectTrigger>
							<SelectContent>
								{jobs.map((job) => (
									<SelectItem key={job.id} value={job.id}>
										{job.title}
										{job.clients?.name && ` - ${job.clients.name}`}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={isPending || !selectedJobId}>
						{isPending ? "Adding..." : "Add to Job"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
