import { z } from "zod";
import type { ToolDefinition } from "../types.js";
import { jsonResult, textResult } from "../types.js";
import { qiitaClient } from "../client.js";
import { withErrorHandler } from "../errors.js";

export const reactionTools: ToolDefinition[] = [
  {
    name: "create_item_reaction",
    description: "Add an emoji reaction to an item (Qiita Team only)",
    schema: {
      item_id: z.string().describe("Item ID"),
      name: z.string().describe("Emoji reaction name (e.g. '+1', 'heart')"),
    },
    handler: withErrorHandler(async (args) => {
      const itemId = args.item_id as string;
      const name = args.name as string;
      const result = await qiitaClient.post(
        `/items/${itemId}/reactions`,
        { name }
      );
      return jsonResult(result);
    }),
  },
  {
    name: "list_item_reactions",
    description: "List emoji reactions on an item (Qiita Team only)",
    schema: {
      item_id: z.string().describe("Item ID"),
    },
    handler: withErrorHandler(async (args) => {
      const itemId = args.item_id as string;
      const result = await qiitaClient.get(
        `/items/${itemId}/reactions`
      );
      return jsonResult(result);
    }),
  },
  {
    name: "delete_item_reaction",
    description: "Delete an emoji reaction from an item (Qiita Team only)",
    schema: {
      item_id: z.string().describe("Item ID"),
      reaction_name: z.string().describe("Emoji reaction name to delete"),
    },
    handler: withErrorHandler(async (args) => {
      const itemId = args.item_id as string;
      const reactionName = args.reaction_name as string;
      await qiitaClient.delete(
        `/items/${itemId}/reactions/${reactionName}`
      );
      return textResult("Reaction deleted successfully");
    }),
  },
  {
    name: "create_comment_reaction",
    description: "Add an emoji reaction to a comment (Qiita Team only)",
    schema: {
      comment_id: z.string().describe("Comment ID"),
      name: z.string().describe("Emoji reaction name (e.g. '+1', 'heart')"),
    },
    handler: withErrorHandler(async (args) => {
      const commentId = args.comment_id as string;
      const name = args.name as string;
      const result = await qiitaClient.post(
        `/comments/${commentId}/reactions`,
        { name }
      );
      return jsonResult(result);
    }),
  },
  {
    name: "list_comment_reactions",
    description: "List emoji reactions on a comment (Qiita Team only)",
    schema: {
      comment_id: z.string().describe("Comment ID"),
    },
    handler: withErrorHandler(async (args) => {
      const commentId = args.comment_id as string;
      const result = await qiitaClient.get(
        `/comments/${commentId}/reactions`
      );
      return jsonResult(result);
    }),
  },
  {
    name: "delete_comment_reaction",
    description: "Delete an emoji reaction from a comment (Qiita Team only)",
    schema: {
      comment_id: z.string().describe("Comment ID"),
      reaction_name: z.string().describe("Emoji reaction name to delete"),
    },
    handler: withErrorHandler(async (args) => {
      const commentId = args.comment_id as string;
      const reactionName = args.reaction_name as string;
      await qiitaClient.delete(
        `/comments/${commentId}/reactions/${reactionName}`
      );
      return textResult("Reaction deleted successfully");
    }),
  },
  {
    name: "create_project_comment_reaction",
    description:
      "Add an emoji reaction to a project comment (Qiita Team only)",
    schema: {
      comment_id: z.string().describe("Project comment ID"),
      name: z.string().describe("Emoji reaction name (e.g. '+1', 'heart')"),
    },
    handler: withErrorHandler(async (args) => {
      const commentId = args.comment_id as string;
      const name = args.name as string;
      const result = await qiitaClient.post(
        `/project_comments/${commentId}/reactions`,
        { name }
      );
      return jsonResult(result);
    }),
  },
];
