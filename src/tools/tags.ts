import { z } from "zod";
import type { ToolDefinition } from "../types.js";
import { jsonResult, textResult } from "../types.js";
import { qiitaClient } from "../client.js";
import { withErrorHandler } from "../errors.js";

export const tagTools: ToolDefinition[] = [
  {
    name: "list_tags",
    description: "List tags in order of popularity or name",
    schema: {
      page: z.number().optional().describe("Page number (default: 1)"),
      per_page: z
        .number()
        .optional()
        .describe("Number of items per page (default: 20, max: 100)"),
      sort: z
        .enum(["count", "name"])
        .optional()
        .describe("Sort order: 'count' (popularity) or 'name' (alphabetical)"),
    },
    handler: withErrorHandler(async (args) => {
      const page = args.page as number | undefined;
      const perPage = args.per_page as number | undefined;
      const sort = args.sort as string | undefined;
      const path = sort ? `/tags?sort=${sort}` : "/tags";
      const data = await qiitaClient.getPaginated(path, page, perPage);
      return jsonResult(data);
    }),
  },
  {
    name: "get_tag",
    description: "Get a specific tag by its ID",
    schema: {
      tag_id: z
        .string()
        .describe("The tag ID (URL-encoded tag name, e.g. 'Ruby')"),
    },
    handler: withErrorHandler(async (args) => {
      const tagId = args.tag_id as string;
      const data = await qiitaClient.get(`/tags/${tagId}`);
      return jsonResult(data);
    }),
  },
  {
    name: "list_tag_items",
    description: "List items (articles) associated with a specific tag",
    schema: {
      tag_id: z.string().describe("The tag ID"),
      page: z.number().optional().describe("Page number (default: 1)"),
      per_page: z
        .number()
        .optional()
        .describe("Number of items per page (default: 20, max: 100)"),
    },
    handler: withErrorHandler(async (args) => {
      const tagId = args.tag_id as string;
      const page = args.page as number | undefined;
      const perPage = args.per_page as number | undefined;
      const data = await qiitaClient.getPaginated(
        `/tags/${tagId}/items`,
        page,
        perPage
      );
      return jsonResult(data);
    }),
  },
  {
    name: "list_user_following_tags",
    description: "List tags that a specific user is following",
    schema: {
      user_id: z.string().describe("The user ID"),
      page: z.number().optional().describe("Page number (default: 1)"),
      per_page: z
        .number()
        .optional()
        .describe("Number of items per page (default: 20, max: 100)"),
    },
    handler: withErrorHandler(async (args) => {
      const userId = args.user_id as string;
      const page = args.page as number | undefined;
      const perPage = args.per_page as number | undefined;
      const data = await qiitaClient.getPaginated(
        `/users/${userId}/following_tags`,
        page,
        perPage
      );
      return jsonResult(data);
    }),
  },
  {
    name: "follow_tag",
    description: "Follow a tag",
    schema: {
      tag_id: z.string().describe("The tag ID to follow"),
    },
    handler: withErrorHandler(async (args) => {
      const tagId = args.tag_id as string;
      await qiitaClient.put(`/tags/${tagId}/following`);
      return textResult(`Now following tag: ${tagId}`);
    }),
  },
  {
    name: "unfollow_tag",
    description: "Unfollow a tag",
    schema: {
      tag_id: z.string().describe("The tag ID to unfollow"),
    },
    handler: withErrorHandler(async (args) => {
      const tagId = args.tag_id as string;
      await qiitaClient.delete(`/tags/${tagId}/following`);
      return textResult(`Unfollowed tag: ${tagId}`);
    }),
  },
  {
    name: "create_tagging",
    description:
      "Add a tag to an item (Qiita Team only). Optionally specify versions.",
    schema: {
      item_id: z.string().describe("The ID of the item"),
      name: z.string().describe("The tag name to add"),
      versions: z
        .array(z.string())
        .optional()
        .describe("Version strings for the tag (e.g. ['1.0', '2.0'])"),
    },
    handler: withErrorHandler(async (args) => {
      const itemId = args.item_id as string;
      const name = args.name as string;
      const versions = args.versions as string[] | undefined;
      const payload: Record<string, unknown> = { name };
      if (versions) payload.versions = versions;
      const data = await qiitaClient.post(
        `/items/${itemId}/taggings`,
        payload
      );
      return jsonResult(data);
    }),
  },
  {
    name: "delete_tagging",
    description: "Remove a tag from an item (Qiita Team only)",
    schema: {
      item_id: z.string().describe("The ID of the item"),
      tagging_id: z.string().describe("The ID of the tagging to remove"),
    },
    handler: withErrorHandler(async (args) => {
      const itemId = args.item_id as string;
      const taggingId = args.tagging_id as string;
      await qiitaClient.delete(
        `/items/${itemId}/taggings/${taggingId}`
      );
      return textResult("Tagging removed successfully.");
    }),
  },
];
