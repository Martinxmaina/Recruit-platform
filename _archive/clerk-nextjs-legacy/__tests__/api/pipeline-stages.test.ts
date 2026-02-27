import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/v1/pipeline-stages/route";
import { PATCH, DELETE } from "@/app/api/v1/pipeline-stages/[id]/route";

vi.mock("@/lib/api/helpers", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/lib/api/helpers")>();
	return { ...actual, getCurrentUserOrg: vi.fn() };
});
vi.mock("@/app/(dashboard)/pipeline-stages/actions", () => ({
	getPipelineStages: vi.fn(),
	createPipelineStage: vi.fn(),
	updatePipelineStage: vi.fn(),
	deletePipelineStage: vi.fn(),
}));

import { getCurrentUserOrg } from "@/lib/api/helpers";
import {
	getPipelineStages,
	createPipelineStage,
	updatePipelineStage,
	deletePipelineStage,
} from "@/app/(dashboard)/pipeline-stages/actions";

beforeEach(() => {
vi.mocked(getCurrentUserOrg).mockResolvedValue({
			userId: "u1",
			orgId: "org-uuid",
		});
});

describe("GET /api/v1/pipeline-stages", () => {
	it("returns 401 when not authenticated", async () => {
		vi.mocked(getCurrentUserOrg).mockResolvedValue(null);
		const res = await GET();
		expect(res.status).toBe(401);
	});
	it("returns 200 and list", async () => {
		vi.mocked(getPipelineStages).mockResolvedValue([{ id: "ps1", name: "New" }] as any);
		const res = await GET();
		expect(res.status).toBe(200);
	});
});

describe("POST /api/v1/pipeline-stages", () => {
	it("returns 400 when name missing", async () => {
		const res = await POST(
			new NextRequest("http://localhost/api/v1/pipeline-stages", {
				method: "POST",
				body: JSON.stringify({}),
			})
		);
		expect(res.status).toBe(400);
	});
});

describe("DELETE /api/v1/pipeline-stages/[id]", () => {
	it("returns 200 on success", async () => {
		vi.mocked(deletePipelineStage).mockResolvedValue({ success: true } as any);
		const res = await DELETE(
			new NextRequest("http://localhost/api/v1/pipeline-stages/ps1"),
			{ params: Promise.resolve({ id: "ps1" }) }
		);
		expect(res.status).toBe(200);
	});
});
