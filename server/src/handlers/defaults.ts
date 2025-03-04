import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";

export const validationFail = async (
  c: any,
  req: ExpressRequest,
  res: ExpressResponse
) => res.status(400).json({ error: c.validation.errors });
export const notFound = async (
  c: any,
  req: ExpressRequest,
  res: ExpressResponse
) => res.status(404).json({ error: "Not found" });
export const notImplemented = async (
  c: any,
  req: ExpressRequest,
  res: ExpressResponse
) => {
  const { status, mock } = c.api.mockResponseForOperation(
    c.operation.operationId
  );
  return res.status(status).json(mock);
};
