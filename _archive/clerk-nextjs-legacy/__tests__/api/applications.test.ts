import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/v1/applications/route";
import { GET as GET_ONE, PATCH, DELETE } from "@/app/api/v1/applications/[id]/route";

vi.mock("@/lib/api/helpers", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/lib/api/helpers")>();
	return { ...actual, getCurrentUserOrg: vi.fn() };
});
vi.mock("@/app/(dashboard)/applications/actions", () => ({
	getApplications: vi.fn(),
	getApplication: vi.fn(),
	createApplication: vi.fn(),
	updateApplication: vi.fn(),
	deleteApplication: vi.fn(),
}));

import { getCurrentUserOrg } from "@/lib/api/helpers";
import {
	getApplications,
	getApplication,
	createApplication,
	updateApplication,
	deleteApplication,
} from "@/app/(dashboard)/applications/actions";

beforeEach(() => {
	vi.mocked(getCurrentUserOrg).mockResolvedValue({
			userId: "u1",
			orgId: "org-uuid",
		});
});

describe("GET /api/v1/applications", () => {
	it("returns 401 when not authenticated", async () => {
		vi.mocked(getCurrentUserOrg).mockResolvedValue(null);
		const res = await GET(new NextRequest("http://localhost/api/v1/applications"));
		expect(res.status).toBe(401);
	});
	it("returns 200 and list", async () => {
		vi.mocked(getApplications).mockResolvedValue([]);
		const res = await GET(new NextRequest("http://localhost/api/v1/applications"));
		expect(res.status).toBe(200);
	});
});

describe("POST /api/v1/applications", () => {
	it("returns 400 when candidate_id or job_id missing", async () => {
		const res = await POST(
			new NextRequest("http://localhost/api/v1/applications", {
				method: "POST",
				body: JSON.stringify({}),
			})
		);
		expect(res.status).toBe(400);
	});
	it("returns 201 when created", async () => {
		vi.mocked(createApplication).mockResolvedValue({
			data: { id: "a1", candidate_id: "c1", job_id: "j1" },
		} as any);
		const res = await POST(
			new NextRequest("http://localhost/api/v1/applications", {
				method: "POST",
				body: JSON.stringify({ candidate_id: "c1", job_id: "j1" }),
			})
		);
		expect(res.status).toBe(201);
	});
});

describe("GET /api/v1/applications/[id]", () => {
	it("returns 404 when not found", async () => {
		vi.mocked(getApplication).mockResolvedValue(null);
		const res = await GET_ONE(new NextRequest("http://localhost/api/v1/applications/a1"), {
			params: Promise.resolve({ id: "a1" }),
		});
		expect(res.status).toBe(404);
	});
});

describe("DELETE /api/v1/applications/[id]", () => {
	it("returns 200 on success", async () => {
		vi.mocked(deleteApplication).mockResolvedValue({ success: true } as any);
		const res = await DELETE(new NextRequest("http://localhost/api/v1/applications/a1"), {
			params: Promise.resolve({ id: "a1" }),
		});
		expect(res.status).toBe(200);
	});
});
