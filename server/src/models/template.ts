export interface Template {
  id: string;
  name: string;
  createdAt: string;
  content: string;
}

export const templates: Record<string, Template> = {
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
