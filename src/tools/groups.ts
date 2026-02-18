import { z } from "zod";
import type { ToolDefinition } from "../types.js";
import { jsonResult, textResult } from "../types.js";
import { qiitaClient } from "../client.js";
import { withErrorHandler } from "../errors.js";

export const groupTools: ToolDefinition[] = [
  {
    name: "list_groups",
    description: "List groups (Qiita Team only)",
    schema: {
      page: z.number().optional().describe("Page number (default: 1)"),
      per_page: z
        .number()
        .optional()
        .describe("Number of items per page (default: 20, max: 100)"),
    },
    handler: withErrorHandler(async (args) => {
      const result = await qiitaClient.getPaginated(
        "/api/v2/groups",
        args.page as number | undefined,
        args.per_page as number | undefined
      );
      return jsonResult({
        groups: result.data,
        totalCount: result.totalCount,
        nextPage: result.nextPage,
        prevPage: result.prevPage,
      });
    }),
  },
  {
    name: "create_group",
    description: "Create a new group (Qiita Team only)",
    schema: {
      name: z.string().describe("Group display name"),
      url_name: z.string().describe("Group URL name (unique identifier)"),
      private: z
        .boolean()
        .optional()
        .describe("Whether the group is private (default: false)"),
    },
    handler: withErrorHandler(async (args) => {
      const data = await qiitaClient.post("/api/v2/groups", {
        name: args.name,
        url_name: args.url_name,
        private: args.private ?? false,
      });
      return jsonResult(data);
    }),
  },
  {
    name: "get_group",
    description: "Get a specific group by URL name (Qiita Team only)",
    schema: {
      url_name: z.string().describe("Group URL name"),
    },
    handler: withErrorHandler(async (args) => {
      const data = await qiitaClient.get(
        `/api/v2/groups/${args.url_name as string}`
      );
      return jsonResult(data);
    }),
  },
  {
    name: "update_group",
    description: "Update a group (Qiita Team only)",
    schema: {
      url_name: z.string().describe("Group URL name to update"),
      name: z.string().optional().describe("New group display name"),
      private: z.boolean().optional().describe("Whether the group is private"),
    },
    handler: withErrorHandler(async (args) => {
      const urlName = args.url_name as string;
      const body: Record<string, unknown> = {};
      if (args.name !== undefined) body.name = args.name;
      if (args.private !== undefined) body.private = args.private;
      const data = await qiitaClient.patch(`/api/v2/groups/${urlName}`, body);
      return jsonResult(data);
    }),
  },
  {
    name: "delete_group",
    description: "Delete a group (Qiita Team only)",
    schema: {
      url_name: z.string().describe("Group URL name to delete"),
    },
    handler: withErrorHandler(async (args) => {
      await qiitaClient.delete(
        `/api/v2/groups/${args.url_name as string}`
      );
      return textResult("Group deleted successfully.");
    }),
  },
  {
    name: "list_group_members",
    description: "List members of a group (Qiita Team only)",
    schema: {
      url_name: z.string().describe("Group URL name"),
      page: z.number().optional().describe("Page number (default: 1)"),
      per_page: z
        .number()
        .optional()
        .describe("Number of items per page (default: 20, max: 100)"),
    },
    handler: withErrorHandler(async (args) => {
      const result = await qiitaClient.getPaginated(
        `/api/v2/groups/${args.url_name as string}/members`,
        args.page as number | undefined,
        args.per_page as number | undefined
      );
      return jsonResult({
        members: result.data,
        totalCount: result.totalCount,
        nextPage: result.nextPage,
        prevPage: result.prevPage,
      });
    }),
  },
  {
    name: "add_group_member",
    description: "Add members to a group (Qiita Team only)",
    schema: {
      url_name: z.string().describe("Group URL name"),
      user_ids: z
        .array(z.string())
        .describe("Array of user IDs to add to the group"),
    },
    handler: withErrorHandler(async (args) => {
      const data = await qiitaClient.put(
        `/api/v2/groups/${args.url_name as string}/members`,
        { user_ids: args.user_ids }
      );
      return jsonResult(data);
    }),
  },
  {
    name: "remove_group_member",
    description: "Remove a member from a group (Qiita Team only)",
    schema: {
      url_name: z.string().describe("Group URL name"),
      user_id: z.string().describe("User ID to remove from the group"),
    },
    handler: withErrorHandler(async (args) => {
      await qiitaClient.delete(
        `/api/v2/groups/${args.url_name as string}/members/${args.user_id as string}`
      );
      return textResult("Group member removed successfully.");
    }),
  },
  {
    name: "get_group_member",
    description: "Get a specific member of a group (Qiita Team only)",
    schema: {
      url_name: z.string().describe("Group URL name"),
      user_id: z.string().describe("User ID"),
    },
    handler: withErrorHandler(async (args) => {
      const data = await qiitaClient.get(
        `/api/v2/groups/${args.url_name as string}/members/${args.user_id as string}`
      );
      return jsonResult(data);
    }),
  },
];
