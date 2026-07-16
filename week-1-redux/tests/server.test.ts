import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "@/server";
import { storedTasks } from "@/storedTasks";

const testGET = () => {
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
};

const testPOST = () => {
    const userSentTask = { title: "test", done: true };
    const savedTask = { ...userSentTask, id: 4 };

    it("POST /tasks someObject", async () => {
        const response = await request(app).post("/tasks").send(userSentTask);

        expect(response.status).toBe(201);
        expect(response.body).toStrictEqual(savedTask);
    });

    it("GET /tasks", async () => {
        const response = await request(app).get("/tasks");
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(storedTasks);
    });
};

describe("Testing GET method", () => testGET());
describe("Testing POST method", () => testPOST());
