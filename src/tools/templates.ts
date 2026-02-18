import { z } from "zod";
import type { ToolDefinition } from "../types.js";
import { jsonResult, textResult } from "../types.js";
import { qiitaClient } from "../client.js";
import { withErrorHandler } from "../errors.js";

const tagSchema = z.object({
  name: z.string(),
  versions: z.array(z.string()).optional(),
});

export const templateTools: ToolDefinition[] = [
  {
    name: "list_templates",
    description: "List templates (Qiita Team only)",
    schema: {
      page: z.number().optional().describe("Page number (default: 1)"),
      per_page: z
        .number()
        .optional()
        .describe("Number of items per page (default: 20, max: 100)"),
    },
    handler: withErrorHandler(async (args) => {
      const result = await qiitaClient.getPaginated(
        "/templates",
        args.page as number | undefined,
        args.per_page as number | undefined
      );
      return jsonResult({
        templates: result.data,
        totalCount: result.totalCount,
        nextPage: result.nextPage,
        prevPage: result.prevPage,
      });
    }),
  },
  {
    name: "create_template",
    description: "Create a new template (Qiita Team only)",
    schema: {
      title: z.string().describe("Template title"),
      body: z.string().describe("Template body in Markdown"),
      tags: z
        .array(tagSchema)
        .describe("Tags (array of {name, versions?})"),
    },
    handler: withErrorHandler(async (args) => {
      const data = await qiitaClient.post("/templates", {
        title: args.title,
        body: args.body,
        tags: args.tags,
      });
      return jsonResult(data);
    }),
  },
  {
    name: "get_template",
    description: "Get a specific template by ID (Qiita Team only)",
    schema: {
      template_id: z.string().describe("Template ID"),
    },
    handler: withErrorHandler(async (args) => {
      const data = await qiitaClient.get(
        `/templates/${args.template_id as string}`
      );
      return jsonResult(data);
    }),
  },
  {
    name: "update_template",
    description: "Update an existing template (Qiita Team only)",
    schema: {
      template_id: z.string().describe("Template ID to update"),
      title: z.string().optional().describe("New template title"),
      body: z.string().optional().describe("New template body in Markdown"),
      tags: z
        .array(tagSchema)
        .optional()
        .describe("New tags (array of {name, versions?})"),
    },
    handler: withErrorHandler(async (args) => {
      const templateId = args.template_id as string;
      const body: Record<string, unknown> = {};
      if (args.title !== undefined) body.title = args.title;
      if (args.body !== undefined) body.body = args.body;
      if (args.tags !== undefined) body.tags = args.tags;
      const data = await qiitaClient.patch(
        `/templates/${templateId}`,
        body
      );
      return jsonResult(data);
    }),
  },
  {
    name: "delete_template",
    description: "Delete a template (Qiita Team only)",
    schema: {
      template_id: z.string().describe("Template ID to delete"),
    },
    handler: withErrorHandler(async (args) => {
      await qiitaClient.delete(
        `/templates/${args.template_id as string}`
      );
      return textResult("Template deleted successfully.");
    }),
  },
  {
    name: "expand_template",
    description:
      "Expand template variables in the given body and tags (Qiita Team only)",
    schema: {
      body: z
        .string()
        .describe("Template body containing variables to expand"),
      tags: z
        .array(tagSchema)
        .describe("Tags (array of {name, versions?})"),
    },
    handler: withErrorHandler(async (args) => {
      const data = await qiitaClient.post("/expanded_templates", {
        body: args.body,
        tags: args.tags,
      });
      return jsonResult(data);
    }),
  },
];
