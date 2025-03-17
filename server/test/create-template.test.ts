import { createTemplate } from "../index"; // Now exported
import { Request, Response } from "express";

// Mock Express Response
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("createTemplate Handler (Issue #17)", () => {
  it("parses CTO string into model and returns template", async () => {
    const req = {
      body: {
        $class: "org.accordproject.protocol@1.0.0.Template",
        name: "Sample Template",
        text: {
          $class: "org.accordproject.protocol@1.0.0.Text",
          content: "Test Content",
          format: "Markdown",
          templateMark: {
            $class: "org.accordproject.commonmark@0.5.0.Document",
            xmlns: "http://commonmark.org/ns",
            nodes: [],
          },
        },
        templateModel: {
          $class: "org.accordproject.protocol@1.0.0.TemplateModel",
          typeName: "Person",
          cto: "namespace org.example\nconcept Person { o String name }",
        },
      },
    } as Request;

    const res = mockResponse();
    await createTemplate({} as any, req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();

    const responseBody = (res.json as jest.Mock).mock.calls[0][0];
    expect(responseBody.templateModel.model).toBeDefined();
    expect(responseBody.templateModel.model.$class).toBe(
      "concerto.metamodel@1.0.0.Model"
    );
    expect(responseBody.templateModel.model.namespace).toBe("org.example");
    expect(responseBody.templateModel.model.declarations[0].name).toBe(
      "Person"
    );
  });

  it("handles request without CTO string", async () => {
    const req = {
      body: {
        $class: "org.accordproject.protocol@1.0.0.Template",
        name: "Sample Template",
        text: {
          $class: "org.accordproject.protocol@1.0.0.Text",
          content: "Test Content",
          format: "Markdown",
          templateMark: {
            $class: "org.accordproject.commonmark@0.5.0.Document",
            xmlns: "http://commonmark.org/ns",
            nodes: [],
          },
        },
        templateModel: {
          $class: "org.accordproject.protocol@1.0.0.TemplateModel",
          typeName: "Person",
        },
      },
    } as Request;

    const res = mockResponse();
    await createTemplate({} as any, req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    expect(
      (res.json as jest.Mock).mock.calls[0][0].templateModel.model
    ).toBeUndefined();
  });
});
