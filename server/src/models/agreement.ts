export interface Agreement {
  id: string;
  name: string;
  createdAt: string;
  details: string;
}

export interface TriggerRequest {
  data: any; // JSON-serialized Concerto type, adjust as needed
}

export interface TriggerResponse {
  result: any; // Adjust based on actual response structure
}

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

export default agreements;
