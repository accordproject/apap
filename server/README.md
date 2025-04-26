# Reference Implementation

This is the reference implementation (RI) of an Accord Project Agreement Protocol (APAP) Server.

## Configuration

The RI uses a Postgres database for persistence. Set the DATABASE_URL environment variable to a Postgres connection string. If you are running
a developer server you can create a file called `.env` in the root of the server director to store this value.

Example for a neon.tech hosted Postgres server:

```
DATABASE_URL=postgresql://SERVER_URL/neondb?sslmode=require
```

## Running

```bash
npm i
npm start
```

## API Routes

The API is mounted at the `/` root path and can be accessed via cURL (or Postman/Insomnia or similar).

GET routes support filtering by property name as well as `limit` and `page` parameters to page through large result sets.

```bash
curl --request GET \
  --url http://localhost:9000/templates?name=test?limit=10&page=0
```

POST routes example:

```
curl --request POST \
  --url http://localhost:9000/templates \
  --header 'Content-Type: application/json' \
  --data '{
    "name" : "test",
    "author" : "dan",
    "displayName" : "This is a test",
    "description" : "This is a template",
    "keywords": ["one", "two"],
    "version" : "1.0",
    "license" : "Apache-2",
    "metadata" : {
        "runtime" : "TypeScript",
            "template" : "clause",
            "cicero" : "1.0"
    },
    "templateModel": {
    },
    "logo": {},
    "logic" : {},
    "sampleRequest" : {},
    "text": {}
}'
```