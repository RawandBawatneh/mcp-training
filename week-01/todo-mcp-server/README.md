# To-Do List MCP Server

This project is a simple Model Context Protocol (MCP) server built with Node.js, TypeScript, the official MCP TypeScript SDK, and stdio transport.

It exposes one tool named `create_todo` and stores todo items in memory for the current process only.

## Features

- Official MCP TypeScript SDK
- stdio transport for MCP Inspector and other local MCP clients
- Zod schema validation for tool inputs
- In-memory todo storage
- Clear validation and runtime error handling

## Installation

From the repository root, move into the project folder:

```powershell
cd mcp-training\week-01\todo-mcp-server
```

Install dependencies:

```powershell
npm install
```

## Build

Compile the TypeScript source:

```powershell
npm run build
```

The compiled JavaScript will be written to `dist/index.js`.

## Run the server

Start the MCP server after building it:

```powershell
npm start
```

This launches the server over stdio. Do not use `console.log` for normal output because stdout is reserved for MCP protocol messages.

## Launch MCP Inspector

Use the provided npm script from the project folder:

```powershell
npm run inspect
```

That script builds the project and launches MCP Inspector against the compiled server:

```powershell
npx -y @modelcontextprotocol/inspector node dist/index.js
```

## Tool

### `create_todo`

Input schema:

- `title`: required string
- `description`: optional string

Validation rules:

- `title` is required
- `title` must not be empty after trimming
- `title` must be between 3 and 120 characters
- `description` is optional

### Valid input

```json
{
  "title": "Finish MCP assignment",
  "description": "Test the create_todo tool using MCP Inspector"
}
```

### Example successful response

```json
{
  "success": true,
  "message": "Task created successfully",
  "todo": {
    "id": 1,
    "title": "Finish MCP assignment",
    "description": "Test the create_todo tool using MCP Inspector",
    "completed": false
  }
}
```

### Invalid input examples

Empty object:

```json
{}
```

Empty title:

```json
{
  "title": ""
}
```

Too-short title:

```json
{
  "title": "Hi"
}
```

## Expected results

- MCP Inspector lists the `create_todo` tool.
- A valid call returns a success response with the new todo item.
- An invalid call returns a schema-validation error.

## MCP Inspector test steps

1. Run `npm run inspect`.
2. Open MCP Inspector in the browser.
3. Connect to the local stdio server.
4. Open the Tools section.
5. Confirm that `create_todo` appears in the tools list.
6. Call `create_todo` with valid input.
7. Call `create_todo` with invalid input such as `{}`.

## Screenshot checklist

- Inspector showing the connected server
- Tools tab showing `create_todo`
- Successful `create_todo` call with valid input
- Validation error from calling `create_todo` with invalid input
