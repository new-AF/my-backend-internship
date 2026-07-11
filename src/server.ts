import express from "express";

const app = express();

// mandates http body be json
app.use(express.json());

// define endpoints. GET dont have body
app.get("/hello", (_request, response) => {
    response.status(200);
    response.json({ message: "world" });
});

app.post("/echo", (request, response) => {
    const { body } = request;
    const { message } = body;

    response.status(200);
    response.json({ echo: message });
});

// launch server
app.listen(3000, () => {
    console.log("server running at port 3000");
});
