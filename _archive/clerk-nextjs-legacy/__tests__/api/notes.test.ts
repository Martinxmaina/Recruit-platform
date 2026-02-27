import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/v1/notes/route";
import { DELETE } from "@/app/api/v1/notes/[id]/route";

vi.mock("@/lib/api/helpers", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/lib/api/helpers")>();
	return { ...actual, getCurrentUserOrg: vi.fn() };
});
vi.mock("@/app/(dashboard)/notes/actions", () => ({
	getNotes: vi.fn(),
	createNote: vi.fn(),
	deleteNote: vi.fn(),
}));

import { getCurrentUserOrg } from "@/lib/api/helpers";
import { getNotes, createNote, deleteNote } from "@/app/(dashboard)/notes/actions";

beforeEach(() => {
	vi.mocked(getCurrentUserOrg).mockResolvedValue({
		userId: "u1",
		orgId: "org-uuid",
	});
});

describe("GET /api/v1/notes", () => {
	it("returns 400 when entity_type or entity_id missing", async () => {
		const res = await GET(new NextRequest("http://localhost/api/v1/notes"));
		expect(res.status).toBe(400);
	});
	it("returns 200 and list", async () => {
		vi.mocked(getNotes).mockResolvedValue([{ id: "n1", content: "Note" }] as any);
		const res = await GET(
			new NextRequest("http://localhost/api/v1/notes?entity_type=candidate&entity_id=c1")
		);
		expect(res.status).toBe(200);
	});
});

describe("POST /api/v1/notes", () => {
	it("returns 400 when entity_type, entity_id or content missing", async () => {
		const res = await POST(
			new NextRequest("http://localhost/api/v1/notes", {
				method: "POST",
				body: JSON.stringify({}),
			})
		);
		expect(res.status).toBe(400);
	});
});

describe("DELETE /api/v1/notes/[id]", () => {
	it("returns 200 on success", async () => {
		vi.mocked(deleteNote).mockResolvedValue({ success: true } as any);
		const res = await DELETE(new NextRequest("http://localhost/api/v1/notes/n1"), {
			params: Promise.resolve({ id: "n1" }),
		});
		expect(res.status).toBe(200);
	});
});
