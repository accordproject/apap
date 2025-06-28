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
import templatesRouter from  './handlers/templates';
import agreementsRouter from './handlers/agreements';
import sharedModelsRouter from './handlers/sharedmodels';
import capabilitiesRouter from './handlers/capabilities';
import mcpRouter from './handlers/mcp';
import authRouter from './handlers/auth';

const app = Express();
app.use(Express.json());

// Database middleware
app.use((req, res, next) => {
  try {
    console.log('Connecting to database with configuration:');
    console.log(`POSTGRES_URL: ${process.env.POSTGRES_URL}`);
    console.log(`POSTGRES_USER: ${process.env.POSTGRES_USER}`);
    console.log(`POSTGRES_PASSWORD: ${process.env.POSTGRES_PASSWORD}`);
    console.log(`POSTGRES_HOST: ${process.env.POSTGRES_HOST}`);
    console.log(`POSTGRES_PORT: ${process.env.POSTGRES_PORT}`);
    console.log(`POSTGRES_DATABASE: ${process.env.POSTGRES_DATABASE}`);

    const dbUrl = process.env.POSTGRES_URL
      ? process.env.POSTGRES_URL
      : `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`;

    console.log(`URL: ${dbUrl}`);

    const queryClient = postgres(dbUrl);
    const db = drizzle({
      client: queryClient,
      casing: 'snake_case',
    });
    res.locals.db = db;
    console.log('Setup database driver.');
  } catch (err) {
    console.log(`Failed to setup database driver: ${err}`);
  }
  next();
});

app.use('/templates', templatesRouter);
app.use('/agreements', agreementsRouter);
app.use('/sharedmodels', sharedModelsRouter);
app.use('/capabilities', capabilitiesRouter);
app.use('/', mcpRouter);
app.use('/', authRouter);

// app.oauth = new OAuthServer({
//     model: {}, // See https://github.com/oauthjs/node-oauth2-server for specification
//   });

// app.use(app.oauth.authorize());

// const openApiPath = path.join(__dirname, '..', '..', 'openapi.json');
// console.log(openApiPath);

// // define api
// const api = new OpenAPIBackend({
//     quick: true, // disabled validation of OpenAPI on load
//     definition: openApiPath,
//     handlers: {
//         validationFail: async (c: Context, req: ExpressReq, res: ExpressRes) => res.status(400).json({ err: c.validation.errors }),
//         notFound: async (c: Context, req: ExpressReq, res: ExpressRes) => res.status(404).json({ err: 'not found' }),
//         notImplemented: async (c: Context, req: ExpressReq, res: ExpressRes) => {
//             const { status, mock } = c.api.mockResponseForOperation(c.operation.operationId);
//             return res.status(status).json(mock);
//         },
//     },
// });

// api.init();

// logging
app.use(morgan('combined'));

// use as express middleware
// app.use((req: Express.Request, res: Express.Response) => api.handleRequest(req as Request, req, res));

// app.get('/', function (req, res) {
//     res.json({ status: 'running' });
// });

const HOST = process.env.HOST || 'localhost';
const PORT = parseInt(process.env.PORT || '9000', 10);

// start REST server
app.listen(PORT, HOST, () => {
  console.info(`API listening at http://${HOST}:${PORT}`);
});
