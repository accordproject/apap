import "source-map-support/register";
import OpenAPIBackend, { Request } from "openapi-backend";
import Express from "express";
import morgan from "morgan";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import { Request as ExpressReq, Response as ExpressRes } from "express";

const app = Express();
app.use(Express.json());

const openApiPath = path.join(__dirname, "..", "..", "openapi.json");
console.log(openApiPath);

const templates: Record<string, any> = {};

// define api
const api = new OpenAPIBackend({
  quick: true, // disabled validation of OpenAPI on load
  definition: openApiPath,
  handlers: {
    createTemplate: async (c, req: Express.Request, res: Express.Response) => {
      const { $class, name, ...otherData } = req.body;

      if (!$class) {
        return res
          .status(400)
          .json({ error: "Missing required property: $class" });
      }

      const id = uuidv4();

      const newTemplate = { id, $class, name, ...otherData };
      templates[id] = newTemplate;

      return res
        .status(201)
        .header("Location", `/templates/${id}`)
        .json({ id });
    },

    getTemplate: async (c, req: Express.Request, res: Express.Response) => {
      const { id } = req.params;

      const template = templates[id];

      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      res.json(template);
    },

    listTemplates: async (c, req: Express.Request, res: Express.Response) =>
      res.status(200).json(Object.values(templates)),

    deleteTemplate: async (c, req: Express.Request, res: Express.Response) => {
      const { id } = req.params;

      if (!templates[id]) {
        return res.status(404).json({ error: "Template not found" });
      }

      delete templates[id];
      res.status(204).send();
    },

    replaceTemplate: async (c, req: Express.Request, res: Express.Response) =>
      res.status(200).json({}),

    validationFail: async (c, req: ExpressReq, res: ExpressRes) =>
      res.status(400).json({ err: c.validation.errors }),
    notFound: async (c, req: ExpressReq, res: ExpressRes) =>
      res.status(404).json({ err: "not found" }),
    notImplemented: async (c, req: ExpressReq, res: ExpressRes) => {
      const { status, mock } = c.api.mockResponseForOperation(
        c.operation.operationId
      );
      return res.status(status).json(mock);
    },
  },
});

api.init();

// logging
app.use(morgan("combined"));

// use as express middleware
app.use((req, res) => api.handleRequest(req as Request, req, res));

// start server
app.listen(9000, () => console.info("api listening at http://localhost:9000"));
