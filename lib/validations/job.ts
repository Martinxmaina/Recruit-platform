import { z } from "zod";

export const jobSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional().nullable(),
	client_id: z.string().uuid().optional().nullable(),
	location: z.string().optional().nullable(),
	country: z.string().optional().nullable(),
	work_type: z.string().optional().nullable(),
	status: z.enum(["open", "closed", "on-hold", "filled"]),
});

export type JobFormData = z.infer<typeof jobSchema>;
