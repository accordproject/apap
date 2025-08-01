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

## Rebuild the images

```bash
docker-compose build
```

# Running Locally without Docker

The RI uses a Postgres database for persistence. Set the POSTGRES_URL environment variable to a Postgres connection string. If you are running
a developer server you can create a file called `.env` in the root of the server directory to store this value.

Example for a neon.tech hosted Postgres server:

```
POSTGRES_URL=postgresql://SERVER_URL/neondb?sslmode=require
```

## Running

```bash
npm i
npm start
```

> Note: `npm run dev` will start a dev server that will hot-reload code changes.

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
	"SHARED_MODEL_MANAGE",
	"AGREEMENT_CONVERT_HTML"
]
```

These capabiltities will evolve as the functionality of the RI is extended to new use cases.

## Creating a Template

```bash
curl --request POST \
  --url http://localhost:9000/templates \
  --header 'Content-Type: application/json' \
  --data '{
	"uri": "resource:org.accordproject.protocol@1.0.0.Template#dan",
	"author": "dan",
	"displayName": "Late Delivery and Penalty",
	"version": "1.0.0",
	"description": "This is late delivery and penalty template",
	"license": "Apache-2",
	"keywords": [
		"one",
		"two"
	],
	"metadata": {
		"$class": "org.accordproject.protocol@1.0.0.TemplateMetadata",
		"runtime": "typescript",
		"template": "clause",
		"cicero": "0.25.x"
	},
	"logo": null,
	"templateModel": {
		"$class": "org.accordproject.protocol@1.0.0.TemplateModel",
		"typeName": "foo",
		"model": {
			"$class": "org.accordproject.protocol@1.0.0.CtoModel",
			"ctoFiles": [
				{
					"contents":
				"namespace io.clause.latedeliveryandpenalty@0.1.0\r\n\r\nimport org.accordproject.time@0.3.0.{Duration, TemporalUnit} from https://models.accordproject.org/time@0.3.0.cto\r\n\r\nimport org.accordproject.contract@0.2.0.Clause from https://models.accordproject.org/accordproject/contract@0.2.0.cto\r\nimport org.accordproject.runtime@0.2.0.{Request,Response} from https://models.accordproject.org/accordproject/runtime@0.2.0.cto\r\n\r\n/**\r\n * Defines the data model for the LateDeliveryAndPenalty template.\r\n * This defines the structure of the abstract syntax tree that the parser for the template\r\n * must generate from input source text.\r\n */\r\n@template\r\nasset TemplateModel extends Clause {\r\n  /**\r\n   * Does the clause include a force majeure provision?\r\n   */\r\n  o Boolean forceMajeure\r\n\r\n  /**\r\n   * For every penaltyDuration that the goods are late\r\n   */\r\n  o Duration penaltyDuration\r\n\r\n  /**\r\n   * Seller pays the buyer penaltyPercentage % of the value of the goods\r\n   */\r\n  o Double penaltyPercentage\r\n\r\n  /**\r\n   * Up to capPercentage % of the value of the goods\r\n   */\r\n  o Double capPercentage\r\n\r\n  /**\r\n   * If the goods are >= termination late then the buyer may terminate the contract\r\n   */\r\n  o Duration termination\r\n\r\n  /**\r\n   * Fractional part of a ... is considered a whole ...\r\n   */\r\n  o TemporalUnit fractionalPart\r\n}\r\n\r\n/**\r\n * Defines the input data required by the template\r\n */\r\ntransaction LateDeliveryAndPenaltyRequest extends Request {\r\n\r\n  /**\r\n   * Are we in a force majeure situation?\r\n   */\r\n  o Boolean forceMajeure\r\n\r\n  /**\r\n   * What was the agreed delivery date for the goods?\r\n   */\r\n  o DateTime agreedDelivery\r\n\r\n  /**\r\n   * If the goods have been delivered, when where they delivered?\r\n   */\r\n  o DateTime deliveredAt optional\r\n\r\n  /**\r\n   * What is the value of the goods?\r\n   */\r\n  o Double goodsValue\r\n}\r\n\r\n/**\r\n * Defines the output data for the template\r\n */\r\ntransaction LateDeliveryAndPenaltyResponse extends Response {\r\n  /**\r\n   * The penalty to be paid by the seller\r\n   */\r\n  o Double penalty\r\n\r\n  /**\r\n   * Whether the buyer may terminate the contract\r\n   */\r\n  o Boolean buyerMayTerminate\r\n}",
				"filename" : "test.cto"
				}
			]
		}
	},
	"text": {
		"$class": "org.accordproject.protocol@1.0.0.Text",
		"templateText": "Late Delivery and Penalty – {{% return now.toLocaleString() %}}\r\n----\r\n\r\nIn case of delayed delivery{{#if forceMajeure}}, except for Force Majeure cases,{{/if}} the Seller shall pay to the Buyer for every _{{% return `${penaltyDuration.amount} ${penaltyDuration.unit}` %}} of delay_ ***Penalty*** amounting to {{penaltyPercentage}}% of the total value of the Equipment whose delivery has been delayed.\r\n\r\n1. Any fractional part of a {{fractionalPart}} is to be considered a full {{fractionalPart}}.\r\n1. The total amount of penalty shall not however, exceed {{capPercentage}}% of the total value of the Equipment involved in late delivery.\r\n1. If the delay is more than {{% return `${termination.amount} ${termination.unit}` %}}, the Buyer is entitled to terminate this Contract."
	},
	"logic": null,
	"sampleRequest": null
}'
```

Response:

> Note the id field which must be used to get, update or delete the resource.

```json
{
	"id": 25,
	"uri": "resource:org.accordproject.protocol@1.0.0.Template#dan",
	"author": "dan",
	"displayName": "Late Delivery and Penalty",
	"version": "1.0.0",
	"description": "This is late delivery and penalty template",
	"license": "Apache-2",
	"keywords": [
		"one",
		"two"
	],
	"metadata": {
		"$class": "org.accordproject.protocol@1.0.0.TemplateMetadata",
		"runtime": "typescript",
		"template": "clause",
		"cicero": "0.25.x"
	},
	"logo": null,
	"templateModel": {
		"$class": "org.accordproject.protocol@1.0.0.TemplateModel",
		"typeName": "foo",
		"model": {
			"$class": "org.accordproject.protocol@1.0.0.CtoModel",
			"ctoFiles": [
				"namespace io.clause.latedeliveryandpenalty@0.1.0\r\n\r\nimport org.accordproject.time@0.3.0.{Duration, TemporalUnit} from https://models.accordproject.org/time@0.3.0.cto\r\n\r\nimport org.accordproject.contract@0.2.0.Clause from https://models.accordproject.org/accordproject/contract@0.2.0.cto\r\nimport org.accordproject.runtime@0.2.0.{Request,Response} from https://models.accordproject.org/accordproject/runtime@0.2.0.cto\r\n\r\n/**\r\n * Defines the data model for the LateDeliveryAndPenalty template.\r\n * This defines the structure of the abstract syntax tree that the parser for the template\r\n * must generate from input source text.\r\n */\r\n@template\r\nasset TemplateModel extends Clause {\r\n  /**\r\n   * Does the clause include a force majeure provision?\r\n   */\r\n  o Boolean forceMajeure\r\n\r\n  /**\r\n   * For every penaltyDuration that the goods are late\r\n   */\r\n  o Duration penaltyDuration\r\n\r\n  /**\r\n   * Seller pays the buyer penaltyPercentage % of the value of the goods\r\n   */\r\n  o Double penaltyPercentage\r\n\r\n  /**\r\n   * Up to capPercentage % of the value of the goods\r\n   */\r\n  o Double capPercentage\r\n\r\n  /**\r\n   * If the goods are >= termination late then the buyer may terminate the contract\r\n   */\r\n  o Duration termination\r\n\r\n  /**\r\n   * Fractional part of a ... is considered a whole ...\r\n   */\r\n  o TemporalUnit fractionalPart\r\n}\r\n\r\n/**\r\n * Defines the input data required by the template\r\n */\r\ntransaction LateDeliveryAndPenaltyRequest extends Request {\r\n\r\n  /**\r\n   * Are we in a force majeure situation?\r\n   */\r\n  o Boolean forceMajeure\r\n\r\n  /**\r\n   * What was the agreed delivery date for the goods?\r\n   */\r\n  o DateTime agreedDelivery\r\n\r\n  /**\r\n   * If the goods have been delivered, when where they delivered?\r\n   */\r\n  o DateTime deliveredAt optional\r\n\r\n  /**\r\n   * What is the value of the goods?\r\n   */\r\n  o Double goodsValue\r\n}\r\n\r\n/**\r\n * Defines the output data for the template\r\n */\r\ntransaction LateDeliveryAndPenaltyResponse extends Response {\r\n  /**\r\n   * The penalty to be paid by the seller\r\n   */\r\n  o Double penalty\r\n\r\n  /**\r\n   * Whether the buyer may terminate the contract\r\n   */\r\n  o Boolean buyerMayTerminate\r\n}"
			]
		}
	},
	"text": {
		"$class": "org.accordproject.protocol@1.0.0.Text",
		"templateText": "Late Delivery and Penalty – {{% return now.toLocaleString() %}}\r\n----\r\n\r\nIn case of delayed delivery{{#if forceMajeure}}, except for Force Majeure cases,{{/if}} the Seller shall pay to the Buyer for every _{{% return `${penaltyDuration.amount} ${penaltyDuration.unit}` %}} of delay_ ***Penalty*** amounting to {{penaltyPercentage}}% of the total value of the Equipment whose delivery has been delayed.\r\n\r\n1. Any fractional part of a {{fractionalPart}} is to be considered a full {{fractionalPart}}.\r\n1. The total amount of penalty shall not however, exceed {{capPercentage}}% of the total value of the Equipment involved in late delivery.\r\n1. If the delay is more than {{% return `${termination.amount} ${termination.unit}` %}}, the Buyer is entitled to terminate this Contract."
	},
	"logic": null,
	"sampleRequest": null
}
```

## Getting a Single Resource

```bash
curl --request GET \
  --url http://localhost:9000/templates/18 \
  --header 'Content-Type: application/json'
```

Response:

```json
{
	"id": 18,
	"uri": "resource:org.accordproject.protocol@1.0.0.Template#dan2",
	"author": "matt",
	"displayName": "This is a test",
	"version": "1.0.0",
	"description": "This is a template",
	"license": "Apache-2",
	"keywords": [
		"one",
		"two"
	],
	"metadata": {
		"$class": "org.accordproject.protocol@1.0.0.TemplateMetadata",
		"runtime": "typescript",
		"template": "clause",
		"cicero": "0.25.x"
	},
	"logo": null,
	"templateModel": {
		"$class": "org.accordproject.protocol@1.0.0.TemplateModel",
		"typeName": "foo",
		"model": {
			"$class": "org.accordproject.protocol@1.0.0.CtoModel",
			"ctoFiles": [
				"namespace io.clause.latedeliveryandpenalty@0.1.0\r\n\r\nimport org.accordproject.time@0.3.0.{Duration, TemporalUnit} from https://models.accordproject.org/time@0.3.0.cto\r\n\r\nimport org.accordproject.contract@0.2.0.Clause from https://models.accordproject.org/accordproject/contract@0.2.0.cto\r\nimport org.accordproject.runtime@0.2.0.{Request,Response} from https://models.accordproject.org/accordproject/runtime@0.2.0.cto\r\n\r\n/**\r\n * Defines the data model for the LateDeliveryAndPenalty template.\r\n * This defines the structure of the abstract syntax tree that the parser for the template\r\n * must generate from input source text.\r\n */\r\n@template\r\nasset TemplateModel extends Clause {\r\n  /**\r\n   * Does the clause include a force majeure provision?\r\n   */\r\n  o Boolean forceMajeure\r\n\r\n  /**\r\n   * For every penaltyDuration that the goods are late\r\n   */\r\n  o Duration penaltyDuration\r\n\r\n  /**\r\n   * Seller pays the buyer penaltyPercentage % of the value of the goods\r\n   */\r\n  o Double penaltyPercentage\r\n\r\n  /**\r\n   * Up to capPercentage % of the value of the goods\r\n   */\r\n  o Double capPercentage\r\n\r\n  /**\r\n   * If the goods are >= termination late then the buyer may terminate the contract\r\n   */\r\n  o Duration termination\r\n\r\n  /**\r\n   * Fractional part of a ... is considered a whole ...\r\n   */\r\n  o TemporalUnit fractionalPart\r\n}\r\n\r\n/**\r\n * Defines the input data required by the template\r\n */\r\ntransaction LateDeliveryAndPenaltyRequest extends Request {\r\n\r\n  /**\r\n   * Are we in a force majeure situation?\r\n   */\r\n  o Boolean forceMajeure\r\n\r\n  /**\r\n   * What was the agreed delivery date for the goods?\r\n   */\r\n  o DateTime agreedDelivery\r\n\r\n  /**\r\n   * If the goods have been delivered, when where they delivered?\r\n   */\r\n  o DateTime deliveredAt optional\r\n\r\n  /**\r\n   * What is the value of the goods?\r\n   */\r\n  o Double goodsValue\r\n}\r\n\r\n/**\r\n * Defines the output data for the template\r\n */\r\ntransaction LateDeliveryAndPenaltyResponse extends Response {\r\n  /**\r\n   * The penalty to be paid by the seller\r\n   */\r\n  o Double penalty\r\n\r\n  /**\r\n   * Whether the buyer may terminate the contract\r\n   */\r\n  o Boolean buyerMayTerminate\r\n}"
			]
		}
	},
	"text": {
		"$class": "org.accordproject.protocol@1.0.0.Text",
		"templateText": "Late Delivery and Penalty – {{% return now.toLocaleString() %}}\r\n----\r\n\r\nIn case of delayed delivery{{#if forceMajeure}}, except for Force Majeure cases,{{/if}} the Seller shall pay to the Buyer for every _{{% return `${penaltyDuration.amount} ${penaltyDuration.unit}` %}} of delay_ ***Penalty*** amounting to {{penaltyPercentage}}% of the total value of the Equipment whose delivery has been delayed.\r\n\r\n1. Any fractional part of a {{fractionalPart}} is to be considered a full {{fractionalPart}}.\r\n1. The total amount of penalty shall not however, exceed {{capPercentage}}% of the total value of the Equipment involved in late delivery.\r\n1. If the delay is more than {{% return `${termination.amount} ${termination.unit}` %}}, the Buyer is entitled to terminate this Contract."
	},
	"logic": null,
	"sampleRequest": null
}
```

## Getting Resources

Getting templates using query parameters:

```
curl --request GET \
  --url 'http://localhost:9000/templates?author=dan' \
  --header 'Content-Type: application/json'
```

Response:

```json
{
	"items": [
{
			"id": 33,
			"uri": "resource:org.accordproject.protocol@1.0.0.Template#bazza",
			"author": "dan",
			"displayName": "Late Delivery and Penalty",
			"version": "1.0.0",
			"description": "This is late delivery and penalty template",
			"license": "Apache-2",
			"keywords": [
				"one",
				"two"
			],
			"metadata": {
				"$class": "org.accordproject.protocol@1.0.0.TemplateMetadata",
				"runtime": "typescript",
				"template": "clause",
				"cicero": "0.25.x"
			},
			"logo": null,
			"templateModel": {
				"$class": "org.accordproject.protocol@1.0.0.TemplateModel",
				"typeName": "foo",
				"model": {
					"$class": "org.accordproject.protocol@1.0.0.CtoModel",
					"ctoFiles": [
						{
							"$class": "org.accordproject.protocol@1.0.0.CtoFile",
							"contents": "namespace io.clause.latedeliveryandpenalty@0.1.0\r\n\r\nimport org.accordproject.time@0.3.0.{Duration, TemporalUnit} from https://models.accordproject.org/time@0.3.0.cto\r\n\r\nimport org.accordproject.contract@0.2.0.Clause from https://models.accordproject.org/accordproject/contract@0.2.0.cto\r\nimport org.accordproject.runtime@0.2.0.{Request,Response} from https://models.accordproject.org/accordproject/runtime@0.2.0.cto\r\n\r\n/**\r\n * Defines the data model for the LateDeliveryAndPenalty template.\r\n * This defines the structure of the abstract syntax tree that the parser for the template\r\n * must generate from input source text.\r\n */\r\n@template\r\nasset TemplateModel extends Clause {\r\n  /**\r\n   * Does the clause include a force majeure provision?\r\n   */\r\n  o Boolean forceMajeure\r\n\r\n  /**\r\n   * For every penaltyDuration that the goods are late\r\n   */\r\n  o Duration penaltyDuration\r\n\r\n  /**\r\n   * Seller pays the buyer penaltyPercentage % of the value of the goods\r\n   */\r\n  o Double penaltyPercentage\r\n\r\n  /**\r\n   * Up to capPercentage % of the value of the goods\r\n   */\r\n  o Double capPercentage\r\n\r\n  /**\r\n   * If the goods are >= termination late then the buyer may terminate the contract\r\n   */\r\n  o Duration termination\r\n\r\n  /**\r\n   * Fractional part of a ... is considered a whole ...\r\n   */\r\n  o TemporalUnit fractionalPart\r\n}\r\n\r\n/**\r\n * Defines the input data required by the template\r\n */\r\ntransaction LateDeliveryAndPenaltyRequest extends Request {\r\n\r\n  /**\r\n   * Are we in a force majeure situation?\r\n   */\r\n  o Boolean forceMajeure\r\n\r\n  /**\r\n   * What was the agreed delivery date for the goods?\r\n   */\r\n  o DateTime agreedDelivery\r\n\r\n  /**\r\n   * If the goods have been delivered, when where they delivered?\r\n   */\r\n  o DateTime deliveredAt optional\r\n\r\n  /**\r\n   * What is the value of the goods?\r\n   */\r\n  o Double goodsValue\r\n}\r\n\r\n/**\r\n * Defines the output data for the template\r\n */\r\ntransaction LateDeliveryAndPenaltyResponse extends Response {\r\n  /**\r\n   * The penalty to be paid by the seller\r\n   */\r\n  o Double penalty\r\n\r\n  /**\r\n   * Whether the buyer may terminate the contract\r\n   */\r\n  o Boolean buyerMayTerminate\r\n}",
							"filename": "test.cto"
						}
					]
				}
			},
			"text": {
				"$class": "org.accordproject.protocol@1.0.0.Text",
				"templateText": "Late Delivery and Penalty – {{% return now.toLocaleString() %}}\r\n----\r\n\r\nIn case of delayed delivery{{#if forceMajeure}}, except for Force Majeure cases,{{/if}} the Seller shall pay to the Buyer for every _{{% return `${penaltyDuration.amount} ${penaltyDuration.unit}` %}} of delay_ ***Penalty*** amounting to {{penaltyPercentage}}% of the total value of the Equipment whose delivery has been delayed.\r\n\r\n1. Any fractional part of a {{fractionalPart}} is to be considered a full {{fractionalPart}}.\r\n1. The total amount of penalty shall not however, exceed {{capPercentage}}% of the total value of the Equipment involved in late delivery.\r\n1. If the delay is more than {{% return `${termination.amount} ${termination.unit}` %}}, the Buyer is entitled to terminate this Contract."
			},
			"logic": null,
			"sampleRequest": null
		},
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
  --url http://localhost:9000/templates/31 \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/11.0.2' \
  --data '{
	"author": "matt"
}'
```

Response:

```json
{
	"id": 31,
	"uri": "resource:org.accordproject.protocol@1.0.0.Template#baz",
	"author": "matt",
	"displayName": "Late Delivery and Penalty",
	"version": "1.0.0",
	"description": "This is late delivery and penalty template",
	"license": "Apache-2",
	"keywords": [
		"one",
		"two"
	],
	"metadata": {
		"$class": "org.accordproject.protocol@1.0.0.TemplateMetadata",
		"runtime": "typescript",
		"template": "clause",
		"cicero": "0.25.x"
	},
	"logo": null,
	"templateModel": {
		"$class": "org.accordproject.protocol@1.0.0.TemplateModel",
		"typeName": "foo",
		"model": {
			"$class": "org.accordproject.protocol@1.0.0.CtoModel",
			"ctoFiles": [
				{
					"$class": "org.accordproject.protocol@1.0.0.CtoFile",
					"contents": "namespace io.clause.latedeliveryandpenalty@0.1.0\r\n\r\nimport org.accordproject.time@0.3.0.{Duration, TemporalUnit} from https://models.accordproject.org/time@0.3.0.cto\r\n\r\nimport org.accordproject.contract@0.2.0.Clause from https://models.accordproject.org/accordproject/contract@0.2.0.cto\r\nimport org.accordproject.runtime@0.2.0.{Request,Response} from https://models.accordproject.org/accordproject/runtime@0.2.0.cto\r\n\r\n/**\r\n * Defines the data model for the LateDeliveryAndPenalty template.\r\n * This defines the structure of the abstract syntax tree that the parser for the template\r\n * must generate from input source text.\r\n */\r\n@template\r\nasset TemplateModel extends Clause {\r\n  /**\r\n   * Does the clause include a force majeure provision?\r\n   */\r\n  o Boolean forceMajeure\r\n\r\n  /**\r\n   * For every penaltyDuration that the goods are late\r\n   */\r\n  o Duration penaltyDuration\r\n\r\n  /**\r\n   * Seller pays the buyer penaltyPercentage % of the value of the goods\r\n   */\r\n  o Double penaltyPercentage\r\n\r\n  /**\r\n   * Up to capPercentage % of the value of the goods\r\n   */\r\n  o Double capPercentage\r\n\r\n  /**\r\n   * If the goods are >= termination late then the buyer may terminate the contract\r\n   */\r\n  o Duration termination\r\n\r\n  /**\r\n   * Fractional part of a ... is considered a whole ...\r\n   */\r\n  o TemporalUnit fractionalPart\r\n}\r\n\r\n/**\r\n * Defines the input data required by the template\r\n */\r\ntransaction LateDeliveryAndPenaltyRequest extends Request {\r\n\r\n  /**\r\n   * Are we in a force majeure situation?\r\n   */\r\n  o Boolean forceMajeure\r\n\r\n  /**\r\n   * What was the agreed delivery date for the goods?\r\n   */\r\n  o DateTime agreedDelivery\r\n\r\n  /**\r\n   * If the goods have been delivered, when where they delivered?\r\n   */\r\n  o DateTime deliveredAt optional\r\n\r\n  /**\r\n   * What is the value of the goods?\r\n   */\r\n  o Double goodsValue\r\n}\r\n\r\n/**\r\n * Defines the output data for the template\r\n */\r\ntransaction LateDeliveryAndPenaltyResponse extends Response {\r\n  /**\r\n   * The penalty to be paid by the seller\r\n   */\r\n  o Double penalty\r\n\r\n  /**\r\n   * Whether the buyer may terminate the contract\r\n   */\r\n  o Boolean buyerMayTerminate\r\n}",
					"filename": "test.cto"
				}
			]
		}
	},
	"text": {
		"$class": "org.accordproject.protocol@1.0.0.Text",
		"templateText": "Late Delivery and Penalty – {{% return now.toLocaleString() %}}\r\n----\r\n\r\nIn case of delayed delivery{{#if forceMajeure}}, except for Force Majeure cases,{{/if}} the Seller shall pay to the Buyer for every _{{% return `${penaltyDuration.amount} ${penaltyDuration.unit}` %}} of delay_ ***Penalty*** amounting to {{penaltyPercentage}}% of the total value of the Equipment whose delivery has been delayed.\r\n\r\n1. Any fractional part of a {{fractionalPart}} is to be considered a full {{fractionalPart}}.\r\n1. The total amount of penalty shall not however, exceed {{capPercentage}}% of the total value of the Equipment involved in late delivery.\r\n1. If the delay is more than {{% return `${termination.amount} ${termination.unit}` %}}, the Buyer is entitled to terminate this Contract."
	},
	"logic": null,
	"sampleRequest": null
}```

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

## Creating an Agreement

```bash
curl --request POST \
  --url http://localhost:9000/agreements \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/11.0.2' \
  --data '{
	"uri": "apap://agreement2",
	"data": {
		"$class": "io.clause.latedeliveryandpenalty@0.1.0.TemplateModel",
		"forceMajeure": true,
		"penaltyDuration": {
			"$class": "org.accordproject.time@0.3.0.Duration",
			"amount": 2,
			"unit": "days"
		},
		"penaltyPercentage": 10.5,
		"capPercentage": 55,
		"termination": {
			"$class": "org.accordproject.time@0.3.0.Duration",
			"amount": 15,
			"unit": "days"
		},
		"fractionalPart": "days",
		"clauseId": "c88e5ed7-c3e0-4249-a99c-ce9278684ac8",
		"$identifier": "c88e5ed7-c3e0-4249-a99c-ce9278684ac8"
	},
	"template": "resource:org.accordproject.protocol@1.0.0.Template#dan2",
	"agreementStatus": "DRAFT"
}'
```

Response:

```
{
	"id": 4,
	"uri": "apap://agreement2",
	"data": {
		"$class": "io.clause.latedeliveryandpenalty@0.1.0.TemplateModel",
		"forceMajeure": true,
		"penaltyDuration": {
			"$class": "org.accordproject.time@0.3.0.Duration",
			"amount": 2,
			"unit": "days"
		},
		"penaltyPercentage": 10.5,
		"capPercentage": 55,
		"termination": {
			"$class": "org.accordproject.time@0.3.0.Duration",
			"amount": 15,
			"unit": "days"
		},
		"fractionalPart": "days",
		"clauseId": "c88e5ed7-c3e0-4249-a99c-ce9278684ac8",
		"$identifier": "c88e5ed7-c3e0-4249-a99c-ce9278684ac8"
	},
	"template": "resource:org.accordproject.protocol@1.0.0.Template#dan2",
	"state": null,
	"agreementStatus": "DRAFT",
	"agreementParties": null,
	"signatures": null,
	"historyEntries": null,
	"attachments": null,
	"references": null,
	"metadata": null
}
```

## Converting an agreement to HTML

```bash
curl --request GET \
  --url http://localhost:9000/agreements/1/convert/html \
  --header 'Content-Type: application/json'
```

Reponse:

```
<html>
<head><meta charset="UTF-8"></head>
<body>
<div class="document">
<div class="clause" name="top" elementType="io.clause.latedeliveryandpenalty@0.1.0.TemplateModel">
<h2>Late Delivery and Penalty – Sat, 03 May 2025 08:09:25 GMT</h2>
<p>In case of delayed delivery<span class="conditional" name="forceMajeure" whenTrue=", except for Force Majeure cases," whenFalse="">, except for Force Majeure cases,</span> the Seller shall pay to the Buyer for every <em>2 days of delay</em> <em><strong>Penalty</strong></em> amounting to 10.5% of the total value of the Equipment whose delivery has been delayed.</p>

<ol delimiter=period start=1 tight=true>
<li><p>Any fractional part of a <span class="variable" name="fractionalPart" enumValues="%5B%22seconds%22%2C%22minutes%22%2C%22hours%22%2C%22days%22%2C%22weeks%22%5D" elementType="org.accordproject.time@0.3.0.TemporalUnit">days</span> is to be considered a full <span class="variable" name="fractionalPart" enumValues="%5B%22seconds%22%2C%22minutes%22%2C%22hours%22%2C%22days%22%2C%22weeks%22%5D" elementType="org.accordproject.time@0.3.0.TemporalUnit">days</span>.</p>
</li>
<li><p>The total amount of penalty shall not however, exceed 55.0% of the total value of the Equipment involved in late delivery.</p>
</li>
<li><p>If the delay is more than 15 days, the Buyer is entitled to terminate this Contract.</p>
</li></ol></div>
</div>
</body>
</html>
```

## Trigger an Agreement

### Create a Template with Logic

The logic for the template is from the sample: https://github.com/accordproject/demo-template/tree/main/archives/latedeliveryandpenalty-typescript

Note that you must JSON encode the logic before posting it.

```
curl --request POST \
  --url http://localhost:9000/templates \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/11.0.2' \
  --data '{
	"uri": "resource:org.accordproject.protocol@1.0.0.Template#logic3",
	"author": "dan",
	"displayName": "Late Delivery and Penalty",
	"version": "1.0.0",
	"description": "This is late delivery and penalty template",
	"license": "Apache-2",
	"keywords": [
		"one",
		"two"
	],
	"metadata": {
		"$class": "org.accordproject.protocol@1.0.0.TemplateMetadata",
		"runtime": "typescript",
		"template": "clause",
		"cicero": "0.25.x"
	},
	"logo": null,
	"templateModel": {
		"$class": "org.accordproject.protocol@1.0.0.TemplateModel",
		"typeName": "foo",
		"model": {
			"$class": "org.accordproject.protocol@1.0.0.CtoModel",
			"ctoFiles": [ {
				"contents" :
				"namespace io.clause.latedeliveryandpenalty@0.1.0\r\n\r\nimport org.accordproject.time@0.3.0.{Duration, TemporalUnit} from https://models.accordproject.org/time@0.3.0.cto\r\n\r\nimport org.accordproject.contract@0.2.0.Clause from https://models.accordproject.org/accordproject/contract@0.2.0.cto\r\nimport org.accordproject.runtime@0.2.0.{Request,Response} from https://models.accordproject.org/accordproject/runtime@0.2.0.cto\r\n\r\n/**\r\n * Defines the data model for the LateDeliveryAndPenalty template.\r\n * This defines the structure of the abstract syntax tree that the parser for the template\r\n * must generate from input source text.\r\n */\r\n@template\r\nasset TemplateModel extends Clause {\r\n  /**\r\n   * Does the clause include a force majeure provision?\r\n   */\r\n  o Boolean forceMajeure\r\n\r\n  /**\r\n   * For every penaltyDuration that the goods are late\r\n   */\r\n  o Duration penaltyDuration\r\n\r\n  /**\r\n   * Seller pays the buyer penaltyPercentage % of the value of the goods\r\n   */\r\n  o Double penaltyPercentage\r\n\r\n  /**\r\n   * Up to capPercentage % of the value of the goods\r\n   */\r\n  o Double capPercentage\r\n\r\n  /**\r\n   * If the goods are >= termination late then the buyer may terminate the contract\r\n   */\r\n  o Duration termination\r\n\r\n  /**\r\n   * Fractional part of a ... is considered a whole ...\r\n   */\r\n  o TemporalUnit fractionalPart\r\n}\r\n\r\n/**\r\n * Defines the input data required by the template\r\n */\r\ntransaction LateDeliveryAndPenaltyRequest extends Request {\r\n\r\n  /**\r\n   * Are we in a force majeure situation?\r\n   */\r\n  o Boolean forceMajeure\r\n\r\n  /**\r\n   * What was the agreed delivery date for the goods?\r\n   */\r\n  o DateTime agreedDelivery\r\n\r\n  /**\r\n   * If the goods have been delivered, when where they delivered?\r\n   */\r\n  o DateTime deliveredAt optional\r\n\r\n  /**\r\n   * What is the value of the goods?\r\n   */\r\n  o Double goodsValue\r\n}\r\n\r\n/**\r\n * Defines the output data for the template\r\n */\r\ntransaction LateDeliveryAndPenaltyResponse extends Response {\r\n  /**\r\n   * The penalty to be paid by the seller\r\n   */\r\n  o Double penalty\r\n\r\n  /**\r\n   * Whether the buyer may terminate the contract\r\n   */\r\n  o Boolean buyerMayTerminate\r\n}",
				"filename" : "test.cto"
			}
			]
		}
	},
	"text": {
		"$class": "org.accordproject.protocol@1.0.0.Text",
		"templateText": "Late Delivery and Penalty – {{% return now.toLocaleString() %}}\r\n----\r\n\r\nIn case of delayed delivery{{#if forceMajeure}}, except for Force Majeure cases,{{/if}} the Seller shall pay to the Buyer for every _{{% return `${penaltyDuration.amount} ${penaltyDuration.unit}` %}} of delay_ ***Penalty*** amounting to {{penaltyPercentage}}% of the total value of the Equipment whose delivery has been delayed.\r\n\r\n1. Any fractional part of a {{fractionalPart}} is to be considered a full {{fractionalPart}}.\r\n1. The total amount of penalty shall not however, exceed {{capPercentage}}% of the total value of the Equipment involved in late delivery.\r\n1. If the delay is more than {{% return `${termination.amount} ${termination.unit}` %}}, the Buyer is entitled to terminate this Contract."
	},
	"logic": {
		"$class": "org.accordproject.protocol@1.0.0.Logic",
		"codes" : [
			{
						"$class": "org.accordproject.protocol@1.0.0.Code",
				"id" : "logic.ts",
				"type" : "TYPESCRIPT",
				"encoding" : "PLAIN_TEXT",
				"value" : "import { ILateDeliveryAndPenaltyRequest, ILateDeliveryAndPenaltyResponse, ITemplateModel } from \".\/generated\/io.clause.latedeliveryandpenalty@0.1.0\";\r\n\r\n\/\/ demo utility function\r\nfunction calc(input: number) : number {\r\n    const result = input * 2.5;\r\n    return result;\r\n}\r\n\r\ntype LateDeliveryContractResponse = {\r\n    result: ILateDeliveryAndPenaltyResponse;\r\n}\r\n\r\n\/\/ sample contract logic that is stateless\r\n\/\/ - no init method\r\n\/\/ @ts-ignore\r\nclass LateDeliveryLogic extends TemplateLogic<ITemplateModel>  {\r\n    async trigger(data: ITemplateModel, request:ILateDeliveryAndPenaltyRequest) : Promise<LateDeliveryContractResponse> {\r\n        return {\r\n            result: {\r\n                penalty: data.penaltyPercentage * calc(request.goodsValue),\r\n                buyerMayTerminate: true,\r\n                $timestamp: new Date(),\r\n                $class: '\''io.clause.latedeliveryandpenalty@0.1.0.LateDeliveryAndPenaltyResponse'\''\r\n            }\r\n        }\r\n    }\r\n}\r\n\r\nexport default LateDeliveryLogic;\r\n"
			}
		]
	},
	"sampleRequest": null
}'
```

### Create an Agreement that uses the Template

```
curl --request POST \
  --url http://localhost:9000/agreements \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/11.0.2' \
  --data '{
	"uri": "apap://agreement-logic4",
	"data": {
		"$class": "io.clause.latedeliveryandpenalty@0.1.0.TemplateModel",
		"forceMajeure": true,
		"penaltyDuration": {
			"$class": "org.accordproject.time@0.3.0.Duration",
			"amount": 2,
			"unit": "days"
		},
		"penaltyPercentage": 10.5,
		"capPercentage": 55,
		"termination": {
			"$class": "org.accordproject.time@0.3.0.Duration",
			"amount": 15,
			"unit": "days"
		},
		"fractionalPart": "days",
		"clauseId": "c88e5ed7-c3e0-4249-a99c-ce9278684ac8",
		"$identifier": "c88e5ed7-c3e0-4249-a99c-ce9278684ac8"
	},
	"template": "resource:org.accordproject.protocol@1.0.0.Template#logic3",
	"agreementStatus": "DRAFT"
}'
```

### Trigger the agreement

```
curl --request GET \
  --url http://localhost:9000/agreements/8/trigger \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/11.0.2' \
  --data '{
	"goodsValue" : 140
}'
```

Response:

```
{
	"result": {
		"penalty": 3675,
		"buyerMayTerminate": true,
		"$timestamp": "2025-07-08T21:42:52.719Z",
		"$class": "io.clause.latedeliveryandpenalty@0.1.0.LateDeliveryAndPenaltyResponse"
	}
}
```


# Model Context Protocol (MCP) Support (experimental)

RI has **experimental** MCP support. We will be adding new resources and tools and the format of existing resources and tools may change.

To configure the location of the APAP server set the `API_BASE_URL` environment variable (defaults to http://localhost:9000).

To connect RI to Claude, follow the following steps:
1. Start RI
2. Open your user profile settings in Claude (a paid Max plan is currently required)
3. Add a new custom Integration, with integration name APAP and the integration URL set to the URL of your RI server plus `/sse`. Note that your RI server must be reachable from the Internet, so if you are running locally you will need
to run ngrok (or similar) to tunnel Internet traffic.
4. Sign-up for a new account in the login/authentication window
5. Once connected you should see "1 tool, 2 resources" printed beneath the integration name in Claude settings
6. Press the + button to start a new chat
7. Press the + button inside the chat and select "Add from APAP", selecting either templates or agreements to be added to the chat context.
8. Ask questions about your templates or agreements
9. Type, "convert agreement X to markdown" to convert a loaded agreement to markdown
10. Type "trigger agreement X with goods value 100" to trigger an agreement

To connect RI to MCP Inspector, follow the following steps:
1. Start RI
2. install and run the MCP Inspector debugging tool
```bash
npx @modelcontextprotocol/inspector
```
3. Open a http://127.0.0.1:6274 (this is the default MCP Inspector address and port)
4. Select SSE from the Transport Type dropdown
5. replace the url with http://localhost:9000/sse (the default RI port)
6. click Connect
7. explore the available Resources, Prompts, Tools & Resource templates

# Updating RI When Protocol Changes

When the protocol (model) changes we need to regenerate the Drizzle ORM code (under `./db/schema.ts`) that is used for persistence and then push the modified database schema to
the Postgres database.

```
npm run drizzle-gen
npx drizzle-kit push
```
