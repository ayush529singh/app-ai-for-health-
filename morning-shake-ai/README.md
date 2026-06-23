# Morning Protein Shake AI

Morning Protein Shake AI is a beginner-friendly full-stack web app that helps users create and understand healthy morning protein shake recipes. The frontend is built with HTML, CSS, and vanilla JavaScript. The backend uses Node.js, Express.js, and the Gemini API.

## Features

- Clean mobile-responsive fitness and health UI
- AI question box for protein shake and nutrition questions
- Loading animation while the AI is generating an answer
- Recipe cards for banana, peanut butter, oats, and fruit smoothie ideas
- Express API endpoint: `POST /ask-ai`
- Gemini prompt behavior for recipe suggestions, ingredient benefits, calorie/protein estimates, goal-based alternatives, follow-up questions, and safe medical boundaries

## Project structure

```text
morning-shake-ai/
  frontend/
    index.html
    style.css
    script.js
  backend/
    server.js
    package.json
    .env.example
    .env        # create locally; ignored by Git
  README.md
```

## Gemini API configuration

1. Create or copy a Gemini API key from Google AI Studio.
2. Copy `backend/.env.example` to `backend/.env`.
3. Replace the placeholder value in `backend/.env`:

```env
GEMINI_API_KEY=your_real_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
PORT=3000
```

Keep `backend/.env` on the backend only. It is ignored by Git so real API keys are not committed. Do not paste your Gemini API key into frontend files.

## Install dependencies

From the project root:

```bash
cd morning-shake-ai/backend
npm install
```

## Run the backend

```bash
cd morning-shake-ai/backend
npm start
```

The backend runs at:

```text
http://localhost:3000
```

## Run the frontend

Open `morning-shake-ai/frontend/index.html` in your browser, or serve it with a simple local server:

```bash
cd morning-shake-ai/frontend
python3 -m http.server 8080
```

Then visit:

```text
http://localhost:8080
```

## Example question

```text
Create a peanut butter banana protein shake for muscle gain and estimate calories and protein.
```

## API endpoint

### `POST /ask-ai`

Request body:

```json
{
  "prompt": "Suggest a weight-loss friendly berry protein shake."
}
```

Response body:

```json
{
  "answer": "AI-generated nutrition guidance appears here."
}
```
