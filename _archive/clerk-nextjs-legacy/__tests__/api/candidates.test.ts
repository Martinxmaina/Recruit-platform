import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/v1/candidates/route";
import { GET as GET_ONE, PATCH, DELETE } from "@/app/api/v1/candidates/[id]/route";

vi.mock("@/lib/api/helpers", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/lib/api/helpers")>();
	return { ...actual, getCurrentUserOrg: vi.fn() };
});
vi.mock("@/app/(dashboard)/candidates/actions", () => ({
	getCandidates: vi.fn(),
	getCandidate: vi.fn(),
	createCandidate: vi.fn(),
	updateCandidate: vi.fn(),
	deleteCandidate: vi.fn(),
}));

import { getCurrentUserOrg } from "@/lib/api/helpers";
import {
	getCandidates,
	getCandidate,
	createCandidate,
	updateCandidate,
	deleteCandidate,
} from "@/app/(dashboard)/candidates/actions";

beforeEach(() => {
	vi.mocked(getCurrentUserOrg).mockResolvedValue({
		userId: "u1",
		orgId: "org-uuid",
	});
});

describe("GET /api/v1/candidates", () => {
	it("returns 401 when not authenticated", async () => {
		vi.mocked(getCurrentUserOrg).mockResolvedValue(null);
		const res = await GET(new NextRequest("http://localhost/api/v1/candidates"));
		expect(res.status).toBe(401);
	});
	it("returns 200 and list", async () => {
		vi.mocked(getCandidates).mockResolvedValue([{ id: "c1", full_name: "Jane" }] as any);
		const res = await GET(new NextRequest("http://localhost/api/v1/candidates"));
		expect(res.status).toBe(200);
		expect(await res.json()).toHaveLength(1);
	});
});

describe("POST /api/v1/candidates", () => {
	it("returns 400 when full_name missing", async () => {
		const res = await POST(
			new NextRequest("http://localhost/api/v1/candidates", {
				method: "POST",
				body: JSON.stringify({}),
			})
		);
		expect(res.status).toBe(400);
	});
	it("returns 201 when created", async () => {
		vi.mocked(createCandidate).mockResolvedValue({
			data: { id: "c1", full_name: "Jane" },
		} as any);
		const res = await POST(
			new NextRequest("http://localhost/api/v1/candidates", {
				method: "POST",
				body: JSON.stringify({ full_name: "Jane" }),
			})
		);
		expect(res.status).toBe(201);
	});
});

describe("GET /api/v1/candidates/[id]", () => {
	it("returns 404 when not found", async () => {
		vi.mocked(getCandidate).mockResolvedValue(null);
		const res = await GET_ONE(new NextRequest("http://localhost/api/v1/candidates/c1"), {
			params: Promise.resolve({ id: "c1" }),
		});
		expect(res.status).toBe(404);
	});
});

describe("DELETE /api/v1/candidates/[id]", () => {
	it("returns 200 on success", async () => {
		vi.mocked(deleteCandidate).mockResolvedValue({ success: true } as any);
		const res = await DELETE(new NextRequest("http://localhost/api/v1/candidates/c1"), {
			params: Promise.resolve({ id: "c1" }),
		});
		expect(res.status).toBe(200);
	});
});
