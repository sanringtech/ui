export const mcpTranslations = {
  'mcp.page.description':
    'Starts an MCP server over stdio so AI coding agents — Claude Code, Cursor, Windsurf — can query and install Sanring UI components directly, without shelling out.',
  'mcp.overview.title': 'Overview',
  'mcp.overview.body':
    'The sanring mcp command starts an MCP server over stdio. It reads from the same component registry as the sanring CLI and this documentation site, and exposes five tools an AI agent can call to inspect, plan, and install components in your Angular project.',
  'mcp.tools.title': 'Tools',
  'mcp.tools.body':
    'All tool handlers validate their input at runtime and return an MCP error result — rather than throwing — when a component name is not found or a required argument is missing.',
  'mcp.setup.title': 'Claude Code setup',
  'mcp.setup.body':
    'Add this to your project or global MCP config (e.g. .claude/mcp.json) and restart the agent.',

} as const;
