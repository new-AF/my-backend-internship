import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();

// run swagger with ./swagger.json OpenAPI spec
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// all bodies must be json
app.use(express.json());

// HTTP protocol, GET "method"/"verb"
app.get("/", (_request, response) => {
    response.status(200);
    response.json({ message: "Hello world from server!" });
});

// launch server
app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
    console.log(`api docs available at localhost:${PORT}/docs`);
});
