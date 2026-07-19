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
    response.json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks", "/health"],
    });
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
    const { id: stringId } = params;
    const id = Number(stringId);

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

const validatePOST = (body): ValidationResult => {
    if (!body) {
        return { success: false, error: "Missing body" };
    }

    const { title } = body;

    const titleResult = validateTitle(title);

    if (!titleResult.success) {
        return titleResult;
    }

    return { success: true };
};

const validatePUT = (body): ValidationResult => {
    if (!body) {
        return { success: false, error: "Missing body" };
    }

    const { title, done } = body;

    const results = [validateTitle(title), validateDone(done)];

    const isAnyInvalid = results.find((obj) => !obj.success);

    if (isAnyInvalid) {
        return isAnyInvalid;
    }

    return { success: true };
};

// Stage 3: POST create
app.post("/tasks", (request, response) => {
    const { body } = request;

    // validate title
    const { success, error } = validatePOST(body);

    // bad request
    if (!success) {
        response.status(400);
        response.json({ error });
        return;
    }

    // create it
    const { title } = body;
    const id = storedTasks.length + 1;

    const task = {
        id,
        title,
        done: false,
    };

    storedTasks.push(task);

    response.status(201);
    response.json(task);
});

// Stage 4: full CRUD: PUT & DELETE
app.put("/tasks/:id", (request, response) => {
    const { body } = request;

    const { id: stringId } = request.params;

    const id = Number(stringId);

    const { success, error } = validatePUT(body);

    // bad request
    if (!success) {
        response.status(400);
        response.json({ error });
        return;
    }

    const { title, done } = body;

    // enforce idempotancy: if task exists, dont add it again
    const found = storedTasks.find((obj) => obj.id === id);

    if (!found) {
        response.status(404);
        response.json("Not found");
        return;
    }

    found.title = title;
    found.done = done;

    response.status(200);
    response.json(found);
});

app.delete("/tasks/:id", (request, response) => {
    // debugger;

    const { id: stringId } = request.params;

    if (!stringId) {
        response.status(400);
        response.json({ error: "missing id to delete" });
    }

    const id = Number(stringId);

    const foundIndex = storedTasks.findIndex((obj) => obj.id === id);

    if (foundIndex === -1) {
        response.status(404);
        response.json({ error: "not found id to delete" });
    }

    // delete element
    storedTasks.splice(foundIndex, 1);
    response.status(204);
    response.send();
});

// launch server
app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
    console.log(`api docs available at localhost:${PORT}/docs`);
});
