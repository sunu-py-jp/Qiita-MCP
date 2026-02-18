import { z } from "zod";
import type { ToolDefinition } from "../types.js";
import { jsonResult, textResult } from "../types.js";
import { qiitaClient } from "../client.js";
import { withErrorHandler } from "../errors.js";

const tagSchema = z.object({
  name: z.string(),
  versions: z.array(z.string()).optional(),
});

export const itemTools: ToolDefinition[] = [
  {
    name: "list_items",
    description: "List items on Qiita with optional search query",
    schema: {
      page: z.number().optional().describe("Page number (default: 1)"),
      per_page: z
        .number()
        .optional()
        .describe("Number of items per page (default: 20, max: 100)"),
      query: z
        .string()
        .optional()
        .describe("Search query (Qiita search syntax)"),
    },
    handler: withErrorHandler(async (args) => {
      const query = args.query as string | undefined;
      const path = query
        ? `/items?query=${encodeURIComponent(query)}`
        : "/items";
      const result = await qiitaClient.getPaginated(
        path,
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
  {
    name: "get_item",
    description: "Get a specific Qiita item by ID",
    schema: {
      item_id: z.string().describe("Item ID"),
    },
    handler: withErrorHandler(async (args) => {
      const data = await qiitaClient.get(
        `/items/${args.item_id as string}`
      );
      return jsonResult(data);
    }),
  },
  {
    name: "create_item",
    description: "Create a new Qiita item (article)",
    schema: {
      title: z.string().describe("Item title"),
      body: z.string().describe("Item body in Markdown"),
      tags: z
        .array(tagSchema)
        .describe("Tags (array of {name, versions?})"),
      private: z
        .boolean()
        .optional()
        .describe("Whether the item is private (default: false)"),
      tweet: z
        .boolean()
        .optional()
        .describe("Whether to post to X (Twitter) (default: false)"),
    },
    handler: withErrorHandler(async (args) => {
      const data = await qiitaClient.post("/items", {
        title: args.title,
        body: args.body,
        tags: args.tags,
        private: args.private ?? false,
        tweet: args.tweet ?? false,
      });
      return jsonResult(data);
    }),
  },
  {
    name: "update_item",
    description: "Update an existing Qiita item",
    schema: {
      item_id: z.string().describe("Item ID to update"),
      title: z.string().optional().describe("New title"),
      body: z.string().optional().describe("New body in Markdown"),
      tags: z
        .array(tagSchema)
        .optional()
        .describe("New tags (array of {name, versions?})"),
      private: z.boolean().optional().describe("Whether the item is private"),
    },
    handler: withErrorHandler(async (args) => {
      const itemId = args.item_id as string;
      const body: Record<string, unknown> = {};
      if (args.title !== undefined) body.title = args.title;
      if (args.body !== undefined) body.body = args.body;
      if (args.tags !== undefined) body.tags = args.tags;
      if (args.private !== undefined) body.private = args.private;
      const data = await qiitaClient.patch(`/items/${itemId}`, body);
      return jsonResult(data);
    }),
  },
  {
    name: "delete_item",
    description: "Delete a Qiita item",
    schema: {
      item_id: z.string().describe("Item ID to delete"),
    },
    handler: withErrorHandler(async (args) => {
      await qiitaClient.delete(`/items/${args.item_id as string}`);
      return textResult("Item deleted successfully.");
    }),
  },
  {
    name: "list_user_items",
    description: "List items posted by a specific user",
    schema: {
      user_id: z.string().describe("User ID"),
      page: z.number().optional().describe("Page number (default: 1)"),
      per_page: z
        .number()
        .optional()
        .describe("Number of items per page (default: 20, max: 100)"),
    },
    handler: withErrorHandler(async (args) => {
      const result = await qiitaClient.getPaginated(
        `/users/${args.user_id as string}/items`,
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
  {
    name: "list_user_stocks",
    description: "List items stocked by a specific user",
    schema: {
      user_id: z.string().describe("User ID"),
      page: z.number().optional().describe("Page number (default: 1)"),
      per_page: z
        .number()
        .optional()
        .describe("Number of items per page (default: 20, max: 100)"),
    },
    handler: withErrorHandler(async (args) => {
      const result = await qiitaClient.getPaginated(
        `/users/${args.user_id as string}/stocks`,
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
  {
    name: "list_item_stockers",
    description: "List users who stocked a specific item",
    schema: {
      item_id: z.string().describe("Item ID"),
      page: z.number().optional().describe("Page number (default: 1)"),
      per_page: z
        .number()
        .optional()
        .describe("Number of items per page (default: 20, max: 100)"),
    },
    handler: withErrorHandler(async (args) => {
      const result = await qiitaClient.getPaginated(
        `/items/${args.item_id as string}/stockers`,
        args.page as number | undefined,
        args.per_page as number | undefined
      );
      return jsonResult({
        stockers: result.data,
        totalCount: result.totalCount,
        nextPage: result.nextPage,
        prevPage: result.prevPage,
      });
    }),
  },
  {
    name: "stock_item",
    description: "Stock (bookmark) an item",
    schema: {
      item_id: z.string().describe("Item ID to stock"),
    },
    handler: withErrorHandler(async (args) => {
      await qiitaClient.put(
        `/items/${args.item_id as string}/stock`
      );
      return textResult("Item stocked successfully.");
    }),
  },
  {
    name: "unstock_item",
    description: "Unstock (remove bookmark from) an item",
    schema: {
      item_id: z.string().describe("Item ID to unstock"),
    },
    handler: withErrorHandler(async (args) => {
      await qiitaClient.delete(
        `/items/${args.item_id as string}/stock`
      );
      return textResult("Item unstocked successfully.");
    }),
  },
  {
    name: "import_item",
    description: "Import an item with custom created_at/updated_at timestamps",
    schema: {
      title: z.string().describe("Item title"),
      body: z.string().describe("Item body in Markdown"),
      tags: z
        .array(tagSchema)
        .describe("Tags (array of {name, versions?})"),
      private: z
        .boolean()
        .optional()
        .describe("Whether the item is private (default: false)"),
      created_at: z
        .string()
        .optional()
        .describe("Original creation date (ISO 8601 format)"),
      updated_at: z
        .string()
        .optional()
        .describe("Original update date (ISO 8601 format)"),
    },
    handler: withErrorHandler(async (args) => {
      const body: Record<string, unknown> = {
        title: args.title,
        body: args.body,
        tags: args.tags,
        private: args.private ?? false,
      };
      if (args.created_at !== undefined) body.created_at = args.created_at;
      if (args.updated_at !== undefined) body.updated_at = args.updated_at;
      const data = await qiitaClient.post("/imported_items", body);
      return jsonResult(data);
    }),
  },
];
