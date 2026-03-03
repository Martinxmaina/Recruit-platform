import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const INVITE_FROM_EMAIL = process.env.INVITE_FROM_EMAIL;

export type SendInviteEmailParams = {
	to: string;
	signUpUrl: string;
	inviterName?: string;
	orgName?: string;
};

/**
 * Send an invitation email with the sign-up link.
 * Returns { error: string } if config missing or send fails; otherwise undefined (success).
 */
export async function sendInviteEmail(
	params: SendInviteEmailParams
): Promise<{ error?: string }> {
	if (!RESEND_API_KEY || !INVITE_FROM_EMAIL) {
		return {
			error:
				"Email not configured. Set RESEND_API_KEY and INVITE_FROM_EMAIL in .env",
		};
	}

	const { to, signUpUrl, inviterName, orgName } = params;
	const subject = orgName
		? `You're invited to join ${orgName}`
		: "You're invited to join";
	const body = inviterName
		? `${inviterName} invited you to join${orgName ? ` ${orgName}` : ""}. Sign up here: ${signUpUrl}`
		: `Sign up to join${orgName ? ` ${orgName}` : ""}: ${signUpUrl}`;

	const resend = new Resend(RESEND_API_KEY);
	const { error } = await resend.emails.send({
		from: INVITE_FROM_EMAIL,
		to: [to],
		subject,
		html: `<p>${body.replace(/\n/g, "<br>")}</p>`,
	});

	if (error) {
		console.error("Resend invite email error:", error);
		return { error: error.message };
	}
	return {};
}
