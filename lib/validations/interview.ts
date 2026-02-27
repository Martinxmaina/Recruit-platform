import { z } from "zod";

export const interviewSchema = z.object({
	application_id: z.string().uuid("Invalid application ID"),
	scheduled_at: z.string().datetime("Invalid date/time format"),
	status: z.enum(["scheduled", "completed", "cancelled", "rescheduled"]),
	notes: z.string().optional().nullable(),
	interviewer_user_id: z.string().optional().nullable(),
	interviewer_name: z.string().optional().nullable(),
});

export type InterviewFormData = z.infer<typeof interviewSchema>;
