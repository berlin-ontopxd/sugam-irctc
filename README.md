# sugam-irctc
Sugam IRCTC is an AI-powered, natural-language train booking prototype that explores simplifying railway booking workflows through conversational input in English and Hinglish, using OpenAI and Netlify Functions
div align="center">

# SUGAM IRCTC
### Simplifying railway-booking interactions through natural language

**An independent AI-assisted booking-interface prototype**

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-f7df1e?logo=javascript&logoColor=111)](#technology)
[![Netlify Functions](https://img.shields.io/badge/Backend-Netlify%20Functions-00ad9f?logo=netlify&logoColor=white)](#architecture)
[![Prototype](https://img.shields.io/badge/Status-Prototype-blue)](#scope-and-limitations)

</div>

> **Important:** Sugam is a prototype, not an official IRCTC service. Train availability, booking, payment, and PNR behaviour shown in the demo are simulated. It does not book real tickets.

## Overview

**SUGAM — Simplified Unified Guidance and Assistance for Mobility** explores a more conversational way to express railway journey requirements. Instead of completing every field manually, a user can enter a request in English or Hinglish and have the prototype convert it into structured booking-intent data.

The project explores the intersection of natural-language interfaces, structured AI output, and mobile-first user experience.

## The problem

Multi-step booking forms can require users to navigate several fields and selections. Sugam investigates whether a conversational input can make the initial journey-description step more intuitive.

## How it works

1. The user enters a journey request in the frontend.
2. The frontend sends the text to a Netlify serverless function.
3. The function calls the OpenAI Responses API using a server-side API key.
4. The model returns data constrained by a JSON schema.
5. The function applies deterministic station-code mappings for supported stations and returns structured data to the frontend.
6. The interface demonstrates a **mock** booking flow; it does not submit a real railway reservation.

## Features

- Natural-language request parsing for English/Hinglish-style input
- Structured output for journey, quota, class, and passenger fields
- Serverless parsing function on Netlify
- JSON-schema-constrained model output
- Known-station mapping and basic request-length validation
- Synthetic demonstration flow for prototype evaluation

## Architecture

```text
User
 │
 ▼
Frontend (index.html, styles.css, app.js)
 │  POST booking-intent text
 ▼
Netlify Function (netlify/functions/parse.js)
 │  OpenAI API request (server-side key)
 ▼
Structured JSON response
 │
 ▼
Frontend demo flow (mock data only)
```

## Technology

- HTML, CSS, JavaScript
- Netlify Functions
- Node.js (18 or newer)
- OpenAI Responses API (`gpt-4o-mini` in the current function)

## Run locally

### Prerequisites

- Node.js 18+
- npm
- A Netlify account for hosted deployment, or the Netlify CLI for local function testing
- An OpenAI API key if you want to test live intent parsing

### Install and start

```bash
npm install
npx netlify-cli dev
```

Open the local URL printed by Netlify CLI.

If you prefer to install the CLI globally, follow the official Netlify CLI documentation. The repository's `package.json` provides a `dev` script.

### Configure the API key

Set `OPENAI_API_KEY` as an environment variable in your local Netlify environment or in Netlify's site environment-variable settings. Never paste the key into `app.js`, HTML, a public repository, screenshots, or a commit.

For local development, use a local environment file only if your tooling supports it, ensure it is ignored by Git, and never commit it. If a key has ever been committed publicly, revoke it and create a replacement.

## Deployment

The repository includes `netlify.toml` with the static publish directory and serverless-function directory. To deploy, connect this repository to a **new/separate Netlify site** first and configure `OPENAI_API_KEY` in that site's environment variables.

Do not change the domain or existing Sugam deployment until the new deployment has been tested and you have a backup.

## Scope and limitations

- This repository is a demonstration prototype, not a live railway booking integration.
- The UI's availability, payment, and PNR results are synthetic/demo behaviour.
- The parser does not confirm live train schedules, fares, seat availability, or ticket status.
- Station-code mappings cover only a limited list and require validation for broader use.
- AI-generated fields must be reviewed and validated before any real-world use.
- Do not use real passenger data or sensitive personal information when testing.
- API usage may incur charges under the API account used for testing.

## Security and privacy

Please do not submit real passenger details, account credentials, payment data, or other sensitive information in issues or demo prompts. Keep API keys in server-side environment variables. See [SECURITY.md](SECURITY.md) for reporting security concerns.

## Project status

This repository is intended for learning, demonstration, and further development. Before describing a feature as working, verify it against the current source code and a successful test.

## Contributing

Suggestions and bug reports are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and use the issue templates where possible.

## Author

**Shubham Kashyap Jena**

- GitHub: [@berlin-ontopxd](https://github.com/berlin-ontopxd)
- Portfolio: [shubhamcodez.space](https://shubhamcodez.space)

## Disclaimer

Sugam is an independent project and is not affiliated with, endorsed by, or operated by IRCTC, Indian Railways, or any government department. All railway booking behaviour shown in the prototype is simulated.
