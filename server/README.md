# Reference Implementation

This is the reference implementation (RI) of an Accord Project Agreement Protocol (APAP) Server.

# Running using Docker

## Run the System
We can easily run the whole with only a single command:
```bash
docker compose up
```

Docker will pull the Postgres and Node.js images (if our machine does not have it before).

The services can be run on the background with command:
```bash
docker compose up -d
```

## Stop the System
Stopping all the running containers is also simple with a single command:
```bash
docker compose down
```

If you need to stop and remove all containers, networks, and all images used by any service in <em>docker-compose.yml</em> file, use the command:
```bash
docker compose down --rmi all
```

# Running Locally without Docker

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

# Creating Database Schema

When a new datbase is created the database schema needs to be pushed to the Postgres database.

```
npx drizzle-kit push
```

# Connecting to the Database

You can use drizzle-studio to connect to the database (using the Chrome browser)

```
npm run db:studio
```

When Drizzle studio has launched you can connect using: https://local.drizzle.studio

# API Routes

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

Callers should refer to the `/capabilities` route to get the capabiltities of the RI:

```
http://localhost:9000/capabilities
```

Example response:

```
[
	"AGREEMENT_MANAGE",
	"SHARED_MODEL_MANAGE"
]
```

These capabiltities will evolve as the functionality of the RI is extended to new use cases.

# Updating RI When Protocol Changes

When the protocol (model) changes we need to regenerate the Drizzle ORM code (under `./db/schema.ts`) that is used for persistence and then push the modified database schema to
the Postgres database.

```
npm run drizzle-gen
npx drizzle-kit push
```
