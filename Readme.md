These are my solutions to assignments of the FlyRank Backend AI Engineering track.

I used TypeScript + Express as stacks

> Note: all services are deployed on the free tier at _Render_ which spins them down after a period of inactivity. **So a cold start could take 30-60 seconds.**

# Week 1

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
