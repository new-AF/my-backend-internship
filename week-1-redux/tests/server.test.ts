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

    it("POST /tasks validJSON", async () => {
        const response = await request(app).post("/tasks").send(userSentTask);

        expect(response.status).toBe(201);
        expect(response.body).toStrictEqual(savedTask);
    });

    it("GET /tasks userSentTask saved", async () => {
        const response = await request(app).get("/tasks");
        expect(response.status).toBe(200);
        // the array has been appended to
        expect(response.body).toStrictEqual(storedTasks);
    });

    it("POST /tasks invalidJSON no body", async () => {
        const response = await request(app).post("/tasks").send();

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("POST /tasks invalidJSON empty json", async () => {
        const response = await request(app).post("/tasks").send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("POST /tasks invalidJSON title undefined", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ title: undefined });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("POST /tasks invalidJSON title null", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ title: null });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("POST /tasks invalidJSON title null, done valid", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ title: null, done: true });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("POST /tasks invalidJSON title valid, done invalid", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ title: "test", done: 1 });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("POST /tasks invalidJSON title invalid, done invalid", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ title: ["test"], done: 1 });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("POST /tasks same validJSON; not idempotent", async () => {
        const response = await request(app).post("/tasks").send(userSentTask);

        expect(response.status).toBe(201);
        expect(response.body).toStrictEqual({ ...userSentTask, id: 5 });
    });

    it("GET /tasks userSentTask saved", async () => {
        const response = await request(app).get("/tasks");
        expect(response.status).toBe(200);
        // the array has been appended to
        expect(response.body).toStrictEqual(storedTasks);
    });
};

describe("Testing GET method", () => testGET());
describe("Testing POST method", () => testPOST());
