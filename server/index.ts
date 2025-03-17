
import "source-map-support/register";
import { ModelManager } from "@accordproject/concerto-core";
import OpenAPIBackend, { Request, Context } from "openapi-backend";


import Express from "express";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "..", ".env") });


import { Request as ExpressReq, Response as ExpressRes } from "express";

const app = Express();
app.use(Express.json());

const openApiPath = path.join(__dirname, "..", "..", "openapi.json");
console.log(openApiPath);

export const createTemplate = async (
  c: Context,
  req: Express.Request,
  res: ExpressRes
) => {
  const template = req.body;
  const modelManager = new ModelManager();
  try {
    if (template.templateModel?.cto) {
      const ctoString = template.templateModel.cto;
      modelManager.addModel(ctoString, "org.example.cto");
      const ast = modelManager.getAst();
      template.templateModel.model = ast.models[0];
      console.log("Parsed model:", template.templateModel.model);
    }
    res.status(201).json(template);
  } catch (err) {
    res.status(400).json({ err: `Failed to parse CTO: ${err.message}` });
  }
};

const api = new OpenAPIBackend({
  quick: true,
  definition: openApiPath,
  handlers: {
    listTemplates: async (c: Context, req: Express.Request, res: ExpressRes) =>
      res.status(200).json([]),
    createTemplate,
    getTemplate: async (c: Context, req: Express.Request, res: ExpressRes) =>
      res.status(200).json({}),
    replaceTemplate: async (
      c: Context,
      req: Express.Request,
      res: ExpressRes
    ) => {
      const template = req.body;
      try {
        if (template.templateModel?.cto) {
          const ctoString = template.templateModel.cto;
          const modelManager = new ModelManager();
          modelManager.addModel(ctoString);
          template.templateModel.model = modelManager.getModels()[0];
        }
        res.status(202).json(template);
      } catch (err) {
        res.status(400).json({ err: `Failed to parse CTO: ${err.message}` });
      }
    },
    deleteTemplate: async (c: Context, req: Express.Request, res: ExpressRes) =>
      res.status(200).json({}),
    validationFail: async (c: Context, req: ExpressReq, res: ExpressRes) =>
      res.status(400).json({ err: c.validation.errors }),
    notFound: async (c: Context, req: ExpressReq, res: ExpressRes) =>
      res.status(404).json({ err: "not found" }),
    notImplemented: async (c: Context, req: ExpressReq, res: ExpressRes) => {
      const { status, mock } = c.api.mockResponseForOperation(
        c.operation.operationId
      );
      return res.status(status).json(mock);
    },
  },
});

api.init();
app.use(morgan("combined"));
app.use((req: ExpressReq, res: ExpressRes) =>
  api.handleRequest(req as Request, req, res)
);

const HOST = process.env.HOST || 'localhost';
const PORT = parseInt(process.env.PORT || '9000', 10);


app.listen(PORT, HOST, () => {
    console.info(`API listening at http://${HOST}:${PORT}`);
});

