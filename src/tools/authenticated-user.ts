import { z } from "zod";
import type { ToolDefinition } from "../types.js";
import { jsonResult } from "../types.js";
import { qiitaClient } from "../client.js";
import { withErrorHandler } from "../errors.js";

export const authenticatedUserTools: ToolDefinition[] = [
  {
    name: "get_authenticated_user",
    description: "Get the currently authenticated user's profile",
    schema: {},
    handler: withErrorHandler(async () => {
      const data = await qiitaClient.get("/api/v2/authenticated_user");
      return jsonResult(data);
    }),
  },
  {
    name: "list_authenticated_user_items",
    description: "List items posted by the currently authenticated user",
    schema: {
      page: z.number().optional().describe("Page number (default: 1)"),
      per_page: z
        .number()
        .optional()
        .describe("Number of items per page (default: 20, max: 100)"),
    },
    handler: withErrorHandler(async (args) => {
      const result = await qiitaClient.getPaginated(
        "/api/v2/authenticated_user/items",
        args.page as number | undefined,
        args.per_page as number | undefined
      );
      return jsonResult({
        items: result.data,
        totalCount: result.totalCount,
        nextPage: result.nextPage,
        prevPage: result.prevPage,
      });
    }),
  },
];
