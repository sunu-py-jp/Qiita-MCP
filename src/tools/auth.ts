import { z } from "zod";
import type { ToolDefinition } from "../types.js";
import { jsonResult, textResult } from "../types.js";
import { qiitaClient } from "../client.js";
import { withErrorHandler } from "../errors.js";

export const authTools: ToolDefinition[] = [
  {
    name: "create_access_token",
    description: "Create a new access token by exchanging an authorization code",
    schema: {
      client_id: z.string().describe("OAuth application client ID"),
      client_secret: z.string().describe("OAuth application client secret"),
      code: z.string().describe("Authorization code received from OAuth flow"),
    },
    handler: withErrorHandler(async (args) => {
      const data = await qiitaClient.post("/access_tokens", {
        client_id: args.client_id,
        client_secret: args.client_secret,
        code: args.code,
      });
      return jsonResult(data);
    }),
  },
  {
    name: "delete_access_token",
    description: "Revoke an access token",
    schema: {
      access_token: z.string().describe("Access token to revoke"),
    },
    handler: withErrorHandler(async (args) => {
      await qiitaClient.delete(
        `/access_tokens/${args.access_token as string}`
      );
      return textResult("Access token deleted successfully.");
    }),
  },
  {
    name: "create_team_access_token",
    description:
      "Create a new team access token by exchanging an authorization code",
    schema: {
      client_id: z.string().describe("OAuth application client ID"),
      client_secret: z.string().describe("OAuth application client secret"),
      code: z.string().describe("Authorization code received from OAuth flow"),
    },
    handler: withErrorHandler(async (args) => {
      const data = await qiitaClient.post("/team_access_tokens", {
        client_id: args.client_id,
        client_secret: args.client_secret,
        code: args.code,
      });
      return jsonResult(data);
    }),
  },
  {
    name: "delete_team_access_token",
    description: "Revoke a team access token",
    schema: {
      team_access_token: z.string().describe("Team access token to revoke"),
    },
    handler: withErrorHandler(async (args) => {
      await qiitaClient.delete(
        `/team_access_tokens/${args.team_access_token as string}`
      );
      return textResult("Team access token deleted successfully.");
    }),
  },
];
