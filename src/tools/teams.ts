import { z } from "zod";
import type { ToolDefinition } from "../types.js";
import { jsonResult, textResult } from "../types.js";
import { qiitaClient } from "../client.js";
import { withErrorHandler } from "../errors.js";

export const teamTools: ToolDefinition[] = [
  {
    name: "list_teams",
    description: "List teams the authenticated user belongs to",
    schema: {},
    handler: withErrorHandler(async () => {
      const data = await qiitaClient.get("/teams");
      return jsonResult(data);
    }),
  },
  {
    name: "list_team_memberships",
    description: "List team memberships (Qiita Team only)",
    schema: {
      page: z.number().optional().describe("Page number (default: 1)"),
      per_page: z
        .number()
        .optional()
        .describe("Number of items per page (default: 20, max: 100)"),
    },
    handler: withErrorHandler(async (args) => {
      const result = await qiitaClient.getPaginated(
        "/team_memberships",
        args.page as number | undefined,
        args.per_page as number | undefined
      );
      return jsonResult({
        memberships: result.data,
        totalCount: result.totalCount,
        nextPage: result.nextPage,
        prevPage: result.prevPage,
      });
    }),
  },
  {
    name: "list_team_invitations",
    description: "List pending team invitations (Qiita Team only)",
    schema: {
      page: z.number().optional().describe("Page number (default: 1)"),
      per_page: z
        .number()
        .optional()
        .describe("Number of items per page (default: 20, max: 100)"),
    },
    handler: withErrorHandler(async (args) => {
      const result = await qiitaClient.getPaginated(
        "/team_invitations",
        args.page as number | undefined,
        args.per_page as number | undefined
      );
      return jsonResult({
        invitations: result.data,
        totalCount: result.totalCount,
        nextPage: result.nextPage,
        prevPage: result.prevPage,
      });
    }),
  },
  {
    name: "create_team_invitation",
    description: "Invite a user to the team by email (Qiita Team only)",
    schema: {
      email: z.string().describe("Email address to invite"),
    },
    handler: withErrorHandler(async (args) => {
      const data = await qiitaClient.post("/team_invitations", {
        email: args.email,
      });
      return jsonResult(data);
    }),
  },
  {
    name: "delete_team_invitation",
    description: "Cancel a pending team invitation (Qiita Team only)",
    schema: {
      email: z.string().describe("Email address of the invitation to cancel"),
    },
    handler: withErrorHandler(async (args) => {
      await qiitaClient.delete(
        `/team_invitations/${encodeURIComponent(args.email as string)}`
      );
      return textResult("Team invitation deleted successfully.");
    }),
  },
  {
    name: "remove_team_member",
    description: "Remove a member from the team (Qiita Team only)",
    schema: {
      user_id: z.string().describe("User ID of the member to remove"),
    },
    handler: withErrorHandler(async (args) => {
      await qiitaClient.delete(
        `/remove_team_member/${args.user_id as string}`
      );
      return textResult("Team member removed successfully.");
    }),
  },
];
