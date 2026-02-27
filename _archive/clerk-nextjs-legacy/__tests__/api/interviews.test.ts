import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/v1/interviews/route";
import { GET as GET_ONE, PATCH, DELETE } from "@/app/api/v1/interviews/[id]/route";

vi.mock("@/lib/api/helpers", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/lib/api/helpers")>();
	return { ...actual, getCurrentUserOrg: vi.fn() };
});
vi.mock("@/app/(dashboard)/interviews/actions", () => ({
	getInterviews: vi.fn(),
	getInterview: vi.fn(),
	createInterview: vi.fn(),
	updateInterview: vi.fn(),
	deleteInterview: vi.fn(),
}));

import { getCurrentUserOrg } from "@/lib/api/helpers";
import {
	getInterviews,
	getInterview,
	createInterview,
	deleteInterview,
} from "@/app/(dashboard)/interviews/actions";

beforeEach(() => {
vi.mocked(getCurrentUserOrg).mockResolvedValue({
			userId: "u1",
			orgId: "org-uuid",
		});
});

describe("GET /api/v1/interviews", () => {
	it("returns 401 when not authenticated", async () => {
		vi.mocked(getCurrentUserOrg).mockResolvedValue(null);
		const res = await GET(new NextRequest("http://localhost/api/v1/interviews"));
		expect(res.status).toBe(401);
	});
	it("returns 200 and list", async () => {
		vi.mocked(getInterviews).mockResolvedValue([]);
		const res = await GET(new NextRequest("http://localhost/api/v1/interviews"));
		expect(res.status).toBe(200);
	});
});

describe("POST /api/v1/interviews", () => {
	it("returns 400 when application_id or scheduled_at missing", async () => {
		const res = await POST(
			new NextRequest("http://localhost/api/v1/interviews", {
				method: "POST",
				body: JSON.stringify({}),
			})
		);
		expect(res.status).toBe(400);
	});
});

describe("GET /api/v1/interviews/[id]", () => {
	it("returns 404 when not found", async () => {
		vi.mocked(getInterview).mockResolvedValue(null);
		const res = await GET_ONE(new NextRequest("http://localhost/api/v1/interviews/i1"), {
			params: Promise.resolve({ id: "i1" }),
		});
		expect(res.status).toBe(404);
	});
});

describe("DELETE /api/v1/interviews/[id]", () => {
	it("returns 200 on success", async () => {
		vi.mocked(deleteInterview).mockResolvedValue({ success: true } as any);
		const res = await DELETE(new NextRequest("http://localhost/api/v1/interviews/i1"), {
			params: Promise.resolve({ id: "i1" }),
		});
		expect(res.status).toBe(200);
	});
});
