import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "@/server";

const runAllTests = () => {
    it("GET /", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
    });
    it("GET /health", async () => {
        const response = await request(app).get("/health");
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual({ status: "Ok" });
    });
};

describe("Testing CRUD", () => runAllTests());
