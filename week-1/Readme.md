# Week 1

> Live service: **https://my-backend-internship-week-1.onrender.com/**

I defined two JSON entry points: `GET /hello` and `POST /echo`

## `GET /hello`

Always returns

```json
{
    "message": "world"
}
```

## `POST /echo`

Request body must be in JSON and have `message` key. It returns back the same value that was sent.

Request:

```json
{
    "message": "hello"
}
```

Response:

```json
{
    "echo": "hello"
}
```
