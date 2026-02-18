import { z } from "zod";
import type { ToolDefinition } from "../types.js";
import { jsonResult, textResult, path as p } from "../types.js";
import { qiitaClient } from "../client.js";
import { withErrorHandler } from "../errors.js";

export const commentTools: ToolDefinition[] = [
  {
    name: "list_item_comments",
    description: "List comments on a specific item (article)",
    schema: {
      item_id: z.string().describe("The ID of the item"),
    },
    handler: withErrorHandler(async (args) => {
      const itemId = args.item_id as string;
      const data = await qiitaClient.get(p`/items/${itemId}/comments`);
      return jsonResult(data);
    }),
  },
  {
    name: "create_comment",
    description: "Post a new comment on an item (article)",
    schema: {
      item_id: z.string().describe("The ID of the item"),
      body: z.string().describe("The comment body in Markdown"),
    },
    handler: withErrorHandler(async (args) => {
      const itemId = args.item_id as string;
      const body = args.body as string;
      const data = await qiitaClient.post(p`/items/${itemId}/comments`, {
        body,
      });
      return jsonResult(data);
    }),
  },
  {
    name: "get_comment",
    description: "Get a specific comment by its ID",
    schema: {
      comment_id: z.string().describe("The ID of the comment"),
    },
    handler: withErrorHandler(async (args) => {
      const commentId = args.comment_id as string;
      const data = await qiitaClient.get(p`/comments/${commentId}`);
      return jsonResult(data);
    }),
  },
  {
    name: "update_comment",
    description: "Update an existing comment",
    schema: {
      comment_id: z.string().describe("The ID of the comment"),
      body: z.string().describe("The updated comment body in Markdown"),
    },
    handler: withErrorHandler(async (args) => {
      const commentId = args.comment_id as string;
      const body = args.body as string;
      const data = await qiitaClient.patch(p`/comments/${commentId}`, {
        body,
      });
      return jsonResult(data);
    }),
  },
  {
    name: "delete_comment",
    description: "Delete a comment",
    schema: {
      comment_id: z.string().describe("The ID of the comment"),
    },
    handler: withErrorHandler(async (args) => {
      const commentId = args.comment_id as string;
      await qiitaClient.delete(p`/comments/${commentId}`);
      return textResult("Comment deleted successfully.");
    }),
  },
  {
    name: "import_comment",
    description:
      "Import a comment on an item with optional created_at and updated_at timestamps",
    schema: {
      item_id: z.string().describe("The ID of the item"),
      body: z.string().describe("The comment body in Markdown"),
      created_at: z
        .string()
        .optional()
        .describe("ISO 8601 timestamp for when the comment was created"),
      updated_at: z
        .string()
        .optional()
        .describe("ISO 8601 timestamp for when the comment was updated"),
    },
    handler: withErrorHandler(async (args) => {
      const itemId = args.item_id as string;
      const body = args.body as string;
      const payload: Record<string, string> = { body };
      if (args.created_at) payload.created_at = args.created_at as string;
      if (args.updated_at) payload.updated_at = args.updated_at as string;
      const data = await qiitaClient.post(
        p`/items/${itemId}/imported_comments`,
        payload
      );
      return jsonResult(data);
    }),
  },
];
