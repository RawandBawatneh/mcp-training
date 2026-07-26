# Tool Design Principles

This document explains the main principles for designing clear and reliable MCP tools for the Weather Briefing project.

## 1. One Job per Tool

Each tool should perform one specific action only.

A small and focused tool is easier for the model to understand, choose, and call correctly.

Bad example:

`manage_weather` — gets the current weather, returns forecasts, manages saved locations, and creates a weather briefing.

This tool is unclear because it performs several different actions.

Better examples:

- `get_current_weather(location)` — returns the current weather for a specific location.
- `get_weather_forecast(location, days)` — returns the weather forecast for a specific number of days.
- `create_weather_briefing(location)` — creates a short and clear weather summary.

Each tool has one clear responsibility.

## 2. Use Clear Tool Names

The tool name should clearly explain what the tool does.

A good tool name follows the `verb_noun` pattern:

- The verb describes the action.
- The noun describes the data or object used by the tool.

For example:

`get_current_weather`

- `get` is the verb.
- `current_weather` is the noun.

Tool names should also use `snake_case`, which means using lowercase letters and underscores between words.

Bad examples:

- `weather`
- `doWeather`
- `helper1`
- `process`

These names are vague and do not clearly explain the tool's action.

Better examples:

- `get_current_weather`
- `get_weather_forecast`
- `create_weather_briefing`
- `save_location`

These names clearly describe what each tool does.

## 3. Write Clear Tool Descriptions

A tool description helps the model understand:

1. What the tool does.
2. When the tool should be used.
3. What information the tool returns.

Bad description:

`Gets weather.`

This description is too short and does not explain enough information.

Better description:

`Returns the current weather conditions for a specified location, including temperature, humidity, wind speed, and weather condition. Use this tool when the user asks about the weather right now.`

Another example:

`Returns the weather forecast for a specified location and number of days. Use this tool when the user asks about future or upcoming weather conditions.`

A clear description helps the model choose the correct tool.

## 4. Read Tools and Mutation Tools

Tools can be divided into two main types: read tools and mutation tools.

### Read Tools

Read tools return information without changing any stored data.

Examples:

- `get_current_weather(location)` — returns the current weather.
- `get_weather_forecast(location, days)` — returns upcoming weather conditions.
- `list_saved_locations()` — returns the user's saved locations.

Read tools are usually safe to call multiple times because they do not add, update, or delete data.

### Mutation Tools

Mutation tools change stored data by adding, updating, or deleting something.

Examples:

- `save_location(location)` — adds a location to the user's saved locations.
- `update_weather_preferences(units)` — changes the user's preferred weather units.
- `delete_saved_location(location)` — removes a location from the user's saved locations.

The description of a mutation tool should clearly explain that it changes stored data.

## 5. Common Anti-Patterns

An anti-pattern is a bad design choice that makes a tool confusing or difficult to use correctly.

Common anti-patterns include:

- Creating one large tool that performs many different actions.
- Using vague names such as `process`, `helper`, or `weather_tool`.
- Using one input to switch between unrelated actions.
- Writing descriptions that do not explain when the tool should be used.
- Mixing read actions and mutation actions inside the same tool.

Bad example:

`manage_location(location, action)`

This tool may save, update, or delete a location depending on the value of `action`.

The model may not clearly understand which operation the tool performs.

Better design:

- `save_location(location)` — saves a new location.
- `update_saved_location(old_location, new_location)` — updates an existing location.
- `delete_saved_location(location)` — deletes a saved location.

Separating these actions makes every tool easier to understand and use.

## 6. Naming Drill

The following unclear tool names were changed into clear names using the `verb_noun` pattern and `snake_case`.

- `doThing` → `create_weather_briefing`
- `api` → `get_current_weather`
- `helper1` → `get_weather_forecast`

The new names are better because they clearly describe the action performed by each tool.
