import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

type TodoItem = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
};

type CreateTodoResponse = {
  success: true;
  message: string;
  todo: TodoItem;
};

const todoInputSchema = {
  title: z.string().trim().min(3, "Title must be at least 3 characters long.").max(120, "Title must be at most 120 characters long."),
  description: z.string().trim().max(500, "Description must be at most 500 characters long.").optional(),
};

const server = new McpServer({
  name: "todo-mcp-server",
  version: "1.0.0",
});

const todos: TodoItem[] = [];

function writeLog(message: string): void {
  process.stderr.write(`[todo-mcp-server] ${message}\n`);
}

function buildResponse(todo: TodoItem): CreateTodoResponse {
  return {
    success: true,
    message: "Task created successfully",
    todo,
  };
}

server.registerTool(
  "create_todo",
  {
    description: "Create a new todo item.",
    inputSchema: todoInputSchema,
  },
  async (input) => {
    try {
      const nextTodo: TodoItem = {
        id: todos.length + 1,
        title: input.title.trim(),
        completed: false,
      };

      if (typeof input.description === "string") {
        nextTodo.description = input.description.trim();
      }

      todos.push(nextTodo);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(buildResponse(nextTodo), null, 2),
          },
        ],
      };
    } catch (error) {
      writeLog(`create_todo failed: ${error instanceof Error ? error.message : String(error)}`);
      throw new Error("Failed to create todo item.");
    }
  }
);

async function main(): Promise<void> {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    writeLog("Server connected over stdio.");
  } catch (error) {
    writeLog(`Fatal startup error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

void main();