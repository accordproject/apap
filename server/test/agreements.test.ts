import { spawn, ChildProcess } from "child_process";
import axios, { AxiosInstance } from "axios";
import waitOn from "wait-on";

jest.setTimeout(30000);

interface PaginatedResponse {
  data: { id: string; name: string; createdAt?: string; details?: string }[];
  meta: { total: number; offset: number; limit: number };
  links: {
    self: string;
    next: string | null;
    prev: string | null;
    first: string;
    last: string;
  };
}

describe("Agreements API - Issue #15 Fix", () => {
  let start: ChildProcess | null = null;
  let client: AxiosInstance;

  beforeAll(async () => {
    client = axios.create({
      baseURL: "http://localhost:9000",
      validateStatus: () => true,
    });
    start = spawn("node", ["dist/index.js"], {
      cwd: process.cwd(),
      detached: true,
      stdio: "inherit",
    });

    start.on("error", (err) => {
      console.error("Spawn error:", err);
      throw err;
    });

    await waitOn({ resources: ["tcp:localhost:9000"] });
  });

  afterAll(() => {
    if (start && start.pid) {
      process.kill(-start.pid);
    }
  });

  test("returns 200 with metadata-only by default", async () => {
    const res = await client.get<PaginatedResponse>("/agreements");
    expect(res.status).toBe(200);
    expect(res.data.data).toHaveLength(3);
    expect(res.data.data[0]).toHaveProperty("id");
    expect(res.data.data[0]).toHaveProperty("name");
    expect(res.data.data[0]).toHaveProperty("createdAt");
    expect(res.data.data[0]).not.toHaveProperty("details");
    expect(res.data.meta).toEqual({ total: 3, offset: 0, limit: 10 });
  });

  test("returns 200 with paginated results", async () => {
    const res = await client.get<PaginatedResponse>(
      "/agreements?offset=1&limit=1"
    );
    expect(res.status).toBe(200);
    expect(res.data.data).toHaveLength(1);
    expect(res.data.data[0].id).toBe("102");
    expect(res.data.meta).toEqual({ total: 3, offset: 1, limit: 1 });
    expect(res.data.links.next).toBe(
      "http://localhost:9000/agreements?offset=2&limit=1"
    );
  });

  test("returns 200 with filtered fields", async () => {
    const res = await client.get<PaginatedResponse>(
      "/agreements?fields=id,name"
    );
    expect(res.status).toBe(200);
    expect(res.data.data[0]).toHaveProperty("id");
    expect(res.data.data[0]).toHaveProperty("name");
    expect(res.data.data[0]).not.toHaveProperty("createdAt");
    expect(res.data.data[0]).not.toHaveProperty("details");
  });

  test("returns 200 with full objects when full=true", async () => {
    const res = await client.get<PaginatedResponse>("/agreements?full=true");
    expect(res.status).toBe(200);
    expect(res.data.data[0]).toHaveProperty("id");
    expect(res.data.data[0]).toHaveProperty("name");
    expect(res.data.data[0]).toHaveProperty("createdAt");
    expect(res.data.data[0]).toHaveProperty("details");
  });
});
