import "source-map-support/register";
import OpenAPIBackend, { Request, Context } from "openapi-backend";
import Express from "express";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import etag from "etag";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const app = Express();
app.use(Express.json());

const openApiPath = path.join(__dirname, "..", "openapi.json");

const templatesPath = path.join(__dirname, "templates");

async function fetchTemplate(templateName: string): Promise<any> {
  try {
    const templatePath = path.join(templatesPath, `${templateName}.json`);
    const templateContent = await fs.promises.readFile(templatePath, "utf8");
    return JSON.parse(templateContent);
  } catch (error) {
    console.error(`Error fetching template: ${error}`);
    throw error;
  }
}

function generateETag(template: any): string {
  const templateString = JSON.stringify(template);
  return etag(templateString);
}

function getLastModified(templateName: string): Date {
  try {
    const templatePath = path.join(templatesPath, `${templateName}.json`);
    const stats = fs.statSync(templatePath);
    return stats.mtime;
  } catch (error) {
    console.error(`Error getting last modified date: ${error}`);
    throw error;
  }
}

const api = new OpenAPIBackend({
  quick: true,
  definition: openApiPath,
  handlers: {
    listTemplates: async (
      _c: Context,
      _req: Express.Request,
      res: Express.Response
    ) => res.status(200).json([]),

    createTemplate: async (
      _c: Context,
      _req: Express.Request,
      res: Express.Response
    ) => res.status(200).json({}),

    getTemplate: async (
      _c: Context,
      req: Express.Request,
      res: Express.Response
    ) => {
      try {
        const templateName = req.params.name;
        const template = await fetchTemplate(templateName);
        const etag = generateETag(template);
        const lastModified = getLastModified(templateName);
        console.log(templateName, etag, lastModified);
        res.set("ETag", etag);
        res.set("Last-Modified", lastModified.toUTCString());

        if (req.headers["if-none-match"] === etag) {
          return res.status(304).send();
        }
        if (
          req.headers["if-modified-since"] &&
          req.headers["if-modified-since"] >= lastModified.toUTCString()
        ) {
          return res.status(304).send();
        }

        res.status(200).json(template);
      } catch (error) {
        console.error(`Error getting template: ${error}`);
        res.status(500).json({ error: "Failed to retrieve template" });
      }
    },

    replaceTemplate: async (
      _c: Context,
      _req: Express.Request,
      res: Express.Response
    ) => res.status(200).json({}),

    deleteTemplate: async (
      _c: Context,
      _req: Express.Request,
      res: Express.Response
    ) => res.status(200).json({}),

    validationFail: async (
      c: Context,
      _req: Express.Request,
      res: Express.Response
    ) => res.status(400).json({ err: c.validation.errors }),

    notFound: async (
      _c: Context,
      _req: Express.Request,
      res: Express.Response
    ) => res.status(404).json({ err: "not found" }),

    notImplemented: async (
      c: Context,
      _req: Express.Request,
      res: Express.Response
    ) => {
      const { status, mock } = c.api.mockResponseForOperation(
        c.operation.operationId
      );
      return res.status(status).json(mock);
    },
  },
});

api.init();

app.use(morgan("combined"));

app.use((req: Express.Request, res: Express.Response) =>
  api.handleRequest(req as Request, req, res)
);

const HOST = process.env.HOST || "localhost";
const PORT = parseInt(process.env.PORT || "9000", 10);

app.listen(PORT, HOST, () => {
  console.info(`API listening at http://${HOST}:${PORT}`);
});
