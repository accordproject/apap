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
  --url http://localhost:9000/templates/8 \
  --header 'Content-Type: application/json'
```

Response:

```json
{
	"id": 18,
	"uri": "resource:org.accordproject.protocol@1.0.0.Template#dan2",
	"author": "dan",
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
			"id": 18,
			"uri": "resource:org.accordproject.protocol@1.0.0.Template#dan2",
			"author": "dan",
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
		},
		{
			"id": 19,
			"uri": "apap://dan3",
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
		},
		{
			"id": 21,
			"uri": "apap://dan4",
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
		},
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
	],
	"total": 4,
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
  --url http://localhost:9000/templates/18 \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/11.0.2' \
  --data '{
	"author": "matt"
}'
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
