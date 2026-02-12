import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/v1/tracking/route";
import { PATCH, DELETE } from "@/app/api/v1/tracking/[id]/route";

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));
vi.mock("@/lib/api/helpers", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/lib/api/helpers")>();
	return { ...actual, getOrgId: vi.fn() };
});
vi.mock("@/app/(dashboard)/tracking/actions", () => ({
	getTrackedCandidates: vi.fn(),
	addToTracking: vi.fn(),
	updateTrackedCandidate: vi.fn(),
	removeFromTracking: vi.fn(),
}));

import { auth } from "@clerk/nextjs/server";
import { getOrgId } from "@/lib/api/helpers";
import {
	getTrackedCandidates,
	addToTracking,
	updateTrackedCandidate,
	removeFromTracking,
} from "@/app/(dashboard)/tracking/actions";

beforeEach(() => {
	vi.mocked(auth).mockResolvedValue({ userId: "u1", orgId: "o1" } as any);
	vi.mocked(getOrgId).mockResolvedValue({ id: "org-uuid" });
});

describe("GET /api/v1/tracking", () => {
	it("returns 401 when not authenticated", async () => {
		vi.mocked(auth).mockResolvedValue({ userId: null, orgId: null } as any);
		const res = await GET();
		expect(res.status).toBe(401);
	});
	it("returns 200 and list", async () => {
		vi.mocked(getTrackedCandidates).mockResolvedValue([]);
		const res = await GET();
		expect(res.status).toBe(200);
	});
});

describe("POST /api/v1/tracking", () => {
	it("returns 400 when candidate_id missing", async () => {
		const res = await POST(
			new NextRequest("http://localhost/api/v1/tracking", {
				method: "POST",
				body: JSON.stringify({}),
			})
		);
		expect(res.status).toBe(400);
	});
	it("returns 201 on success", async () => {
		vi.mocked(addToTracking).mockResolvedValue({ success: true } as any);
		const res = await POST(
			new NextRequest("http://localhost/api/v1/tracking", {
				method: "POST",
				body: JSON.stringify({ candidate_id: "c1" }),
			})
		);
		expect(res.status).toBe(201);
	});
});

describe("DELETE /api/v1/tracking/[id]", () => {
	it("returns 200 on success", async () => {
		vi.mocked(removeFromTracking).mockResolvedValue({ success: true } as any);
		const res = await DELETE(new NextRequest("http://localhost/api/v1/tracking/t1"), {
			params: Promise.resolve({ id: "t1" }),
		});
		expect(res.status).toBe(200);
	});
});
