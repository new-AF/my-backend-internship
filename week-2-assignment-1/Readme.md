# Week 2 Assignment 1

I implemented a Task backend service and its CRUD operations through HTTP methods.

All request bodies should be in JSON.

All response bodies if there's one are in JSON too.

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

Returns all tasks stored on the server.

Returns:

Status 200 OK

Body example:

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

Returns:

Status 201 Created

Body:

```json
{
    "id": 4,
    "title": "Buy milk",
    "done": false
}
```

In case the input body is malformed, it returns:

Status 400 Bad request,

and error message body:

```json
{
    "error": "bad title value in request body."
}
```

# PUT /tasks/:id

Updates the task at `id`.

Please note both `"title"` and `"done"` properties must be provided because this fits the semantics of PUT. **It replaces the resource completely.** [1]

```batch
curl -i -X PUT http://localhost:3000/tasks/4 -H "Content-Type: application/json" -d '{ "title": "Special task", "done": true }'
```

Returns:

Status 200

Body:

# References

[1] [https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PUT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PUT)
