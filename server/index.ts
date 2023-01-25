import 'source-map-support/register';
import OpenAPIBackend, { Request } from 'openapi-backend';
import Express from 'express';
import morgan from 'morgan'
import path from 'path';

import { Request as ExpressReq, Response as ExpressRes } from 'express';

const app = Express();
app.use(Express.json());

const openApiPath = path.join(__dirname, '..', '..', 'openapi.json');
console.log(openApiPath);

// define api
const api = new OpenAPIBackend({
  quick: true, // disabled validation
  definition: openApiPath,
  handlers: {
    validationFail: async (c, req: ExpressReq, res: ExpressRes) => res.status(400).json({ err: c.validation.errors }),
    notFound: async (c, req: ExpressReq, res: ExpressRes) => res.status(404).json({ err: 'not found' }),
    notImplemented: async (c, req: ExpressReq, res: ExpressRes) => {
      const { status, mock } = c.api.mockResponseForOperation(c.operation.operationId);
      return res.status(status).json(mock);
    },
  },
});

api.init();

// logging
app.use(morgan('combined'));

// use as express middleware
app.use((req, res) => api.handleRequest(req as Request, req, res));

// start server
app.listen(9000, () => console.info('api listening at http://localhost:9000'));