import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "@/server";
import { storedTasks } from "@/storedTasks";

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

    it("GET /tasks", async () => {
        const response = await request(app).get("/tasks");
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(storedTasks);
    });

    it("GET /tasks/2", async () => {
        const response = await request(app).get("/tasks/2");
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(storedTasks[1]);
    });

    it("POST /tasks someObject", async () => {
        const testObject = { title: "test", done: true };

        const response = await request(app).post("/tasks").send(testObject);

        expect(response.status).toBe(201);
        expect(response.body).toStrictEqual({ ...testObject, id: 4 });
    });
};

describe("Testing CRUD", () => runAllTests());
