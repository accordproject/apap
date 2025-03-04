import "source-map-support/register";
import OpenAPIBackend, { Request as OpenAPIRequest } from "openapi-backend";
import express from "express";
import morgan from "morgan";
import path from "path";
import * as templateHandlers from "./src/handlers/templates";
import * as agreementHandlers from "./src/handlers/agreements";
import * as defaultHandlers from "./src/handlers/defaults";

const app = express();
app.use(express.json());

const openApiPath = path.join(__dirname, "..", "..", "openapi.json");
console.log(`Loading OpenAPI definition from: ${openApiPath}`);

const api = new OpenAPIBackend({
  quick: true,
  definition: openApiPath,
  handlers: {
    ...templateHandlers,
    ...agreementHandlers,
    ...defaultHandlers,
  },
});

api.init();
app.use(morgan("combined"));
app.use((req, res) => api.handleRequest(req as OpenAPIRequest, req, res));
app.listen(9000, () => console.info("API listening at http://localhost:9000"));
