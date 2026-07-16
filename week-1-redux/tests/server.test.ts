import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "@/server";

const runAllTests = () => {
    it("GET /", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
    });
    it("GET /health", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe({ status: "Ok" });
    });
};

describe("Testing CRUD", () => runAllTests());
