# Fake API Server

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/42f8e45340c742e68b8df42ca34a3fae)](https://app.codacy.com/app/jmather/node-fake-api-client?utm_source=github.com&utm_medium=referral&utm_content=jmather/node-fake-api-client&utm_campaign=Badge_Grade_Dashboard)
[![DeepScan grade](https://deepscan.io/api/teams/2509/projects/5226/branches/40565/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=2509&pid=5226&bid=40565)

This tool allows you to register collections of arbitrary endpoints to mock responses for against the [Fake API Server](https://github.com/jmather/node-fake-api-server), allowing you to easily test your code end-to-end.

Pair with the [Fake API Server](https://github.com/jmather/node-fake-api-server) for easy collection registration.

View the [API Documentation](https://documenter.getpostman.com/view/4858910/S1LpZrgg#intro) to get a better idea of how to use the Fake API.

A server instance has been set up at [https://node-fake-api-server.herokuapp.com/](https://node-fake-api-server.herokuapp.com/).

## Schema

```yaml
server: https://node-fake-api-server.herokuapp.com/ # Optional, may provide or override via CLI
external_id: readme-example # Optional.
endpoints:
- method: get
  path: /test
  headers:
    X-Bar: blah # require X-Bar to be set to blah.
  query_parameters:
    biz: baz # Require ?biz=baz
  response_mode: incremental # or random.
  responses:
  - status: 200
    content: Foo!
    content_type: text/plain
    delay: 0 # or any value up to 60000 (60 seconds)
    headers:
      server: me!! # define response headers
```
## Usage

```bash
npm install -g node-fake-api-client
fake-api register -s https://node-fake-api-server.herokuapp.com/ examples/sample.yaml
{
  "username": "935c5ba7-bff1-47f8-a9bd-a855c0ecadb0",
  "password": "951fa676-8304-4e2a-b854-9d00beecd844",
  "auth_token": "OTM1YzViYTctYmZmMS00N2Y4LWE5YmQtYTg1NWMwZWNhZGIwOjk1MWZhNjc2LTgzMDQtNGUyYS1iODU0LTlkMDBiZWVjZDg0NA==",
  "endpoints": [
    {
      "method": "get",
      "path": "/test",
      "responses": [
        {
          "status": 200,
          "content": "{\"foo\": \"bar\"}",
          "content_type": "application/json",
          "delay": 0
        }
      ],
      "response_mode": "incremental"
    }
  ]
}

```