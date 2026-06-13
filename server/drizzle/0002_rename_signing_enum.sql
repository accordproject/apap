-- Rename the misspelled enum value SIGNNG -> SIGNING in AgreementStatusType.
-- RENAME VALUE is atomic and auto-updates every row that holds the old value
-- (Postgres >= 10), so no separate UPDATE is needed.
ALTER TYPE "public"."AgreementStatusType" RENAME VALUE 'SIGNNG' TO 'SIGNING';
