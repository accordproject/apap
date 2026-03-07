import 'source-map-support/register';
import Express from 'express';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import OAuthServer from 'express-oauth-server';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// load HTTP route handlers
import templatesRouter from './handlers/templates';
import agreementsRouter from './handlers/agreements';
import sharedModelsRouter from './handlers/sharedmodels';
import capabilitiesRouter from './handlers/capabilities';
import mcpRouter from './handlers/mcp';
import authRouter from './handlers/auth';

const app = Express();
app.use(Express.json());

// Database middleware
const requiredPostgresEnvVars = [
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_DATABASE',
];

let dbUrl: string;

if (process.env.POSTGRES_URL) {
  dbUrl = process.env.POSTGRES_URL;
} else {
  const missingVars = requiredPostgresEnvVars.filter((name) => !process.env[name]);
  if (missingVars.length > 0) {
    throw new Error(
      `PostgreSQL configuration error: missing required environment variable(s): ${missingVars.join(
        ', ',
      )}. Either set POSTGRES_URL, or provide all of: ${requiredPostgresEnvVars.join(', ')}.`,
    );
  }
  dbUrl = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}` +
    `@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`;
}

// create one shared postgres-js client
const queryClient = postgres(dbUrl);
const db = drizzle({
  client: queryClient,
  casing: 'snake_case',
});

app.use((req, res, next) => {
  res.locals.db = db;
  next();
});

app.use('/templates', templatesRouter);
app.use('/agreements', agreementsRouter);
app.use('/sharedmodels', sharedModelsRouter);
app.use('/capabilities', capabilitiesRouter);
app.use('/', mcpRouter);
app.use('/', authRouter);

// logging
app.use(morgan('combined'));

const HOST = process.env.HOST || 'localhost';
const PORT = parseInt(process.env.PORT || '9000', 10);
const server = app.listen(PORT, HOST, () => {
  console.info(`API listening at http://${HOST}:${PORT}`);
});


const shutdown = async () => {
  console.info('Shutting down server...');
  server.close(() => console.info('HTTP server closed.'));
  try {
    await queryClient.end({ timeout: 5000 }); // closes pool connections
    console.info('Postgres client closed.');
  } catch (err) {
    console.error('Error closing Postgres client', err);
  }
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);