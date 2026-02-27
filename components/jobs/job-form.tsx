"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { jobSchema, type JobFormData } from "@/lib/validations/job";
import { createJob, updateJob } from "@/app/(dashboard)/jobs/actions";
import type { Job } from "@/app/(dashboard)/jobs/actions";

interface JobFormProps {
	job?: Job | null;
	clients: Array<{ id: string; name: string }>;
}

export function JobForm({ job, clients }: JobFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<JobFormData>({
		resolver: zodResolver(jobSchema),
		defaultValues: {
			title: job?.title ?? "",
			description: job?.description ?? null,
			client_id: job?.client_id ?? null,
			location: job?.location ?? null,
			country: job?.country ?? null,
			work_type: job?.work_type ?? null,
			status: (job?.status as "open" | "closed" | "on-hold" | "filled") ?? "open",
		},
	});

	async function onSubmit(data: JobFormData) {
		setIsSubmitting(true);
		try {
			if (job) {
				const result = await updateJob(job.id, data);
				if (result.error) {
					form.setError("root", { message: result.error });
				} else {
					router.push(`/jobs/${job.id}`);
				}
			} else {
				const result = await createJob(data);
				if (result.error) {
					form.setError("root", { message: result.error });
				} else {
					router.push("/jobs");
				}
			}
		} catch (error) {
			form.setError("root", {
				message: error instanceof Error ? error.message : "An error occurred",
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid gap-6 md:grid-cols-2">
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem className="md:col-span-2">
								<FormLabel>Job Title *</FormLabel>
								<FormControl>
									<Input placeholder="Senior React Developer" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="client_id"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Client</FormLabel>
								<Select
									onValueChange={(value) => field.onChange(value === "none" ? null : value)}
									value={field.value || "none"}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select client" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="none">No Client</SelectItem>
										{clients.map((client) => (
											<SelectItem key={client.id} value={client.id}>
												{client.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
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
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select status" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="open">Open</SelectItem>
										<SelectItem value="closed">Closed</SelectItem>
										<SelectItem value="on-hold">On Hold</SelectItem>
										<SelectItem value="filled">Filled</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="location"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Location</FormLabel>
								<FormControl>
									<Input placeholder="San Francisco, CA" {...field} value={field.value ?? ""} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="country"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Country</FormLabel>
								<Select
									onValueChange={(value) => field.onChange(value === "none" ? null : value)}
									value={field.value || "none"}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select country" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="none">No Country</SelectItem>
										<SelectItem value="USA">USA</SelectItem>
										<SelectItem value="UK">UK</SelectItem>
										<SelectItem value="Canada">Canada</SelectItem>
										<SelectItem value="Kenya">Kenya</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="work_type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Work Type</FormLabel>
								<FormControl>
									<Input
										placeholder="e.g., Remote, Onsite, Hybrid, Flexible"
										{...field}
										value={field.value ?? ""}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Job description, requirements, responsibilities..."
									className="min-h-[200px]"
									{...field}
									value={field.value ?? ""}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{form.formState.errors.root && (
					<div className="text-destructive text-sm">
						{form.formState.errors.root.message}
					</div>
				)}

				<div className="flex items-center gap-4">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Saving..." : job ? "Update Job" : "Create Job"}
					</Button>
					<Button type="button" variant="outline" asChild>
						<Link href="/jobs">Cancel</Link>
					</Button>
				</div>
			</form>
		</Form>
	);
}
