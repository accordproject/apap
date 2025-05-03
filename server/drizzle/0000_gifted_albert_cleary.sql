CREATE TYPE "public"."AgreementStatusType" AS ENUM('DRAFT', 'SIGNNG', 'COMPLETED', 'SUPERSEDED');--> statement-breakpoint
CREATE TYPE "public"."CodeEncodingType" AS ENUM('PLAIN_TEXT', 'BASE64');--> statement-breakpoint
CREATE TYPE "public"."CodeType" AS ENUM('ES2015', 'WASM_BYTES', 'TYPESCRIPT');--> statement-breakpoint
CREATE TYPE "public"."FeatureType" AS ENUM('TEMPLATE_MANAGE', 'TEMPLATE_VERIFY_SIGNATURES', 'TEMPLATE_LOGIC', 'TEMPLATE_STATEFUL', 'LOGIC_WASM', 'LOGIC_ES2015', 'LOGIC_TYPESCRIPT', 'AGREEMENT_MANAGE', 'AGREEMENT_TRIGGER', 'AGREEMENT_STATE', 'AGREEMENT_CONVERT_HTML', 'AGREEMENT_SIGNING', 'SHARED_MODEL_MANAGE');--> statement-breakpoint
CREATE TABLE "Agreement" (
	"id" serial PRIMARY KEY NOT NULL,
	"uri" text NOT NULL,
	"data" json NOT NULL,
	"template" text,
	"state" json,
	"agreement_status" "AgreementStatusType" NOT NULL,
	"agreement_parties" json[],
	"signatures" json[],
	"history_entries" json[],
	"attachments" json[],
	"references" text[],
	"metadata" json,
	CONSTRAINT "Agreement_uri_unique" UNIQUE("uri")
);
--> statement-breakpoint
CREATE TABLE "SharedModel" (
	"id" serial PRIMARY KEY NOT NULL,
	"uri" text NOT NULL,
	"model" json NOT NULL,
	CONSTRAINT "SharedModel_uri_unique" UNIQUE("uri")
);
--> statement-breakpoint
CREATE TABLE "Template" (
	"id" serial PRIMARY KEY NOT NULL,
	"uri" text NOT NULL,
	"author" text NOT NULL,
	"display_name" text,
	"version" text NOT NULL,
	"description" text,
	"license" text NOT NULL,
	"keywords" text[],
	"metadata" json NOT NULL,
	"logo" json,
	"template_model" json NOT NULL,
	"text" json NOT NULL,
	"logic" json,
	"sample_request" json,
	CONSTRAINT "Template_uri_unique" UNIQUE("uri")
);
