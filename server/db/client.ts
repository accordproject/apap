import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

// The RI wires the shared Drizzle handle onto `res.locals.db` at request time
// (see server/index.ts). Services take this typed handle as their first arg so
// they stay transport-agnostic — the MCP handler and REST routes can both call
// the same service function without going through an internal HTTP loop.
export type Database = PostgresJsDatabase<typeof schema>;
