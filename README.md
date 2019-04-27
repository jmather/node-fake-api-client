# Fake API Server

This tool allows you to register collections of arbitrary endpoints to mock responses for against the [Fake API Server](https://github.com/jmather/node-fakeapi-server), allowing you to easily test your code end-to-end.

Pair with the [Fake API Server](https://github.com/jmather/node-fakeapi-server) for easy collection registration.

View the [API Documentation](https://documenter.getpostman.com/view/4858910/S1LpZrgg#intro) to get a better idea of how to use the Fake API.

A server instance has been set up at [https://node-fakeapi-server.herokuapp.com/](https://node-fakeapi-server.herokuapp.com/).

## Schema

```
server: https://node-fakeapi-server.herokuapp.com/ # Optional, may provide or override via CLI
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
    response_delay: 0 # or any value up to 60000 (60 seconds)
    headers:
      server: me!! # define response headers
```
## Usage

```
npm install
node ./bin/fake-api register -s https://node-fakeapi-server.herokuapp.com/ examples/sample.yaml
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
          "response_delay": 0
        }
      ],
      "response_mode": "incremental"
    }
  ]
}

```