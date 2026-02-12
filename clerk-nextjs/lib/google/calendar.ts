import { google } from "googleapis";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

export function getOAuth2Client() {
	return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
}

/**
 * Generate the Google OAuth consent URL.
 */
export function getAuthUrl(state?: string) {
	const client = getOAuth2Client();
	return client.generateAuthUrl({
		access_type: "offline",
		prompt: "consent",
		scope: ["https://www.googleapis.com/auth/calendar.events"],
		state,
	});
}

/**
 * Exchange the authorization code for tokens.
 */
export async function exchangeCode(code: string) {
	const client = getOAuth2Client();
	const { tokens } = await client.getToken(code);
	return tokens;
}

/**
 * Refresh the access token using a stored refresh token.
 */
export async function refreshToken(refreshTokenValue: string) {
	const client = getOAuth2Client();
	client.setCredentials({ refresh_token: refreshTokenValue });
	const { credentials } = await client.refreshAccessToken();
	return credentials;
}

/**
 * Create a Google Calendar event for an interview.
 */
export async function createCalendarEvent(
	accessToken: string,
	params: {
		summary: string;
		description?: string;
		startTime: string;
		endTime: string;
		attendees?: string[];
		location?: string;
	}
) {
	const client = getOAuth2Client();
	client.setCredentials({ access_token: accessToken });

	const calendar = google.calendar({ version: "v3", auth: client });
	const event = await calendar.events.insert({
		calendarId: "primary",
		requestBody: {
			summary: params.summary,
			description: params.description,
			start: {
				dateTime: params.startTime,
				timeZone: "UTC",
			},
			end: {
				dateTime: params.endTime,
				timeZone: "UTC",
			},
			attendees: params.attendees?.map((email) => ({ email })),
			location: params.location,
			reminders: {
				useDefault: false,
				overrides: [
					{ method: "email", minutes: 60 },
					{ method: "popup", minutes: 15 },
				],
			},
		},
	});

	return event.data;
}

/**
 * List upcoming events from Google Calendar.
 */
export async function listCalendarEvents(
	accessToken: string,
	maxResults = 20
) {
	const client = getOAuth2Client();
	client.setCredentials({ access_token: accessToken });

	const calendar = google.calendar({ version: "v3", auth: client });
	const res = await calendar.events.list({
		calendarId: "primary",
		timeMin: new Date().toISOString(),
		maxResults,
		singleEvents: true,
		orderBy: "startTime",
	});

	return res.data.items ?? [];
}
