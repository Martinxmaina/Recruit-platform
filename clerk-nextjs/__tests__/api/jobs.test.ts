import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/v1/jobs/route";
import { GET as GET_ONE, PATCH, DELETE } from "@/app/api/v1/jobs/[id]/route";

vi.mock("@/lib/api/helpers", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@/lib/api/helpers")>();
	return {
		...actual,
		getCurrentUserOrg: vi.fn(),
	};
});

vi.mock("@/app/(dashboard)/jobs/actions", () => ({
	getJobs: vi.fn(),
	getJob: vi.fn(),
	createJob: vi.fn(),
	updateJob: vi.fn(),
	deleteJob: vi.fn(),
}));

import { getCurrentUserOrg } from "@/lib/api/helpers";
import {
	getJobs,
	getJob,
	createJob,
	updateJob,
	deleteJob,
} from "@/app/(dashboard)/jobs/actions";

describe("GET /api/v1/jobs", () => {
	beforeEach(() => {
		vi.mocked(getCurrentUserOrg).mockResolvedValue({
			userId: "user-1",
			orgId: "org-uuid",
		});
		vi.mocked(getJobs).mockResolvedValue([]);
	});

	it("returns 401 when not authenticated", async () => {
		vi.mocked(getCurrentUserOrg).mockResolvedValue(null);
		const req = new NextRequest("http://localhost/api/v1/jobs");
		const res = await GET(req);
		expect(res.status).toBe(401);
	});

	it("returns 200 and list of jobs", async () => {
		const jobs = [{ id: "j1", title: "Engineer", status: "open" }];
		vi.mocked(getJobs).mockResolvedValue(jobs as any);
		const req = new NextRequest("http://localhost/api/v1/jobs");
		const res = await GET(req);
		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toEqual(jobs);
	});
});

describe("POST /api/v1/jobs", () => {
	beforeEach(() => {
		vi.mocked(getCurrentUserOrg).mockResolvedValue({
			userId: "user-1",
			orgId: "org-uuid",
		});
		vi.mocked(createJob).mockResolvedValue({
			data: { id: "j1", title: "Test Job" },
		} as any);
	});

	it("returns 400 when title is missing", async () => {
		const req = new NextRequest("http://localhost/api/v1/jobs", {
			method: "POST",
			body: JSON.stringify({}),
		});
		const res = await POST(req);
		expect(res.status).toBe(400);
	});

	it("returns 201 and job when created", async () => {
		const req = new NextRequest("http://localhost/api/v1/jobs", {
			method: "POST",
			body: JSON.stringify({ title: "Test Job" }),
		});
		const res = await POST(req);
		expect(res.status).toBe(201);
		const data = await res.json();
		expect(data.title).toBe("Test Job");
	});
});

describe("GET /api/v1/jobs/[id]", () => {
	beforeEach(() => {
		vi.mocked(getCurrentUserOrg).mockResolvedValue({
			userId: "user-1",
			orgId: "org-uuid",
		});
	});

	it("returns 404 when job not found", async () => {
		vi.mocked(getJob).mockResolvedValue(null);
		const req = new NextRequest("http://localhost/api/v1/jobs/j1");
		const res = await GET_ONE(req, { params: Promise.resolve({ id: "j1" }) });
		expect(res.status).toBe(404);
	});

	it("returns 200 and job when found", async () => {
		const job = { id: "j1", title: "Engineer", status: "open" };
		vi.mocked(getJob).mockResolvedValue(job as any);
		const req = new NextRequest("http://localhost/api/v1/jobs/j1");
		const res = await GET_ONE(req, { params: Promise.resolve({ id: "j1" }) });
		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toEqual(job);
	});
});

describe("PATCH /api/v1/jobs/[id]", () => {
	beforeEach(() => {
		vi.mocked(getCurrentUserOrg).mockResolvedValue({
			userId: "user-1",
			orgId: "org-uuid",
		});
		vi.mocked(updateJob).mockResolvedValue({
			data: { id: "j1", title: "Updated" },
		} as any);
	});

	it("returns 200 and updated job", async () => {
		const req = new NextRequest("http://localhost/api/v1/jobs/j1", {
			method: "PATCH",
			body: JSON.stringify({ title: "Updated" }),
		});
		const res = await PATCH(req, { params: Promise.resolve({ id: "j1" }) });
		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data.title).toBe("Updated");
	});
});

describe("DELETE /api/v1/jobs/[id]", () => {
	beforeEach(() => {
		vi.mocked(getCurrentUserOrg).mockResolvedValue({
			userId: "user-1",
			orgId: "org-uuid",
		});
		vi.mocked(deleteJob).mockResolvedValue({ success: true } as any);
	});

	it("returns 200 and success", async () => {
		const req = new NextRequest("http://localhost/api/v1/jobs/j1", {
			method: "DELETE",
		});
		const res = await DELETE(req, { params: Promise.resolve({ id: "j1" }) });
		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data.success).toBe(true);
	});
});
