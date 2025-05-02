import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  casing: 'snake_case',
  dialect: 'postgresql',
  dbCredentials: process.env.POSTGRES_URL ? {
    url: process.env.POSTGRES_URL!,
  } : {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    ssl: false,
  },
});