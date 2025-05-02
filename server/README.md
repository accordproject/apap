# Reference Implementation

This is the reference implementation (RI) of an Accord Project Agreement Protocol (APAP) Server.

# Running using Docker

## Create a .env file
Clone the `.env_example` file, and save it as `.env`. The contents of the file should be:
```env
POSTGRES_DATABASE=postgres
POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1baddeed
POSTGRES_PORT=5432
```

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

After starting for the first time, you'll need to initialize the database schema. Run the following command from your host terminal.
```bash
npx drizzle-kit push
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

```bash
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

## Getting Capabilities of the Server

Callers should call the `/capabilities` route to get the capabiltities of an APAP server (including the RI):

```
http://localhost:9000/capabilities
```

Example response:

```
[
  "TEMPLATE_MANAGE",
	"AGREEMENT_MANAGE",
	"SHARED_MODEL_MANAGE"
]
```

These capabiltities will evolve as the functionality of the RI is extended to new use cases.

## Creating a Resource

```
curl --request POST \
  --url http://localhost:9000/templates \
  --header 'Content-Type: application/json' \
  --data '{
	"uri": "apap://dan",
	"author": "dan",
	"displayName": "This is a test",
	"description": "This is a template",
	"keywords": [
		"one",
		"two"
	],
	"version": "1.0",
	"license": "Apache-2",
	"metadata": {
		"runtime": "TypeScript",
		"template": "clause",
		"cicero": "1.0"
	},
	"templateModel": {
		"typeName": "foo",
		"model": {
			"$class": "org.accordproject.protocol@1.0.0.CtoModel",
			"ctoFiles": [
				"test"
			]
		}
	},
	"text": {
		"$class": "org.accordproject.protocol@1.0.0.Text",
		"templateText": "test"
	}
}'
```

Response:

> Note the id field which must be used to get, update or delete the resource.

```json
{
	"id": 18,
	"uri": "apap://dan2",
	"author": "dan",
	"displayName": "This is a test",
	"version": "1.0",
	"description": "This is a template",
	"license": "Apache-2",
	"keywords": [
		"one",
		"two"
	],
	"metadata": {
		"$class": "org.accordproject.protocol@1.0.0.TemplateMetadata",
		"runtime": "TypeScript",
		"template": "clause",
		"cicero": "1.0"
	},
	"logo": null,
	"templateModel": {
		"$class": "org.accordproject.protocol@1.0.0.TemplateModel",
		"typeName": "foo",
		"model": {
			"$class": "org.accordproject.protocol@1.0.0.CtoModel",
			"ctoFiles": [
				"test"
			]
		}
	},
	"text": {
		"$class": "org.accordproject.protocol@1.0.0.Text",
		"templateText": "test"
	},
	"logic": null,
	"sampleRequest": null
}
```

## Getting a Single Resource

```bash
curl --request GET \
  --url http://localhost:9000/templates/8 \
  --header 'Content-Type: application/json'
```

Response:

```json
{
	"id": 18,
	"uri": "apap://dan2",
	"author": "dan",
	"displayName": "This is a test",
	"version": "1.0",
	"description": "This is a template",
	"license": "Apache-2",
	"keywords": [
		"one",
		"two"
	],
	"metadata": {
		"$class": "org.accordproject.protocol@1.0.0.TemplateMetadata",
		"runtime": "TypeScript",
		"template": "clause",
		"cicero": "1.0"
	},
	"logo": null,
	"templateModel": {
		"$class": "org.accordproject.protocol@1.0.0.TemplateModel",
		"typeName": "foo",
		"model": {
			"$class": "org.accordproject.protocol@1.0.0.CtoModel",
			"ctoFiles": [
				"test"
			]
		}
	},
	"text": {
		"$class": "org.accordproject.protocol@1.0.0.Text",
		"templateText": "test"
	},
	"logic": null,
	"sampleRequest": null
}
```

## Getting Resources

Getting templates using query parameters:

```
curl --request GET \
  --url 'http://localhost:9000/templates?uri=apap%3A%2F%2Ftest&author=tim' \
  --header 'Content-Type: application/json'
```

Response:

```json
{
	"items": [
		{
			"id": 11,
			"uri": "apap://test",
			"author": "dan",
			"displayName": "This is a test",
			"version": "1.0",
			"description": "This is a template",
			"license": "Apache-2",
			"keywords": [
				"one",
				"two"
			],
			"metadata": {
				"$class": "org.accordproject.protocol@1.0.0.TemplateMetadata",
				"runtime": "TypeScript",
				"template": "clause",
				"cicero": "1.0"
			},
			"logo": null,
			"templateModel": {
				"$class": "org.accordproject.protocol@1.0.0.TemplateModel",
				"typeName": "foo",
				"model": {
					"$class": "org.accordproject.protocol@1.0.0.CtoModel",
					"ctoFiles": [
						"test"
					]
				}
			},
			"text": {
				"$class": "org.accordproject.protocol@1.0.0.Text",
				"templateText": "test"
			},
			"logic": null,
			"sampleRequest": null
		}
	],
	"total": 1,
	"page": 1,
	"limit": 100,
	"totalPages": 1
}
```

> Note that only string parameters and the "=" operator are currently supported .

### Pagination

GET routes support filtering by property name as well as `limit` and `page` parameters to page through large result sets.

```bash
curl --request GET \
  --url http://localhost:9000/templates?author=tim?limit=10&page=0
```

## Updating Resources

```bash
curl --request PUT \
  --url http://localhost:9000/templates/8 \
  --header 'Content-Type: application/json' \
  --data '{
    "author" : "dan"
}'
```

Response:

```json
{
	"id": 18,
	"uri": "apap://dan2",
	"author": "dan",
	"displayName": "This is a test",
	"version": "1.0",
	"description": "This is a template",
	"license": "Apache-2",
	"keywords": [
		"one",
		"two"
	],
	"metadata": {
		"$class": "org.accordproject.protocol@1.0.0.TemplateMetadata",
		"runtime": "TypeScript",
		"template": "clause",
		"cicero": "1.0"
	},
	"logo": null,
	"templateModel": {
		"$class": "org.accordproject.protocol@1.0.0.TemplateModel",
		"typeName": "foo",
		"model": {
			"$class": "org.accordproject.protocol@1.0.0.CtoModel",
			"ctoFiles": [
				"test"
			]
		}
	},
	"text": {
		"$class": "org.accordproject.protocol@1.0.0.Text",
		"templateText": "test"
	},
	"logic": null,
	"sampleRequest": null
}
```

## Deleting a Single Resource

```bash
curl --request DELETE \
  --url http://localhost:9000/templates/8 \
  --header 'Content-Type: application/json'
```

Response:

```
{
	"status": "deleted"
}
```

# Updating RI When Protocol Changes

When the protocol (model) changes we need to regenerate the Drizzle ORM code (under `./db/schema.ts`) that is used for persistence and then push the modified database schema to
the Postgres database.

```
npm run drizzle-gen
npx drizzle-kit push
```
