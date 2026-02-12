"use server";

const WEBHOOK_URL = "https://qenaico.app.n8n.cloud/webhook/interview";

interface PipelineWebhookPayload {
	application_id: string;
	candidate_name: string;
	candidate_email: string | null;
	job_title: string;
	from_stage: string;
	to_stage: string;
	timestamp: string;
}

/**
 * Sends pipeline stage change data to the n8n webhook.
 * Called from the Kanban board after a successful drag-and-drop.
 */
export async function sendPipelineWebhook(payload: PipelineWebhookPayload) {
	try {
		const res = await fetch(WEBHOOK_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		if (!res.ok) {
			console.error("Webhook failed:", res.status, await res.text());
			return { error: `Webhook returned ${res.status}` };
		}

		return { success: true };
	} catch (err) {
		console.error("Webhook error:", err);
		return { error: err instanceof Error ? err.message : "Webhook failed" };
	}
}
