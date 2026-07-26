# Weather Briefing MCP Server — Week 2 Design

## 1. Pitch

The Weather Briefing MCP Server helps users quickly understand current and upcoming weather conditions for a specific location. It is designed for people who want a short and practical weather summary instead of reading raw weather data. The server exposes focused MCP tools for retrieving current conditions, checking forecasts, and creating an easy-to-understand weather briefing. It will support live weather data when internet access is available and local fixture data for a reliable offline Demo Day presentation.

## 2. User and Demo Story

During Demo Day, the user asks: “What is the weather in Ramallah today, and should I carry an umbrella tomorrow?” The model first calls `get_current_weather` to retrieve the current temperature, humidity, wind speed, and general weather condition. It then calls `get_weather_forecast` to check tomorrow’s expected temperature range and precipitation probability. Finally, the model calls `create_weather_briefing` to produce a short answer explaining today’s conditions, tomorrow’s forecast, and a practical recommendation about carrying an umbrella. If internet access is unavailable, the same conversation will be demonstrated using local fixture data.

## 3. Tool Inventory

The project contains five planned MCP tools.

Exactly three tools are marked as **P0** because they are required for Demo Day. The remaining two tools are marked as **P1** because they are optional improvements.

### 3.1 `get_current_weather`

**Description:**  
Returns the current weather conditions for a specified location. The tool should be used when the user asks about the weather right now.

**Inputs:**

- `location: string` — the city or location requested by the user.
- `units?: "celsius" | "fahrenheit"` — the preferred temperature unit. The default value is `celsius`.

**Output shape:**

```text
{
  location,
  observed_at,
  temperature,
  feels_like,
  condition,
  humidity,
  wind_speed,
  units,
  source
}
```

**Priority:** P0

---

### 3.2 `get_weather_forecast`

**Description:**  
Returns a daily weather forecast for a specified location and number of days. The tool should be used when the user asks about tomorrow, the weekend, or upcoming weather conditions.

**Inputs:**

- `location: string` — the city or location requested by the user.
- `days: number` — the number of forecast days, from one to five.
- `units?: "celsius" | "fahrenheit"` — the preferred temperature unit. The default value is `celsius`.

**Output shape:**

```text
{
  location,
  forecast: [
    {
      date,
      min_temperature,
      max_temperature,
      condition,
      precipitation_probability,
      wind_speed
    }
  ],
  units,
  source
}
```

**Priority:** P0

---

### 3.3 `create_weather_briefing`

**Description:**  
Creates a short and practical weather briefing using current and forecast weather data. The tool highlights important conditions and provides recommendations supported by the returned weather information.

**Inputs:**

- `location: string` — the city or location requested by the user.
- `days?: number` — the number of days to include in the briefing. The default value is one day.
- `units?: "celsius" | "fahrenheit"` — the preferred temperature unit. The default value is `celsius`.

**Output shape:**

```text
{
  location,
  summary,
  highlights: string[],
  recommendations: string[],
  generated_at,
  source
}
```

**Priority:** P0

---

### 3.4 `get_weather_alerts`

**Description:**  
Returns active weather warnings or alerts for a specified location when alert information is available.

**Inputs:**

- `location: string` — the city or location requested by the user.

**Output shape:**

```text
{
  location,
  alerts: [
    {
      title,
      severity,
      description,
      starts_at,
      ends_at
    }
  ],
  source
}
```

**Priority:** P1

This tool is optional and may remain a stub if the selected free weather data source does not provide reliable alert data.

---

### 3.5 `compare_weather_conditions`

**Description:**  
Compares weather conditions between two locations for the same day. It can help the user decide which location is warmer, rainier, or windier.

**Inputs:**

- `first_location: string` — the first location to compare.
- `second_location: string` — the second location to compare.
- `date?: string` — the comparison date. The default value is the current date.

**Output shape:**

```text
{
  first_location,
  second_location,
  comparison,
  warmer_location,
  rainier_location,
  windier_location
}
```

**Priority:** P1

This tool is optional and will be implemented only after the three P0 tools are complete and tested.

## 4. Data and Offline Demo Strategy

The project will support two weather-data modes.

### Live Mode

Live mode retrieves current weather information from a free weather data source when internet access is available.

The project will not depend on a paid API subscription. Any configuration values will be stored in environment variables and will not be committed to the repository.

### Offline Demo Mode

Offline demo mode reads predictable weather records from local JSON fixture files stored inside the project.

The fixture data will use the same internal structure as live weather data. This allows the tools to produce consistent outputs in both modes.

Example fixture data:

```json
{
  "location": "Ramallah, Palestine",
  "observed_at": "2026-07-26T09:00:00+03:00",
  "temperature": 24,
  "feels_like": 25,
  "condition": "Partly cloudy",
  "humidity": 55,
  "wind_speed": 12,
  "units": "celsius",
  "source": "offline_fixture"
}
```

Offline mode ensures that the complete Demo Day conversation can still be presented if the internet connection or external weather service is unavailable.

## 5. Tool Design Decisions

Each MCP tool performs one clear action only.

Tool names use the `verb_noun` pattern and `snake_case`, such as:

- `get_current_weather`
- `get_weather_forecast`
- `create_weather_briefing`

The three P0 tools are read-oriented and will not modify stored user data.

Tool descriptions explain:

- What the tool does.
- When the model should use it.
- What information it returns.

The tools will return structured outputs so that the model can reliably understand the weather data and create a useful response.

## 6. Error Handling

The tools will return clear and honest errors instead of incomplete or invented weather information.

Expected error cases include:

- A missing location.
- An unknown location.
- An ambiguous location name.
- An invalid number of forecast days.
- An unsupported temperature unit.
- A network timeout.
- An unavailable weather provider.
- Invalid or incomplete data returned by the provider.

Example error output:

```json
{
  "isError": true,
  "code": "LOCATION_NOT_FOUND",
  "message": "Weather data could not be found for the provided location.",
  "suggestion": "Provide a city together with its country or region."
}
```

Each successful response will also return the resolved location and the data source. This helps prevent the model from presenting weather information for the wrong location.

## 7. Out of Scope

The first version of the Weather Briefing MCP Server will not include:

- User authentication, registration, or account management.
- Paid weather APIs or premium weather services.
- A mobile application or complete web user interface.
- Long-term historical weather or climate analysis.
- Interactive weather maps, radar images, or satellite images.
- Permanent storage of user locations or weather preferences.
- Email, SMS, or mobile push notifications.
- Emergency weather monitoring or guaranteed safety alerts.

These features are excluded to keep the project small enough to complete and demonstrate within the available four-week build period.

## 8. Demo Day Success Criteria

- [ ] `get_current_weather` returns structured current-weather data for a known fixture location and returns a clear error for an invalid location.

- [ ] `get_weather_forecast` returns the requested number of forecast days, including dates, temperature ranges, weather conditions, precipitation probabilities, and wind speeds.

- [ ] `create_weather_briefing` produces a short and useful summary with data-supported recommendations, and the complete demonstration works without internet access by using local fixture data.

## 9. Risks and Mitigations

### Risk 1: Weather Data Source Failure

The external weather source may be unavailable, slow, blocked, or unreliable during Demo Day. This could prevent live weather requests from completing successfully.

**Mitigation:**

- Add a timeout to external requests.
- Return a clear error when the provider is unavailable.
- Keep local JSON fixture data for a complete offline demonstration.
- Test both live and offline modes before Demo Day.

### Risk 2: Ambiguous or Invalid Locations

A location name may be misspelled, unsupported, or shared by multiple cities. This could cause the server to return incorrect weather information or fail to resolve the location.

**Mitigation:**

- Validate that the location input is not empty.
- Return the resolved city and country in every successful response.
- Ask for a country or region when the location is ambiguous.
- Return a clear `LOCATION_NOT_FOUND` error when no valid location is found.

## 10. Approval Status

This document defines the proposed scope of the Weather Briefing MCP Server.

**Current status:** Pending mentor approval.

Week 3 data wiring and implementation will not begin until the mentor approves this design or the requested changes are completed and merged.