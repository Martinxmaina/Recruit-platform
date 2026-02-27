import { z } from "zod";

export const clientSchema = z.object({
	name: z.string().min(1, "Company name is required"),
	industry: z.string().optional(),
	status: z.enum(["active", "inactive", "archived"]),
	contact_email: z.string().email("Invalid email address").optional().or(z.literal("")),
	contact_person: z.string().optional(),
	contact_phone: z.string().optional(),
	website: z.string().url("Invalid URL").optional().or(z.literal("")),
	address: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
