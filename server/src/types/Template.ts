export interface Template {
    id: string;
    name: string;
    content: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
} 