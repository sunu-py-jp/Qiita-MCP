import type { ToolDefinition } from "./types.js";

type GroupMapping = Record<string, { read: string[]; write: string[] }>;

const GROUP_MAPPING: GroupMapping = {
  auth: {
    read: [],
    write: [
      "create_access_token",
      "delete_access_token",
      "create_team_access_token",
      "delete_team_access_token",
    ],
  },
  authenticated_user: {
    read: ["get_authenticated_user", "list_authenticated_user_items"],
    write: [],
  },
  items: {
    read: [
      "list_items",
      "get_item",
      "list_user_items",
      "list_user_stocks",
      "list_item_stockers",
    ],
    write: [
      "create_item",
      "update_item",
      "delete_item",
      "stock_item",
      "unstock_item",
      "import_item",
    ],
  },
  comments: {
    read: ["list_item_comments", "get_comment"],
    write: [
      "create_comment",
      "update_comment",
      "delete_comment",
      "import_comment",
    ],
  },
  tags: {
    read: ["list_tags", "get_tag", "list_tag_items", "list_user_following_tags"],
    write: ["follow_tag", "unfollow_tag", "create_tagging", "delete_tagging"],
  },
  users: {
    read: [
      "list_users",
      "get_user",
      "list_user_followees",
      "list_user_followers",
      "check_user_following",
      "list_item_likes",
      "check_item_stock",
    ],
    write: ["follow_user", "unfollow_user"],
  },
  reactions: {
    read: ["list_item_reactions", "list_comment_reactions"],
    write: [
      "create_item_reaction",
      "delete_item_reaction",
      "create_comment_reaction",
      "delete_comment_reaction",
      "create_project_comment_reaction",
    ],
  },
  teams: {
    read: [
      "list_teams",
      "list_team_memberships",
      "list_team_invitations",
    ],
    write: [
      "create_team_invitation",
      "delete_team_invitation",
      "remove_team_member",
    ],
  },
  groups: {
    read: [
      "list_groups",
      "get_group",
      "list_group_members",
      "get_group_member",
    ],
    write: [
      "create_group",
      "update_group",
      "delete_group",
      "add_group_member",
      "remove_group_member",
    ],
  },
  templates: {
    read: ["list_templates", "get_template"],
    write: [
      "create_template",
      "update_template",
      "delete_template",
      "expand_template",
    ],
  },
};

/** All tool names defined in the group mapping. */
function allToolNames(): Set<string> {
  const names = new Set<string>();
  for (const group of Object.values(GROUP_MAPPING)) {
    for (const name of group.read) names.add(name);
    for (const name of group.write) names.add(name);
  }
  return names;
}

/**
 * Parse QIITA_ENABLED_GROUPS and return the set of enabled tool names.
 * - undefined / empty → all tools enabled
 * - "items:read" → only items read tools
 * - "items" → items read + write
 */
export function parseEnabledGroups(
  envValue: string | undefined,
): Set<string> {
  if (!envValue || envValue.trim() === "") {
    return allToolNames();
  }

  const enabled = new Set<string>();
  const entries = envValue.split(",").map((s) => s.trim()).filter(Boolean);

  for (const entry of entries) {
    const [category, operation] = entry.split(":");
    const group = GROUP_MAPPING[category];
    if (!group) continue;

    if (operation === "read") {
      for (const name of group.read) enabled.add(name);
    } else if (operation === "write") {
      for (const name of group.write) enabled.add(name);
    } else {
      // category only → both read and write
      for (const name of group.read) enabled.add(name);
      for (const name of group.write) enabled.add(name);
    }
  }

  return enabled;
}

/**
 * Parse QIITA_DISABLED_TOOLS and return the set of tool names to exclude.
 */
export function parseDisabledTools(
  envValue: string | undefined,
): Set<string> {
  if (!envValue || envValue.trim() === "") {
    return new Set();
  }
  return new Set(
    envValue.split(",").map((s) => s.trim()).filter(Boolean),
  );
}

/**
 * Filter tools based on QIITA_ENABLED_GROUPS and QIITA_DISABLED_TOOLS.
 */
export function filterTools(tools: ToolDefinition[]): ToolDefinition[] {
  const enabled = parseEnabledGroups(process.env.QIITA_ENABLED_GROUPS);
  const disabled = parseDisabledTools(process.env.QIITA_DISABLED_TOOLS);

  return tools.filter(
    (tool) => enabled.has(tool.name) && !disabled.has(tool.name),
  );
}
