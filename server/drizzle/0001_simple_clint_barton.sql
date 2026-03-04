ALTER TABLE "Agreement" ADD COLUMN "template_hash" varchar(64);--> statement-breakpoint
ALTER TABLE "Template" ADD COLUMN "hash" varchar(64);--> statement-breakpoint
ALTER TABLE "Template" ADD CONSTRAINT "Template_hash_unique" UNIQUE("hash");