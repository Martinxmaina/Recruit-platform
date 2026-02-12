import { describe, it, expect, vi, beforeEach } from "vitest";
import { jsonResponse, errorResponse } from "@/lib/api/helpers";

describe("API helpers", () => {
	describe("jsonResponse", () => {
		it("returns 200 and JSON body by default", async () => {
			const res = jsonResponse({ foo: "bar" });
			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data).toEqual({ foo: "bar" });
		});
		it("accepts custom status", async () => {
			const res = jsonResponse({ id: "1" }, 201);
			expect(res.status).toBe(201);
			const data = await res.json();
			expect(data).toEqual({ id: "1" });
		});
	});
	describe("errorResponse", () => {
		it("returns error message and status", async () => {
			const res = errorResponse("Unauthorized", 401);
			expect(res.status).toBe(401);
			const data = await res.json();
			expect(data).toEqual({ error: "Unauthorized" });
		});
	});
});
