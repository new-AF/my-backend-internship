import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import { app } from "@/server";
import { storedTasks, reset } from "@/storedTasks";

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
};

const testPOST = () => {
    const userSentTask = { title: "test" };

    it("POST /tasks validJSON", async () => {
        const response = await request(app).post("/tasks").send(userSentTask);

        expect(response.status).toBe(201);
        expect(response.body).toStrictEqual({
            ...userSentTask,
            done: false,
            id: 4,
        });
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

    it("POST /tasks invalidJSON title valid", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ title: "test" });

        expect(response.status).toBe(201);
        expect(response.body).toStrictEqual({
            ...userSentTask,
            done: false,
            id: 5,
        });
    });

    it("POST /tasks invalidJSON title invalid", async () => {
        const response = await request(app)
            .post("/tasks")
            .send({ title: ["test"] });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("POST /tasks same validJSON; not idempotent", async () => {
        const response = await request(app).post("/tasks").send(userSentTask);

        expect(response.status).toBe(201);
        expect(response.body).toStrictEqual({
            ...userSentTask,
            done: false,
            id: 6,
        });
    });

    it("GET /tasks userSentTask saved", async () => {
        const response = await request(app).get("/tasks");
        expect(response.status).toBe(200);
        // the array has been appended to
        expect(response.body).toStrictEqual(storedTasks);
    });
};

const testPUT = () => {
    // reset "db"
    beforeAll(reset);

    const userSentTask = { title: "test", done: true };
    const savedTask = { ...userSentTask, id: 1 };

    it("PUT /tasks/1 validJSON", async () => {
        const response = await request(app).put("/tasks/1").send(userSentTask);

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(savedTask);
    });

    it("GET /tasks userSentTask saved", async () => {
        const response = await request(app).get("/tasks");
        expect(response.status).toBe(200);
        // the array has been appended to
        expect(response.body).toStrictEqual(storedTasks);
    });

    it("PUT /tasks invalidJSON no body", async () => {
        const response = await request(app).put("/tasks/1").send();

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("PUT /tasks invalidJSON empty json", async () => {
        const response = await request(app).put("/tasks/1").send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("PUT /tasks invalidJSON title undefined", async () => {
        const response = await request(app)
            .put("/tasks/1")
            .send({ title: undefined });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("PUT /tasks invalidJSON title null", async () => {
        const response = await request(app)
            .put("/tasks/1")
            .send({ title: null });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("PUT /tasks invalidJSON title null, done valid", async () => {
        const response = await request(app)
            .put("/tasks/1")
            .send({ title: null, done: true });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("PUT /tasks invalidJSON title valid, done invalid", async () => {
        const response = await request(app)
            .put("/tasks/1")
            .send({ title: "test", done: 1 });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("PUT /tasks invalidJSON title invalid, done invalid", async () => {
        const response = await request(app)
            .put("/tasks/1")
            .send({ title: ["test"], done: 1 });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("PUT /tasks/1 same validJSON; idempotent", async () => {
        const response = await request(app).put("/tasks/1").send(userSentTask);

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(savedTask);
    });

    it("GET /tasks userSentTask saved", async () => {
        const response = await request(app).get("/tasks");
        expect(response.status).toBe(200);
        // the array has been appended to
        expect(response.body).toStrictEqual(storedTasks);
    });
};

const testDELETE = () => {
    beforeAll(reset);

    it("DELETE /tasks/1", async () => {
        const response = await request(app).delete("/tasks/1");

        expect(response.status).toBe(204);
        expect(response.body).toStrictEqual({});
    });

    it("DELETE /tasks/2", async () => {
        const response = await request(app).delete("/tasks/2");

        expect(response.status).toBe(204);
        expect(response.body).toStrictEqual({});
    });

    it("DELETE /tasks/3", async () => {
        const response = await request(app).delete("/tasks/3");

        expect(response.status).toBe(204);
        expect(response.body).toStrictEqual({});
    });

    it("DELETE /tasks/4", async () => {
        const response = await request(app).delete("/tasks/4");

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error");
    });
};

const testAssignmentTasks = () => {
    beforeAll(reset);

    it("GET /tasks/1", async () => {
        const response = await request(app).get("/tasks/1");
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual(storedTasks[0]);
    });

    it("GET /tasks/99", async () => {
        const response = await request(app).get("/tasks/99");
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error");
    });

    it("POST /tasks some milk", async () => {
        const buyMilk = { title: "Buy milk" };
        const response = await request(app).post("/tasks").send(buyMilk);

        expect(response.status).toBe(201);
        expect(response.body).toStrictEqual({ ...buyMilk, done: false, id: 4 });
    });

    // create a task, update it, mark it done, delete it, and confirm with GET /tasks — all via curl, all with the right status codes ( 201 , 200 , 204 , 404 ).
    it("POST /tasks some milk", async () => {
        const specialTask = { title: "Special Task" };

        // create it
        const postResponse = await request(app)
            .post("/tasks")
            .send(specialTask);

        expect(postResponse.status).toBe(201);
        expect(postResponse.body).toStrictEqual({
            ...specialTask,
            done: false,
            id: 5,
        });

        // mark it done
        const putResponse = await request(app)
            .put("/tasks/5")
            .send({ title: "Special task II", done: true });
        expect(putResponse.status).toBe(200);

        // delete it
        const deleteResponse = await request(app).delete("/tasks/5");
        expect(deleteResponse.status).toBe(204);

        // try to get it
        const getResponse = await request(app).get("/tasks/5");
        expect(getResponse.status).toBe(404);
    });
};

describe("Testing GET method", () => testGET());
describe("Testing POST method", () => testPOST());
describe("Testing PUT method", () => testPUT());
describe("Testing DELETE method", () => testDELETE());
describe("Testing Assignment Tasks", () => testAssignmentTasks());
