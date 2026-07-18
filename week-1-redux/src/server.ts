import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };
import { storedTasks, Task } from "./storedTasks";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
export const app = express();

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
type ValidationResult = { success: boolean; error?: string };

const validateBody = (
    body: Task,
    validationType: "all" | "any",
): ValidationResult => {
    // bad request
    if (body === undefined) {
        return {
            success: false,
            error: "missing body.",
        };
    }

    const { title, done } = body;

    if (
        validationType === "all" ||
        (validationType === "any" && title && done)
    ) {
        const titleResult = validateTitle(title);
        const doneResult = validateDone(done);

        return {
            success: titleResult.success && doneResult.success,
            error: (() => {
                if (!titleResult.success && !doneResult.success) {
                    return "both title and done missing";
                }
                if (!titleResult.success) {
                    return titleResult.error;
                }
                return doneResult.error;
            })(),
        };
    }

    if (validationType === "any") {
        return validateTitle(title);
    }
    if (validationType === "done") {
        return validateDone(done);
    }

    return { success: true };
};

const validateTitle = (title: string): ValidationResult => {
    if (title === undefined) {
        return {
            success: false,

            error: "missing title key in request body.",
        };
    }

    // makeshift runtime validation
    if (typeof title !== "string") {
        return {
            success: false,
            error: "bad title value in request body.",
        };
    }

    return { success: true };
};

const validateDone = (done: boolean): ValidationResult => {
    if (done === undefined) {
        return {
            success: false,
            status: 400,
            error: "missing done key in request body.",
        };
    }

    // makeshift runtime validation
    if (typeof done !== "boolean") {
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

    // validate
    const { success, error } = validateBody(body, "all");

    // bad request
    if (!success) {
        response.status(400);
        response.json({ error });
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

// Stage 4: full CRUD: PUT & DELETE
app.put("/tasks", (request, response) => {
    const { body } = request;

    const { success, error } = validateBody(body, "any");

    // bad request
    if (!success) {
        response.status(400);
        response.json({ error });
        return;
    }

    const { title, done } = body;

    // enforce idempotancy: if task exists, dont add it again
    const found = storedTasks.find(
        (obj) => obj.title === title && obj.done === done,
    );

    if (found) {
        response.status(200);
        response.json(found);
        return;
    }

    // create it, either one is okay
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

app.delete("/tasks/:id", (request, response) => {
    debugger;

    const { id: idString } = request.params;

    if (!idString) {
        response.status(400);
        response.json({ error: "missing id to delete" });
    }

    const id = Number(idString);

    const foundIndex = storedTasks.findIndex((obj) => obj.id === id);

    if (foundIndex === -1) {
        response.status(404);
        response.json({ error: "not found id to delete" });
    }

    // delete  element
    storedTasks.splice(foundIndex, 1);
    response.status(204);
    response.send();
});

// launch server
app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
    console.log(`api docs available at localhost:${PORT}/docs`);
});
