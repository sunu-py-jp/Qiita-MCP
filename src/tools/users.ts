import { z } from "zod";
import type { ToolDefinition } from "../types.js";
import { jsonResult, textResult } from "../types.js";
import { qiitaClient } from "../client.js";
import { QiitaNotFoundError, withErrorHandler } from "../errors.js";

export const userTools: ToolDefinition[] = [
  {
    name: "list_users",
    description: "List all users in recently created order",
    schema: {
      page: z.number().optional().describe("Page number (default: 1)"),
      per_page: z
        .number()
        .optional()
        .describe("Number of items per page (default: 20, max: 100)"),
    },
    handler: withErrorHandler(async (args) => {
      const page = args.page as number | undefined;
      const perPage = args.per_page as number | undefined;
      const result = await qiitaClient.getPaginated(
        "/api/v2/users",
        page,
        perPage
      );
      return jsonResult(result);
    }),
  },
  {
    name: "get_user",
    description: "Get a specific user by user ID",
    schema: {
      user_id: z.string().describe("User ID"),
    },
    handler: withErrorHandler(async (args) => {
      const userId = args.user_id as string;
      const result = await qiitaClient.get(`/api/v2/users/${userId}`);
      return jsonResult(result);
    }),
  },
  {
    name: "list_user_followees",
    description: "List users that the specified user is following",
    schema: {
      user_id: z.string().describe("User ID"),
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
      const result = await qiitaClient.getPaginated(
        `/api/v2/users/${userId}/followees`,
        page,
        perPage
      );
      return jsonResult(result);
    }),
  },
  {
    name: "list_user_followers",
    description: "List users who follow the specified user",
    schema: {
      user_id: z.string().describe("User ID"),
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
      const result = await qiitaClient.getPaginated(
        `/api/v2/users/${userId}/followers`,
        page,
        perPage
      );
      return jsonResult(result);
    }),
  },
  {
    name: "follow_user",
    description: "Follow a user",
    schema: {
      user_id: z.string().describe("User ID to follow"),
    },
    handler: withErrorHandler(async (args) => {
      const userId = args.user_id as string;
      await qiitaClient.put(`/api/v2/users/${userId}/following`);
      return textResult(`Successfully followed user: ${userId}`);
    }),
  },
  {
    name: "unfollow_user",
    description: "Unfollow a user",
    schema: {
      user_id: z.string().describe("User ID to unfollow"),
    },
    handler: withErrorHandler(async (args) => {
      const userId = args.user_id as string;
      await qiitaClient.delete(`/api/v2/users/${userId}/following`);
      return textResult(`Successfully unfollowed user: ${userId}`);
    }),
  },
  {
    name: "check_user_following",
    description:
      "Check if the authenticated user is following the specified user",
    schema: {
      user_id: z.string().describe("User ID to check"),
    },
    handler: withErrorHandler(async (args) => {
      const userId = args.user_id as string;
      try {
        await qiitaClient.get(`/api/v2/users/${userId}/following`);
        return textResult("Following");
      } catch (error) {
        if (error instanceof QiitaNotFoundError) {
          return textResult("Not following");
        }
        throw error;
      }
    }),
  },
  {
    name: "list_item_likes",
    description: "List likes on an item",
    schema: {
      item_id: z.string().describe("Item ID"),
    },
    handler: withErrorHandler(async (args) => {
      const itemId = args.item_id as string;
      const result = await qiitaClient.get(`/api/v2/items/${itemId}/likes`);
      return jsonResult(result);
    }),
  },
  {
    name: "check_item_stock",
    description: "Check if the authenticated user has stocked the item",
    schema: {
      item_id: z.string().describe("Item ID to check"),
    },
    handler: withErrorHandler(async (args) => {
      const itemId = args.item_id as string;
      try {
        await qiitaClient.get(`/api/v2/items/${itemId}/stock`);
        return textResult("Stocked");
      } catch (error) {
        if (error instanceof QiitaNotFoundError) {
          return textResult("Not stocked");
        }
        throw error;
      }
    }),
  },
];
