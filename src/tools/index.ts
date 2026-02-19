import type { ToolDefinition } from "../types.js";
import { filterTools } from "../tool-filter.js";
import { authTools } from "./auth.js";
import { authenticatedUserTools } from "./authenticated-user.js";
import { itemTools } from "./items.js";
import { commentTools } from "./comments.js";
import { tagTools } from "./tags.js";
import { userTools } from "./users.js";
import { reactionTools } from "./reactions.js";
import { teamTools } from "./teams.js";
import { groupTools } from "./groups.js";
import { templateTools } from "./templates.js";

export const allTools: ToolDefinition[] = filterTools([
  ...authTools,
  ...authenticatedUserTools,
  ...itemTools,
  ...commentTools,
  ...tagTools,
  ...userTools,
  ...reactionTools,
  ...teamTools,
  ...groupTools,
  ...templateTools,
]);
