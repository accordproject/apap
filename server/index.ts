import "source-map-support/register";
import OpenAPIBackend, { Request as OpenAPIRequest } from "openapi-backend";
import express, {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import morgan from "morgan";
import path from "path";

// Define interfaces for Template and Agreement
interface Template {
  id: string;
  name: string;
  createdAt: string;
  content: string;
}

interface Agreement {
  id: string;
  name: string;
  createdAt: string;
  details: string;
}

// Pagination response interface
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    offset: number;
    limit: number;
  };
  links: {
    self: string;
    next: string | null;
    prev: string | null;
    first: string;
    last: string;
  };
}

// Mock trigger request/response

interface TriggerRequest {
  data: any; // JSON-serialized Concerto type, adjust as needed
}

interface TriggerResponse {
  result: any; // Adjust based on actual response structure
}

// Sample template data
const templates: Record<string, Template> = {
  "1": {
    id: "1",
    name: "Template One",
    createdAt: "2024-03-01",
    content: "Sample content 1",
  },
  "2": {
    id: "2",
    name: "Template Two",
    createdAt: "2024-03-02",
    content: "Sample content 2",
  },
  "3": {
    id: "3",
    name: "Template Three",
    createdAt: "2024-03-03",
    content: "Sample content 3",
  },
};

// Sample agreement data
const agreements: Record<string, Agreement> = {
  "101": {
    id: "101",
    name: "Agreement A",
    createdAt: "2024-02-01",
    details: "Agreement details A",
  },
  "102": {
    id: "102",
    name: "Agreement B",
    createdAt: "2024-02-02",
    details: "Agreement details B",
  },
  "103": {
    id: "103",
    name: "Agreement C",
    createdAt: "2024-02-03",
    details: "Agreement details C",
  },
};

// Utility function for pagination
const paginate = <T>(
  data: T[],
  offset: number,
  limit: number,
  baseUrl: string
): PaginatedResponse<T> => {
  const total = data.length;
  const paginatedData = data.slice(offset, offset + limit);
  const links = {
    self: `${baseUrl}?offset=${offset}&limit=${limit}`,
    next:
      offset + limit < total
        ? `${baseUrl}?offset=${offset + limit}&limit=${limit}`
        : null,
    prev:
      offset > 0
        ? `${baseUrl}?offset=${Math.max(0, offset - limit)}&limit=${limit}`
        : null,
    first: `${baseUrl}?offset=0&limit=${limit}`,
    last: `${baseUrl}?offset=${
      Math.floor((total - 1) / limit) * limit
    }&limit=${limit}`,
  };
  return {
    data: paginatedData,
    meta: { total, offset, limit },
    links,
  };
};

// Utility function to filter fields
const filterFields = <T>(obj: T, fields: string[]): Partial<T> => {
  if (!fields.length) return obj;
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(obj as Record<string, any>)) {
    if (fields.includes(key)) {
      (result as Record<string, any>)[key] = value;
    }
  }
  return result;
};

const app = express();
app.use(express.json());

// Load OpenAPI definition
const openApiPath = path.join(__dirname, "..", "..", "openapi.json");
console.log(`Loading OpenAPI definition from: ${openApiPath}`);

const api = new OpenAPIBackend({
  quick: true,
  definition: openApiPath,
  handlers: {
    // List Templates
    listTemplates: async (
      c: any,
      req: ExpressRequest,
      res: ExpressResponse
    ) => {
      const offset = parseInt(req.query.offset as string) || 0;
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
      const fields =
        typeof req.query.fields === "string"
          ? req.query.fields.split(",")
          : ["id", "name", "createdAt"];
      const full = req.query.full === "true";
      const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;

      const allTemplates = Object.values(templates);
      const responseData = full
        ? allTemplates
        : allTemplates.map((template) => filterFields(template, fields));

      const paginatedResult = paginate(responseData, offset, limit, baseUrl);
      return res.status(200).json(paginatedResult);
    },

    // Create Template
    createTemplate: async (
      c: any,
      req: ExpressRequest,
      res: ExpressResponse
    ) => {
      const { name, content } = req.body as Partial<Template>;
      if (!name || !content) {
        return res.status(400).json({ error: "Name and content are required" });
      }
      const id = (Object.keys(templates).length + 1).toString();
      const newTemplate: Template = {
        id,
        name,
        createdAt: new Date().toISOString(),
        content,
      };
      templates[id] = newTemplate;
      return res.status(201).json(newTemplate);
    },

    // Get Template
    getTemplate: async (
      c: any,
      req: ExpressRequest<{ name: string }>,
      res: ExpressResponse
    ) => {
      const { name } = req.params;
      if (!templates[name]) {
        return res.status(404).json({ error: "Template not found" });
      }
      return res.status(200).json(templates[name]);
    },

    // Replace Template
    replaceTemplate: async (
      c: any,
      req: ExpressRequest<{ name: string }>,
      res: ExpressResponse
    ) => {
      const { name: templateId } = req.params;
      if (!templates[templateId]) {
        return res.status(404).json({ error: "Template not found" });
      }
      const { name, content } = req.body as Partial<Template>;
      const updatedTemplate: Template = {
        id: templateId,
        name: name || templates[templateId].name,
        createdAt: templates[templateId].createdAt,
        content: content || templates[templateId].content,
      };
      templates[templateId] = updatedTemplate;
      return res.status(202).json(updatedTemplate);
    },

    // Delete Template
    deleteTemplate: async (
      c: any,
      req: ExpressRequest<{ name: string }>,
      res: ExpressResponse
    ) => {
      const { name: templateId } = req.params;
      if (!templates[templateId]) {
        return res.status(404).json({ error: "Template not found" });
      }
      delete templates[templateId];
      return res.status(204).send();
    },

    // List Agreements
    listAgreements: async (
      c: any,
      req: ExpressRequest,
      res: ExpressResponse
    ) => {
      const offset = parseInt(req.query.offset as string) || 0;
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
      const fields =
        typeof req.query.fields === "string"
          ? req.query.fields.split(",")
          : ["id", "name", "createdAt"];
      const full = req.query.full === "true";
      const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;

      const allAgreements = Object.values(agreements);
      const responseData = full
        ? allAgreements
        : allAgreements.map((agreement) => filterFields(agreement, fields));

      const paginatedResult = paginate(responseData, offset, limit, baseUrl);
      return res.status(200).json(paginatedResult);
    },
    // Create Agreement
    createAgreement: async (
      c: any,
      req: ExpressRequest,
      res: ExpressResponse
    ) => {
      const { name, details } = req.body as Partial<Agreement>;
      if (!name || !details) {
        return res.status(400).json({ error: "Name and details are required" });
      }
      const id = (Object.keys(agreements).length + 101).toString();
      const newAgreement: Agreement = {
        id,
        name,
        createdAt: new Date().toISOString(),
        details,
      };
      agreements[id] = newAgreement;
      return res.status(201).json(newAgreement);
    },

    // Get Agreement
    getAgreement: async (
      c: any,
      req: ExpressRequest<{ agreementId: string }>,
      res: ExpressResponse
    ) => {
      const { agreementId } = req.params;
      if (!agreements[agreementId]) {
        return res.status(404).json({ error: "Agreement not found" });
      }
      return res.status(200).json(agreements[agreementId]);
    },

    // Replace Agreement
    replaceAgreement: async (
      c: any,
      req: ExpressRequest<{ agreementId: string }>,
      res: ExpressResponse
    ) => {
      const { agreementId } = req.params;
      if (!agreements[agreementId]) {
        return res.status(404).json({ error: "Agreement not found" });
      }
      const { name, details } = req.body as Partial<Agreement>;
      const updatedAgreement: Agreement = {
        id: agreementId,
        name: name || agreements[agreementId].name,
        createdAt: agreements[agreementId].createdAt,
        details: details || agreements[agreementId].details,
      };
      agreements[agreementId] = updatedAgreement;
      return res.status(202).json(updatedAgreement);
    },

    // Delete Agreement
    deleteAgreement: async (
      c: any,
      req: ExpressRequest<{ agreementId: string }>,
      res: ExpressResponse
    ) => {
      const { agreementId } = req.params;
      if (!agreements[agreementId]) {
        return res.status(404).json({ error: "Agreement not found" });
      }
      delete agreements[agreementId];
      return res.status(204).send();
    },

    // Convert Agreement to PDF (Removed unused 'options')
    convertAgreementPdf: async (
      c: any,
      req: ExpressRequest<{ agreementId: string }>,
      res: ExpressResponse
    ) => {
      const { agreementId } = req.params;
      if (!agreements[agreementId]) {
        return res.status(404).json({ error: "Agreement not found" });
      }
      // Mock PDF response (replace with actual PDF generation logic)
      const pdfMock = Buffer.from(`Mock PDF for ${agreementId}`);
      res.setHeader("Content-Type", "application/pdf");
      return res.status(202).send(pdfMock);
    },

    // Trigger Agreement
    triggerAgreement: async (
      c: any,
      req: ExpressRequest<{ agreementId: string }>,
      res: ExpressResponse
    ) => {
      const { agreementId } = req.params;
      if (!agreements[agreementId]) {
        return res.status(404).json({ error: "Agreement not found" });
      }
      const triggerData = req.body as TriggerRequest;
      const response: TriggerResponse = {
        result: `Triggered ${agreementId} with data: ${JSON.stringify(
          triggerData.data
        )}`,
      };
      return res.status(200).json(response);
    },

    // Default Handlers
    validationFail: async (c: any, req: ExpressRequest, res: ExpressResponse) =>
      res.status(400).json({ error: c.validation.errors }),
    notFound: async (c: any, req: ExpressRequest, res: ExpressResponse) =>
      res.status(404).json({ error: "Not found" }),
    notImplemented: async (
      c: any,
      req: ExpressRequest,
      res: ExpressResponse
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
app.use((req, res) => api.handleRequest(req as OpenAPIRequest, req, res));
app.listen(9000, () => console.info("API listening at http://localhost:9000"));
