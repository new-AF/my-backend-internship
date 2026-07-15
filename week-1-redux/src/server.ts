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

// launch server
app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
    console.log(`api docs available at localhost:${PORT}/docs`);
});
