import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/v1/clients/route";
import { GET as GET_ONE, PATCH } from "@/app/api/v1/clients/[id]/route";

vi.mock("@/lib/api/helpers", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/lib/api/helpers")>();
	return { ...actual, getCurrentUserOrg: vi.fn() };
});
vi.mock("@/app/(dashboard)/clients/actions", () => ({
	getClients: vi.fn(),
	getClient: vi.fn(),
	createClient: vi.fn(),
	updateClient: vi.fn(),
}));

import { getCurrentUserOrg } from "@/lib/api/helpers";
import { getClients, getClient, createClient, updateClient } from "@/app/(dashboard)/clients/actions";

beforeEach(() => {
	vi.mocked(getCurrentUserOrg).mockResolvedValue({
		userId: "u1",
		orgId: "org-uuid",
	});
});

describe("GET /api/v1/clients", () => {
	it("returns 401 when not authenticated", async () => {
		vi.mocked(getCurrentUserOrg).mockResolvedValue(null);
		const res = await GET();
		expect(res.status).toBe(401);
	});
	it("returns 200 and list", async () => {
		vi.mocked(getClients).mockResolvedValue([{ id: "cl1", name: "Acme" }] as any);
		const res = await GET();
		expect(res.status).toBe(200);
	});
});

describe("POST /api/v1/clients", () => {
	it("returns 400 when name missing", async () => {
		const res = await POST(
			new NextRequest("http://localhost/api/v1/clients", {
				method: "POST",
				body: JSON.stringify({}),
			})
		);
		expect(res.status).toBe(400);
	});
});

describe("GET /api/v1/clients/[id]", () => {
	it("returns 404 when not found", async () => {
		vi.mocked(getClient).mockResolvedValue(null);
		const res = await GET_ONE(new NextRequest("http://localhost/api/v1/clients/cl1"), {
			params: Promise.resolve({ id: "cl1" }),
		});
		expect(res.status).toBe(404);
	});
});
