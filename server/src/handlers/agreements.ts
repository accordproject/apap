import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";

import agreements from "../models/agreement";
import {
  Agreement,
  TriggerRequest,
  TriggerResponse,
} from "../models/agreement";
import { paginate } from "../utils/pagination";
import { filterFields } from "../utils/filters";

export const listAgreements = async (
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
};

// Create Agreement
export const createAgreement = async (
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
};

// Get Agreement
export const getAgreement = async (
  c: any,
  req: ExpressRequest<{ agreementId: string }>,
  res: ExpressResponse
) => {
  const { agreementId } = req.params;
  if (!agreements[agreementId]) {
    return res.status(404).json({ error: "Agreement not found" });
  }
  return res.status(200).json(agreements[agreementId]);
};

// Replace Agreement
export const replaceAgreement = async (
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
};

// Delete Agreement
export const deleteAgreement = async (
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
};

// Convert Agreement to PDF (Removed unused 'options')
export const convertAgreementPdf = async (
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
};

// Trigger Agreement
export const triggerAgreement = async (
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
};
