import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Construct database URL
const dbUrl =
  process.env.POSTGRES_URL ||
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`;

// Initialize database client
const queryClient = postgres(dbUrl);
export const db = drizzle({
  client: queryClient,
  casing: 'snake_case',
});

console.log('Initialized database connection');
