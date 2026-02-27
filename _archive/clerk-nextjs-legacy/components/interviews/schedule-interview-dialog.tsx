"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { interviewSchema, type InterviewFormData } from "@/lib/validations/interview";
import { createInterview } from "@/app/(dashboard)/interviews/actions";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";

interface ScheduleInterviewDialogProps {
	applicationId?: string;
	jobId?: string;
	candidateId?: string;
	applications?: Array<{
		id: string;
		candidates: { full_name: string };
		jobs: { title: string };
	}>;
	onSuccess?: () => void;
	trigger?: React.ReactNode;
}

export function ScheduleInterviewDialog({
	applicationId,
	jobId,
	candidateId,
	applications = [],
	onSuccess,
	trigger,
}: ScheduleInterviewDialogProps) {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const form = useForm<InterviewFormData>({
		resolver: zodResolver(interviewSchema),
		defaultValues: {
			application_id: applicationId || "",
			scheduled_at: "",
			status: "scheduled",
			notes: null,
			interviewer_user_id: null,
			interviewer_name: null,
		},
	});

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			form.reset();
		}
	};

	const onSubmit = async (data: InterviewFormData) => {
		startTransition(async () => {
			const result = await createInterview(data.application_id, {
				scheduled_at: data.scheduled_at,
				status: data.status,
				notes: data.notes,
			});

			if (result.error) {
				alert(`Failed to schedule interview: ${result.error}`);
				return;
			}

			setOpen(false);
			form.reset();
			router.refresh();
			onSuccess?.();
		});
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				{trigger || (
					<Button>
						<Calendar className="mr-2 size-4" />
						Schedule Interview
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Schedule Interview</DialogTitle>
					<DialogDescription>
						Schedule a new interview for a candidate application.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="application_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Application</FormLabel>
									<Select
										onValueChange={field.onChange}
										value={field.value}
										disabled={!!applicationId}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select an application" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{applications.length === 0 && applicationId ? (
												<SelectItem value={applicationId}>
													Selected Application
												</SelectItem>
											) : applications.length > 0 ? (
												applications.map((app) => (
													<SelectItem key={app.id} value={app.id}>
														{app.candidates.full_name} - {app.jobs.title}
													</SelectItem>
												))
											) : (
												<SelectItem value="none" disabled>
													No applications available
												</SelectItem>
											)}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="scheduled_at"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Scheduled Date & Time</FormLabel>
									<FormControl>
										<Input
											type="datetime-local"
											{...field}
											value={
												field.value
													? new Date(field.value).toISOString().slice(0, 16)
													: ""
											}
											onChange={(e) => {
												const value = e.target.value;
												field.onChange(
													value ? new Date(value).toISOString() : ""
												);
											}}
										/>
									</FormControl>
									<FormDescription>
										Select the date and time for the interview
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Status</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="scheduled">Scheduled</SelectItem>
											<SelectItem value="completed">Completed</SelectItem>
											<SelectItem value="cancelled">Cancelled</SelectItem>
											<SelectItem value="rescheduled">Rescheduled</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="interviewer_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Interviewer Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											value={field.value || ""}
											placeholder="Enter interviewer name"
										/>
									</FormControl>
									<FormDescription>
										Name of the person conducting the interview
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="notes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Notes</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											value={field.value || ""}
											placeholder="Add any notes about this interview..."
											rows={4}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? "Scheduling..." : "Schedule Interview"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
