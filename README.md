# Wage Predictor Backend

This project is a NestJS backend for a wage prediction app. It does two jobs:

1. It turns a user's free-text description into structured profile data with Groq.
2. It sends that structured data to an external prediction API and returns the predicted wage.

The server runs on port `3001` and enables CORS so a separate frontend can call it directly.

## What The API Does

### `POST /wage/analyze`

Accepts free text and asks Groq to extract these fields:

- `age`
- `years_experience`
- `education`
- `gender`
- `country`
- `industry`

It also asks the model to return:

- `missingFields`: fields that were not clearly detected
- `nextQuestion`: a follow-up question to help collect missing information

Example request:

```json
{
  "text": "I am a 29-year-old male software engineer from Belgium with 5 years of experience and a bachelor's degree."
}
```

Example response shape:

```json
{
  "age": "25-29",
  "years_experience": "4-5",
  "education": "Bachelor's degree",
  "gender": "Male",
  "country": "Belgium",
  "industry": "Computers/Technology",
  "missingFields": [],
  "nextQuestion": null
}
```

### `POST /wage/predict`

Accepts structured input and forwards it to the deployed prediction service at `https://plumber-api-2-latest.onrender.com/predict`.

Request body:

```json
{
  "age": "25-29",
  "experienceYears": "4-5",
  "education": "Bachelor's degree",
  "gender": "Male",
  "country": "Belgium",
  "industry": "Computers/Technology"
}
```

Response shape:

```json
{
  "predictedWage": 52340
}
```

## How It Works

### Analyze flow

1. The frontend sends free text to `POST /wage/analyze`.
2. `WageService.extractInfo()` sends that text to Groq's chat completions API.
3. The prompt tells the model to normalize the user's details into fixed buckets and categories.
4. The backend parses the returned JSON and sends it back to the caller.

### Prediction flow

1. The frontend sends structured data to `POST /wage/predict`.
2. `WageService.predictWage()` forwards that payload to the external prediction API.
3. The backend returns the `predictedWage` value from that service.
4. If the upstream service fails, the backend returns an HTTP error with the upstream status when available.

## Tech Stack

- NestJS
- TypeScript
- Axios
- class-validator
- Groq chat completions API
- External prediction service hosted on Render

## Environment Variables

Create a `.env` file in the project root with:

```env
GROQ_API_KEY=your_groq_api_key
```

This key is required for the `/wage/analyze` endpoint.

## Installation

```bash
npm install
```

## Running The Project

```bash
# development
npm run start:dev

# standard start
npm run start

# production build
npm run build
npm run start:prod
```

The application listens on:

```text
http://localhost:3001
```

## Available Scripts

```bash
npm run build
npm run start
npm run start:dev
npm run start:debug
npm run start:prod
npm run lint
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e
```

## Project Structure

```text
src/
  app.module.ts
  main.ts
  wage/
    dto/structured-input.dto.ts
    wage.controller.ts
    wage.module.ts
    wage.service.ts
test/
  app.e2e-spec.ts
```

## Important Notes

- `main.ts` loads environment variables with `dotenv`, enables CORS, and starts the app on port `3001`.
- The analyze endpoint returns `years_experience`, while the predict endpoint expects `experienceYears`. If another client consumes both endpoints, it needs to map that field name before calling `/wage/predict`.
- Validation decorators exist on `StructuredInputDTO`, but global Nest validation is not currently enabled in `main.ts`.
- The backend does not perform model training locally. It acts as an orchestration layer between the frontend, Groq, and the external prediction service.

## Current Root Route

`GET /` returns:

```text
Hello World!
```
