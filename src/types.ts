import { z } from "zod";

export type ToolSchema = Record<string, z.ZodTypeAny>;

export interface ToolDefinition {
  name: string;
  description: string;
  schema: ToolSchema;
  handler: (args: Record<string, unknown>) => Promise<ToolResult>;
}

export interface ToolResult {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number | null;
  firstPage: string | null;
  lastPage: string | null;
  nextPage: string | null;
  prevPage: string | null;
}

export function textResult(text: string): ToolResult {
  return { content: [{ type: "text", text }] };
}

export function jsonResult(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

export function errorResult(message: string): ToolResult {
  return { content: [{ type: "text", text: message }], isError: true };
}
