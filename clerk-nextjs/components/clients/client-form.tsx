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
	FormDescription,
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
import { clientSchema, type ClientFormData } from "@/lib/validations/client";
import { createClient, updateClient } from "@/app/(dashboard)/clients/actions";
import type { Client } from "./clients-table";

interface ClientFormProps {
	client?: Client | null;
}

export function ClientForm({ client }: ClientFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<ClientFormData>({
		resolver: zodResolver(clientSchema),
		defaultValues: {
			name: client?.name ?? "",
			industry: client?.industry ?? "",
			status: (client?.status as "active" | "inactive" | "archived") ?? "active",
			contact_email: client?.contact_email ?? "",
			contact_person: client?.contact_person ?? "",
			contact_phone: client?.contact_phone ?? "",
			website: client?.website ?? "",
			address: client?.address ?? "",
		},
	});

	async function onSubmit(data: ClientFormData) {
		setIsSubmitting(true);
		try {
			if (client) {
				const result = await updateClient(client.id, data);
				if (result.error) {
					form.setError("root", { message: result.error });
				} else {
					router.push(`/clients/${client.id}`);
				}
			} else {
				const result = await createClient(data);
				if (result.error) {
					form.setError("root", { message: result.error });
				} else {
					router.push("/clients");
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
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company Name *</FormLabel>
								<FormControl>
									<Input placeholder="Acme Inc." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="industry"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Industry</FormLabel>
								<FormControl>
									<Input placeholder="Technology" {...field} />
								</FormControl>
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
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="inactive">Inactive</SelectItem>
										<SelectItem value="archived">Archived</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="website"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Website</FormLabel>
								<FormControl>
									<Input placeholder="https://example.com" type="url" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="contact_person"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contact Person</FormLabel>
								<FormControl>
									<Input placeholder="John Doe" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="contact_email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contact Email</FormLabel>
								<FormControl>
									<Input placeholder="contact@example.com" type="email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="contact_phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Contact Phone</FormLabel>
								<FormControl>
									<Input placeholder="+1 (555) 123-4567" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="address"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Address</FormLabel>
							<FormControl>
								<Textarea placeholder="123 Main St, City, State, ZIP" {...field} />
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
						{isSubmitting ? "Saving..." : client ? "Update Client" : "Create Client"}
					</Button>
					<Button type="button" variant="outline" asChild>
						<Link href="/clients">Cancel</Link>
					</Button>
				</div>
			</form>
		</Form>
	);
}
