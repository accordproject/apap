CREATE TYPE "public"."AgreementStatusType" AS ENUM('DRAFT', 'SIGNNG', 'COMPLETED', 'SUPERSEDED');--> statement-breakpoint
CREATE TYPE "public"."CodeEncodingType" AS ENUM('PLAIN_TEXT', 'BASE64');--> statement-breakpoint
CREATE TYPE "public"."CodeType" AS ENUM('ES2015', 'WASM_BYTES', 'TYPESCRIPT');--> statement-breakpoint
CREATE TYPE "public"."FeatureType" AS ENUM('TEMPLATE_VERIFY_SIGNATURES', 'TEMPLATE_LOGIC', 'TEMPLATE_STATEFUL', 'LOGIC_WASM', 'LOGIC_ES2015', 'LOGIC_TYPESCRIPT', 'AGREEMENT_MANAGE', 'AGREEMENT_TRIGGER', 'AGREEMENT_STATE', 'AGREEMENT_DRAFT', 'AGREEMENT_SIGNING', 'SHARED_MODEL_MANAGE');--> statement-breakpoint
CREATE TABLE "Agreement" (
	"id" serial PRIMARY KEY NOT NULL,
	"data" json NOT NULL,
	"state" json NOT NULL,
	"template" text,
	"agreement_parties" json[] NOT NULL,
	"signatures" json[] NOT NULL,
	"agreement_status" "AgreementStatusType" NOT NULL,
	"history_entries" json[] NOT NULL,
	"attachments" json[] NOT NULL,
	"references" text[] NOT NULL,
	"metadata" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SharedModel" (
	"id" serial PRIMARY KEY NOT NULL,
	"model" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Template" (
	"metadata" json NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"author" text NOT NULL,
	"display_name" text,
	"version" text NOT NULL,
	"description" text,
	"license" text NOT NULL,
	"keywords" text[],
	"logo" json,
	"template_model" json NOT NULL,
	"text" json NOT NULL,
	"logic" json,
	"sample_request" json NOT NULL
);
