export const mcpTranslations = {
  'mcp.page.description':
    '以 stdio transport 啟動 MCP server，讓 Claude Code、Cursor、Windsurf 等 AI coding agent 能直接查詢、安裝 Sanring UI 元件，不用手動下 shell 指令。',
  'mcp.overview.title': '概覽',
  'mcp.overview.body':
    'sanring mcp 指令會以 stdio transport 啟動 MCP server，讀取跟 sanring CLI 及這個文件站相同的元件 registry，並曝露五個 tool，讓 AI agent 能查詢、預覽、安裝你 Angular 專案裡的元件。',
  'mcp.tools.title': '可用的 Tool',
  'mcp.tools.body':
    '所有 tool 都有 runtime input validation；找不到元件或缺少必要參數時，會回傳 MCP error result，而不是直接丟出例外。',
  'mcp.setup.title': 'Claude Code 設定',
  'mcp.setup.body':
    '把以下內容加進專案或全域的 MCP 設定檔（例如 .claude/mcp.json），再重啟 agent 即可。',

} as const;
