import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { templates } from "../models/template";
import { paginate } from "../utils/pagination";
import { filterFields } from "../utils/filters";
import { Template } from "../models/template";

export const listTemplates = async (
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
};

// Add createTemplate, getTemplate, replaceTemplate, deleteTemplate similarly...

// Create Template

export const createTemplate = async (
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
};

// Get Template
export const getTemplate = async (
  c: any,
  req: ExpressRequest<{ name: string }>,
  res: ExpressResponse
) => {
  const { name } = req.params;
  if (!templates[name]) {
    return res.status(404).json({ error: "Template not found" });
  }
  return res.status(200).json(templates[name]);
};

// Replace Template
export const replaceTemplate = async (
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
};

// Delete Template
export const deleteTemplate = async (
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
};
