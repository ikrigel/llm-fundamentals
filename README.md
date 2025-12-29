# LLM Fundamentals

A learning project to understand how to communicate with Large Language Models through APIs using Google Gemini.

## 🌐 Live Demo

Try the web app: **[https://ikrigel.github.io/llm-fundamentals/](https://ikrigel.github.io/llm-fundamentals/)**

## Project Setup Instructions

1. Clone the repo
2. Install dependencies with `npm install`
3. Create a `.env` file and add your Gemini API key (see below)
4. Run the script with `node main.js`

## Gemini API Setup Instructions

Guide: https://ai.google.dev/gemini-api/docs/quickstart#javascript

- You will need an API key which you can get for free here: https://aistudio.google.com/app/apikey?
- Press the Create API Key button on the top right

Create a `.env` file and **add the API key there**, like this:
`GEMINI_API_KEY=your_api_key_here`

You can reduce token usage (hence increase your rate limit) by disabling thinking:

```
config: {
  thinkingConfig: {
    thinkingBudget: 0, // Disables thinking
  },
}
```

## 🎯 Features

### Web App (GUI)
- Interactive sentiment analysis tool
- Real-time review analysis using Gemini AI
- Token usage tracking
- Responsive design
- API key stored locally in browser

### Node.js Script (CLI)
- Command-line sentiment analysis
- Demonstrates basic API integration

## Tasks

### 1. Simple LLM Request via API

- Implement the TODOs in `main.js`
- Run the script with `node main.js`
- You should see "Alert the author!" printed to the console

### 2. Token tracking

- Add a log showing the input & output tokens used
- ✅ Implemented in the web app!
