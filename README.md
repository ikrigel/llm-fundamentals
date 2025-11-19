# Gemini API Setup Instructions

Guide: https://ai.google.dev/gemini-api/docs/quickstart#javascript
- You will need an API key which you can get for free here: https://aistudio.google.com/app/apikey?
- Press the Create API Key button on the top right

Create a `.env` file and **add the API key there**, like this:
```GEMINI_API_KEY=your_api_key_here```

You can reduce token usage (hence increase your rate limit) by disabling thinking:
```
config: {
  thinkingConfig: {
    thinkingBudget: 0, // Disables thinking
  },
}
```
