import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const greetInputSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string." })
    .trim()
    .min(1, "Name cannot be empty.")
    .describe("A required name value used for validation."),
});

const introduceMeInputSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string." })
    .trim()
    .min(1, "Name cannot be empty.")
    .describe("The name to use in the greeting."),
});

const server = new McpServer({
  name: "todo-mcp-server",
  version: "1.0.0",
});

function writeLog(message: string): void {
  process.stderr.write(`[todo-mcp-server] ${message}\n`);
}

function createTextResponse(text: string) {
  return {
    content: [
      {
        type: "text" as const,
        text,
      },
    ],
  };
}

server.registerTool(
  "greet",
  {
    description: "Greet Rawand Bawatneh using a validated name input.",
    inputSchema: greetInputSchema,
  },
  async () => {
    return createTextResponse("Hello, Rawand Bawatneh!");
  },
);

server.registerTool(
  "introduce_me",
  {
    description: "Introduce the server and mention its creator.",
    inputSchema: introduceMeInputSchema,
  },
  async (input) => {
    return createTextResponse(
      `Hello ${input.name}! This MCP server was created by Rawand Bawatneh.`,
    );
  },
);

async function main(): Promise<void> {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    writeLog(
      `Fatal startup error: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

void main();
