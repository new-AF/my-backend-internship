# Week 2 Assignment 1

I implemented a Tasks backend service and its CRUD operations through HTTP methods.

All request bodies must be in JSON.

All response bodies (if there's one) are in JSON too.

# Live service

> Note: The service is deployed on the free tier at _Render_ which spins them down after a period of inactivity. **So a cold start could take 30-60 seconds.**

**https://my-backend-internship-week-2-assignment-1.onrender.com/**

# Local usage

```bash
pnpm install
pnpm run server
```

## Tests

To run integration tests:

```bash
pnpm run test
```

# GET /

Returns information about API endpoints

Returns:

Status 200 OK

Body:

```JSON
{
  "name": "Task API",
  "version": "1.0",
  "endpoints": [
    "/tasks",
    "/health"
  ]
}
```

# GET /health

Checking if server is running.

Returns:

Status 200 OK

Body:

```json
{
    "status": "Ok"
}
```

# GET /tasks

Returns JSON all tasks stored on the server, as array of objects.

Example:

```json
[
    {
        "id": 1,
        "title": "Complete assignment 1 original",
        "done": true
    },
    {
        "id": 2,
        "title": "Watch movie",
        "done": false
    },
    {
        "id": 3,
        "title": "Play game",
        "done": false
    }
]
```

# POST /tasks

Creates a task on the server.

JSON request body must have `"title"` as string.

```bash
curl -i --json '{ "title": "Buy milk" }' http://localhost:3000/tasks
```

## On success

Status 201 Created

Body:

```json
{
    "id": 4,
    "title": "Buy milk",
    "done": false
}
```

## On error

If either body is missing or `"title"` or `"done"` are malformed.

Status 400 Bad request

Body:

```json
{
    "error": "bad title value in request body."
}
```

# PUT /tasks/:id

Updates the task at `id`.

> Note: both `"title"` and `"done"` properties must be provided because its the semantics of PUT. **It replaces the resource completely.** [1]

```batch
curl -i -X PUT http://localhost:3000/tasks/4 -H "Content-Type: application/json" -d '{ "title": "Special task", "done": true }'
```

## On success

Status 200

Body:

```json
{
    "id": 4,
    "title": "Special task",
    "done": true
}
```

## On error

Status 400 Bad request

```json
{
    "error": "bad title value in request body."
}
```

# DELETE /tasks/:id

```bash
curl -i -X DELETE http://localhost:3000/tasks/9
```

## On success

Status 204 No content

Doesn't return body

## On error

Status 404 Not Found

```json
{
    "error": "not found id to delete"
}
```

# References

[1] [https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PUT)
