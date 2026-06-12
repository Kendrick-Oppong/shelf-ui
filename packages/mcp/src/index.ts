#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const REGISTRY_URL = "https://shelfui.dev/r";

const server = new McpServer({
  name: "Shelf UI",
  version: "1.0.0",
});

// Tool: Search Components
server.registerTool(
  "search_components",
  {
    description: "Search the Shelf UI component registry for components",
    inputSchema: {
      query: z
        .string()
        .optional()
        .describe(
          "Optional keyword to filter components (e.g., 'upload', 'dropzone')"
        ),
    },
  },
  async (args: { query?: string }) => {
    const { query } = args;
    try {
      const response = await fetch(`${REGISTRY_URL}/registry.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch registry: ${response.statusText}`);
      }

      const registry = (await response.json()) as {
        items?: { name: string; title?: string; description?: string }[];
      };
      const items = registry.items || [];

      let results = items;
      if (query) {
        const q = query.toLowerCase();
        results = items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.title?.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q)
        );
      }

      if (results.length === 0) {
        return {
          content: [
            { type: "text", text: `No components found matching "${query}".` },
          ],
        };
      }

      const formattedResults = results
        .map((item) => {
          const titlePart = item.title ? ` (${item.title})` : "";
          return `- ${item.name}${titlePart}: ${item.description || "No description"}`;
        })
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: `Found ${results.length} components:\n\n${formattedResults}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error searching components: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Get Component
server.registerTool(
  "get_component",
  {
    description:
      "Fetch detailed schema and source code for a specific Shelf UI component",
    inputSchema: {
      name: z
        .string()
        .describe("The exact name of the component (e.g., 'dropzone')"),
    },
  },
  async (args: { name: string }) => {
    const { name } = args;
    try {
      const response = await fetch(`${REGISTRY_URL}/${name}.json`);
      if (!response.ok) {
        if (response.status === 404) {
          return {
            content: [
              {
                type: "text",
                text: `Component "${name}" not found in registry.`,
              },
            ],
            isError: true,
          };
        }
        throw new Error(`Failed to fetch component: ${response.statusText}`);
      }

      const componentData = await response.json();
      return {
        content: [
          { type: "text", text: JSON.stringify(componentData, null, 2) },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching component: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Get Install Command
server.registerTool(
  "get_install_command",
  {
    description:
      "Generate the shadcn CLI command to install a Shelf UI component",
    inputSchema: {
      name: z.string().describe("The name of the component to install"),
      packageManager: z
        .enum(["npm", "pnpm", "yarn", "bun"])
        .optional()
        .describe("The package manager to use (defaults to npx)"),
    },
  },
  (args: {
    name: string;
    packageManager?: "npm" | "pnpm" | "yarn" | "bun";
  }) => {
    const { name, packageManager } = args;
    const url = `${REGISTRY_URL}/${name}.json`;
    let command = "";

    switch (packageManager) {
      case "pnpm":
        command = `pnpm dlx shadcn@latest add ${url}`;
        break;
      case "yarn":
        command = `yarn dlx shadcn@latest add ${url}`;
        break;
      case "bun":
        command = `bunx shadcn@latest add ${url}`;
        break;
      default:
        command = `npx shadcn@latest add ${url}`;
        break;
    }

    return {
      content: [
        {
          type: "text",
          text: `To install the ${name} component, run:\n\n\`\`\`bash\n${command}\n\`\`\`\n\nMake sure your project has shadcn initialized and you are running this from the root of your project.`,
        },
      ],
    };
  }
);

// Tool: List Adapters
server.registerTool(
  "list_adapters",
  {
    description: "List supported storage adapters for Shelf UI",
  },
  () => {
    const adapters = [
      {
        name: "Firebase Storage",
        description: "Google's Firebase Cloud Storage",
      },
      {
        name: "Supabase Storage",
        description: "Supabase's S3-compatible storage",
      },
      { name: "AWS S3", description: "Amazon Simple Storage Service" },
      {
        name: "Cloudinary",
        description: "Cloudinary image and video management",
      },
      { name: "Azure Blob", description: "Microsoft Azure Blob Storage" },
      {
        name: "ImageKit",
        description: "ImageKit.io image optimization and delivery",
      },
      {
        name: "Uploadthing",
        description: "File uploads for Next.js developers",
      },
    ];

    const formatted = adapters
      .map((a) => `- ${a.name}: ${a.description}`)
      .join("\n");
    return {
      content: [
        {
          type: "text",
          text: `Shelf UI currently supports the following storage adapters:\n\n${formatted}`,
        },
      ],
    };
  }
);

try {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Shelf UI MCP Server running on stdio");
} catch (error) {
  console.error("Fatal error:", error);
  process.exit(1);
}
