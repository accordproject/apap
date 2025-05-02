
// GENERATED CODE, DO NOT MODIFY
import {
    text,
    uuid,
    serial,
    integer,
    pgTable,
    pgEnum,
    varchar,
    json,
    boolean,
    timestamp,
    uniqueIndex,
    } from 'drizzle-orm/pg-core';
import { PgTable } from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod';

// **** SharedModel ***
export const SharedModel = pgTable("SharedModel", {
   id: serial().primaryKey(),
   uri: text().unique().notNull(),
   model: json().notNull(),
});
export const SharedModelSelectSchema = createSelectSchema(SharedModel);
export const SharedModelInsertSchema = createInsertSchema(SharedModel);
export const SharedModelUpdateSchema = createUpdateSchema(SharedModel);

export const CodeType = pgEnum('CodeType', ['ES2015',
'WASM_BYTES',
'TYPESCRIPT']);
export const CodeEncodingType = pgEnum('CodeEncodingType', ['PLAIN_TEXT',
'BASE64']);

// **** Template ***
export const Template = pgTable("Template", {
   id: serial().primaryKey(),
   uri: text().unique().notNull(),
   author: text().notNull(),
   displayName: text(),
   version: text().notNull(),
   description: text(),
   license: text().notNull(),
   keywords: text().array(),
   metadata: json().notNull(),
   logo: json(),
   templateModel: json().notNull(),
   text: json().notNull(),
   logic: json(),
   sampleRequest: json().notNull(),
});
export const TemplateSelectSchema = createSelectSchema(Template);
export const TemplateInsertSchema = createInsertSchema(Template);
export const TemplateUpdateSchema = createUpdateSchema(Template);

export const AgreementStatusType = pgEnum('AgreementStatusType', ['DRAFT',
'SIGNNG',
'COMPLETED',
'SUPERSEDED']);

// **** Agreement ***
export const Agreement = pgTable("Agreement", {
   id: serial().primaryKey(),
   uri: text().unique().notNull(),
   data: json().notNull(),
   state: json().notNull(),
   template: text(),
   agreementParties: json().array().notNull(),
   signatures: json().array().notNull(),
   agreementStatus: AgreementStatusType().notNull(),
   historyEntries: json().array().notNull(),
   attachments: json().array().notNull(),
   references: text().array().notNull(),
   metadata: json().notNull(),
});
export const AgreementSelectSchema = createSelectSchema(Agreement);
export const AgreementInsertSchema = createInsertSchema(Agreement);
export const AgreementUpdateSchema = createUpdateSchema(Agreement);

export const FeatureType = pgEnum('FeatureType', ['TEMPLATE_MANAGE',
'TEMPLATE_VERIFY_SIGNATURES',
'TEMPLATE_LOGIC',
'TEMPLATE_STATEFUL',
'LOGIC_WASM',
'LOGIC_ES2015',
'LOGIC_TYPESCRIPT',
'AGREEMENT_MANAGE',
'AGREEMENT_TRIGGER',
'AGREEMENT_STATE',
'AGREEMENT_DRAFT',
'AGREEMENT_SIGNING',
'SHARED_MODEL_MANAGE']);
