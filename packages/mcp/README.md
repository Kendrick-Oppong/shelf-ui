# @shelf-ui/mcp

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for [Shelf UI](https://shelf-ui.vercel.app) — gives AI tools like Cursor, Claude Desktop, and Windsurf direct access to the Shelf UI component registry.

## What it does

Once connected, your AI assistant can:

- **Search components** — find Shelf UI components by keyword
- **Get component details** — fetch the full schema and source of any component
- **Generate install commands** — produce the correct `shadcn` CLI command for any package manager
- **List storage adapters** — see which upload backends are supported (Firebase, S3, Supabase, etc.)

## Installation & Setup

### Cursor

The easiest way to install it in Cursor is through the UI:
1. Open **Cursor Settings** > **Features** > **MCP Servers**
2. Click **+ Add New MCP Server**
3. Name: `shelf-ui`
4. Type: `command`
5. Command: `npx -y @shelf-ui/mcp`

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "shelf-ui": {
      "command": "npx",
      "args": ["-y", "@shelf-ui/mcp"]
    }
  }
}
```

### Windsurf

Add to your Windsurf MCP settings:

```json
{
  "mcpServers": {
    "shelf-ui": {
      "command": "npx",
      "args": ["-y", "@shelf-ui/mcp"]
    }
  }
}
```

### Other IDEs

Any MCP-compatible client can connect using:

```json
{
  "mcpServers": {
    "shelf-ui": {
      "command": "npx",
      "args": ["-y", "@shelf-ui/mcp"]
    }
  }
}
```

## Available Tools

| Tool | Description |
|---|---|
| `search_components` | Search the Shelf UI registry by keyword |
| `get_component` | Fetch the full schema for a specific component |
| `get_install_command` | Generate the shadcn CLI install command |
| `list_adapters` | List supported storage adapters |

## Requirements

- Node.js 18+

## License

MIT
