import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/v1/notifications/route";
import { PATCH } from "@/app/api/v1/notifications/[id]/read/route";

vi.mock("@/lib/api/helpers", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/lib/api/helpers")>();
	return { ...actual, getCurrentUserOrg: vi.fn() };
});
vi.mock("@/app/(dashboard)/notifications/actions", () => ({
	getNotifications: vi.fn(),
	createNotification: vi.fn(),
	markAsRead: vi.fn(),
}));

import { getCurrentUserOrg } from "@/lib/api/helpers";
import {
	getNotifications,
	createNotification,
	markAsRead,
} from "@/app/(dashboard)/notifications/actions";

beforeEach(() => {
	vi.mocked(getCurrentUserOrg).mockResolvedValue({
		userId: "u1",
		orgId: "org-uuid",
	});
});

describe("GET /api/v1/notifications", () => {
	it("returns 401 when not authenticated", async () => {
		vi.mocked(getCurrentUserOrg).mockResolvedValue(null);
		const res = await GET(new NextRequest("http://localhost/api/v1/notifications"));
		expect(res.status).toBe(401);
	});
	it("returns 200 and list", async () => {
		vi.mocked(getNotifications).mockResolvedValue([]);
		const res = await GET(new NextRequest("http://localhost/api/v1/notifications"));
		expect(res.status).toBe(200);
	});
});

describe("POST /api/v1/notifications", () => {
	it("returns 400 when user_id, type or title missing", async () => {
		const res = await POST(
			new NextRequest("http://localhost/api/v1/notifications", {
				method: "POST",
				body: JSON.stringify({}),
			})
		);
		expect(res.status).toBe(400);
	});
});

describe("PATCH /api/v1/notifications/[id]/read", () => {
	it("returns 200 on success", async () => {
		vi.mocked(markAsRead).mockResolvedValue({ success: true } as any);
		const res = await PATCH(
			new NextRequest("http://localhost/api/v1/notifications/n1/read"),
			{ params: Promise.resolve({ id: "n1" }) }
		);
		expect(res.status).toBe(200);
	});
});
