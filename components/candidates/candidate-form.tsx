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
import { candidateSchema, type CandidateFormData } from "@/lib/validations/candidate";
import { createCandidate, updateCandidate } from "@/app/(dashboard)/candidates/actions";
import type { Candidate } from "@/app/(dashboard)/candidates/actions";

interface CandidateFormProps {
	candidate?: Candidate | null;
}

export function CandidateForm({ candidate }: CandidateFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<CandidateFormData>({
		resolver: zodResolver(candidateSchema),
		defaultValues: {
			full_name: candidate?.full_name ?? "",
			email: candidate?.email ?? null,
			phone: candidate?.phone ?? null,
			linkedin_url: candidate?.linkedin_url ?? null,
			current_company: candidate?.current_company ?? null,
			current_title: candidate?.current_title ?? null,
			location: candidate?.location ?? null,
			resume_url: candidate?.resume_url ?? null,
			source: (candidate?.source as "linkedin" | "indeed" | "referral" | "manual" | "other") ?? null,
		},
	});

	async function onSubmit(data: CandidateFormData) {
		setIsSubmitting(true);
		try {
			// Convert empty strings to null for URL fields
			const submitData = {
				...data,
				linkedin_url: data.linkedin_url === "" ? null : data.linkedin_url,
				resume_url: data.resume_url === "" ? null : data.resume_url,
			};

			if (candidate) {
				const result = await updateCandidate(candidate.id, submitData);
				if (result.error) {
					form.setError("root", { message: result.error });
				} else {
					router.push(`/candidates/${candidate.id}`);
				}
			} else {
				const result = await createCandidate(submitData);
				if (result.error) {
					form.setError("root", { message: result.error });
				} else {
					router.push("/candidates");
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
						name="full_name"
						render={({ field }) => (
							<FormItem className="md:col-span-2">
								<FormLabel>Full Name *</FormLabel>
								<FormControl>
									<Input placeholder="John Doe" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="john.doe@example.com"
										type="email"
										{...field}
										value={field.value ?? ""}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone</FormLabel>
								<FormControl>
									<Input
										placeholder="+1 (555) 123-4567"
										{...field}
										value={field.value ?? ""}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="linkedin_url"
						render={({ field }) => (
							<FormItem>
								<FormLabel>LinkedIn URL</FormLabel>
								<FormControl>
									<Input
										placeholder="https://linkedin.com/in/johndoe"
										type="url"
										{...field}
										value={field.value ?? ""}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="source"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Source</FormLabel>
								<Select
									onValueChange={(value) => field.onChange(value === "none" ? null : value)}
									value={field.value || "none"}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select source" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="none">No Source</SelectItem>
										<SelectItem value="linkedin">LinkedIn</SelectItem>
										<SelectItem value="indeed">Indeed</SelectItem>
										<SelectItem value="referral">Referral</SelectItem>
										<SelectItem value="manual">Manual</SelectItem>
										<SelectItem value="other">Other</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="current_company"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Current Company</FormLabel>
								<FormControl>
									<Input placeholder="Acme Inc." {...field} value={field.value ?? ""} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="current_title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Current Title</FormLabel>
								<FormControl>
									<Input placeholder="Senior Software Engineer" {...field} value={field.value ?? ""} />
								</FormControl>
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
						name="resume_url"
						render={({ field }) => (
							<FormItem className="md:col-span-2">
								<FormLabel>Resume URL</FormLabel>
								<FormControl>
									<Input
										placeholder="https://storage.supabase.co/..."
										type="url"
										{...field}
										value={field.value ?? ""}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{form.formState.errors.root && (
					<div className="text-destructive text-sm">
						{form.formState.errors.root.message}
					</div>
				)}

				<div className="flex items-center gap-4">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Saving..." : candidate ? "Update Candidate" : "Create Candidate"}
					</Button>
					<Button type="button" variant="outline" asChild>
						<Link href="/candidates">Cancel</Link>
					</Button>
				</div>
			</form>
		</Form>
	);
}
