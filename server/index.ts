import "source-map-support/register";
import { ModelManager } from "@accordproject/concerto-core";
import OpenAPIBackend, { Request } from "openapi-backend";
import Express from "express";
import morgan from "morgan";
import path from "path";

import { Request as ExpressReq, Response as ExpressRes } from "express";

const app = Express();
app.use(Express.json());

const modelManager = new ModelManager();

const openApiPath = path.join(__dirname, "..", "..", "openapi.json");
console.log(openApiPath);

// define api
const api = new OpenAPIBackend({
  quick: true, // disabled validation of OpenAPI on load
  definition: openApiPath,
  handlers: {
    listTemplates: async (c, req: Express.Request, res: Express.Response) =>
      res.status(200).json([]),
    createTemplate: async (c, req: Express.Request, res: Express.Response) => {
      const template = req.body;
      try {
        if (template.templateModel?.cto) {
          const ctoString = template.templateModel.cto;
          // Add the CTO string to ModelManager
          modelManager.addModel(ctoString, "org.example.cto"); // Optional filename
          // Get the AST directly from ModelManager
          const ast = modelManager.getAst();
          template.templateModel.model = ast;
          console.log("Parsed model:", template.templateModel.model);
        }
        res.status(201).json(template);
      } catch (err) {
        res.status(400).json({ err: `Failed to parse CTO: ${err.message}` });
      }
    },
    getTemplate: async (c, req: Express.Request, res: Express.Response) =>
      res.status(200).json({}),
    replaceTemplate: async (c, req: Express.Request, res: Express.Response) => {
      const template = req.body;
      try {
        if (template.templateModel?.cto) {
          const ctoString = template.templateModel.cto;
          modelManager.addModel(ctoString);
          template.templateModel.model = modelManager.getModels()[0];
        }
        res.status(202).json(template);
      } catch (err) {
        res.status(400).json({ err: `Failed to parse CTO: ${err.message}` });
      }
    },
    deleteTemplate: async (c, req: Express.Request, res: Express.Response) =>
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
