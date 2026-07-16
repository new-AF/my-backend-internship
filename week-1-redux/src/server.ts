import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };

type Task = {
    id: number;
    title: string;
    done: boolean;
};

const storedTasks: Task[] = [
    {
        id: 1,
        title: "Complete assignment 1 original",
        done: true,
    },
    {
        id: 2,
        title: "Watch movie",
        done: false,
    },
    {
        id: 3,
        title: "Play game",
        done: false,
    },
];

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();

// run swagger with ./swagger.json OpenAPI spec
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// all bodies must be json
app.use(express.json());

// Stage 1: HTTP protocol, GET "method"/"verb"
app.get("/", (_request, response) => {
    response.status(200);
    response.json({ name: "Task API", version: "1.0", endpoints: ["/tasks"] });
});

app.get("/health", (_request, response) => {
    response.status(200);
    response.json({ status: "Ok" });
});

// CRUD app begininning
app.get("/tasks", (_request, response) => {
    response.status(200);
    response.json(storedTasks);
});

// Stage 2: GET by :id
app.get("/tasks/:id", (request, response) => {
    const { params } = request;
    const { id: idString } = params;
    const id = Number(idString);

    const found = storedTasks.find(({ id: storedId }) => id === storedId);

    // not found
    if (!found) {
        response.status(404);
        response.json({
            error: `Task ${id} not found.`,
        });
    }

    // found
    response.status(200);
    response.json(found);
});

// to not repeat code
type ValidationResult = { success: boolean; status?: number; error?: string };

const validateBody = (body): ValidationResult => {
    // bad request
    if (body === undefined) {
        return {
            success: false,
            status: 400,
            error: "missing body.",
        };
    }

    if ("title" in body === false) {
        return {
            success: false,
            status: 400,
            error: "missing title key in request body.",
        };
    }

    if (!body.title) {
        return {
            success: false,
            status: 400,
            error: "bad title value in request body.",
        };
    }

    if ("done" in body === false) {
        return {
            success: false,
            status: 400,
            error: "missing done key in request body.",
        };
    }

    if (!body.done) {
        return {
            success: false,
            status: 400,
            error: "bad done value in request body.",
        };
    }

    return { success: true };
};

// Stage 3: POST create
app.post("/tasks", (request, response) => {
    const { body } = request;

    const { success, status, error } = validateBody(body);

    if (!success) {
        response.status(status);
        response.json(error);
        return;
    }

    // create it
    const { title, done } = body;
    const id = storedTasks.length + 1;

    const task = {
        id,
        title,
        done,
    };

    storedTasks.push(task);

    response.status(201);
    response.json(task);
});

// launch server
app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
    console.log(`api docs available at localhost:${PORT}/docs`);
});
