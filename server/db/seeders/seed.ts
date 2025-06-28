
import { db } from '../index';
import { sql } from 'drizzle-orm';

async function seed() {
  await db.execute(sql`DELETE FROM "Template"`);
  await db.execute(sql`
      INSERT INTO "Template" (
        uri, author, display_name, version, description, license, keywords,
        metadata, template_model, text, logic, sample_request
      ) VALUES (
        'urn:test:1', 'Test Author', 'Test Template', '1.0.0', 'Test template', 'MIT',
        ARRAY['contract', 'legal'], '{}', '{}', '{}', NULL, NULL
      ), (
        'urn:test:2', 'Test Author', 'Test Template 2', '1.0.0', 'Test template', 'MIT',
        ARRAY['invoice', 'finance'], '{}', '{}', '{}', NULL, NULL
      )
    `);
  console.log('Seeded database');
}

seed().catch(console.error);
