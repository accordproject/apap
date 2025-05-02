ALTER TYPE "public"."FeatureType" ADD VALUE 'TEMPLATE_MANAGE' BEFORE 'TEMPLATE_VERIFY_SIGNATURES';--> statement-breakpoint
ALTER TABLE "Agreement" ALTER COLUMN "state" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "Template" ALTER COLUMN "sample_request" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "Agreement" ADD COLUMN "uri" text NOT NULL;--> statement-breakpoint
ALTER TABLE "SharedModel" ADD COLUMN "uri" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Template" ADD COLUMN "uri" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_uri_unique" UNIQUE("uri");--> statement-breakpoint
ALTER TABLE "SharedModel" ADD CONSTRAINT "SharedModel_uri_unique" UNIQUE("uri");--> statement-breakpoint
ALTER TABLE "Template" ADD CONSTRAINT "Template_uri_unique" UNIQUE("uri");