import { z } from "zod";

export const candidateSchema = z.object({
	full_name: z.string().min(1, "Full name is required"),
	email: z.string().email("Invalid email address").optional().nullable(),
	phone: z.string().optional().nullable(),
	linkedin_url: z.string().url("Invalid LinkedIn URL").optional().nullable().or(z.literal("")),
	current_company: z.string().optional().nullable(),
	current_title: z.string().optional().nullable(),
	location: z.string().optional().nullable(),
	resume_url: z.string().url("Invalid resume URL").optional().nullable().or(z.literal("")),
	source: z.enum(["linkedin", "indeed", "referral", "manual", "other"]).optional().nullable(),
});

export type CandidateFormData = z.infer<typeof candidateSchema>;
