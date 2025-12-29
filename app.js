// DOM elements
const apiKeyInput = document.getElementById('api-key');
const reviewTextArea = document.getElementById('review-text');
const analyzeBtn = document.getElementById('analyze-btn');
const resultDiv = document.getElementById('result');
const llmResponseDiv = document.getElementById('llm-response');
const sentimentDiv = document.getElementById('sentiment');
const tokenInfoDiv = document.getElementById('token-info');
const errorDiv = document.getElementById('error');
const loadingDiv = document.getElementById('loading');

// Load API key from localStorage if it exists
window.addEventListener('DOMContentLoaded', () => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }
});

// Save API key to localStorage when it changes
apiKeyInput.addEventListener('change', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
        localStorage.setItem('gemini_api_key', apiKey);
    }
});

// Analyze button click handler
analyzeBtn.addEventListener('click', analyzeReview);

// Allow Enter key in textarea with Ctrl/Cmd
reviewTextArea.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        analyzeReview();
    }
});

async function analyzeReview() {
    const apiKey = apiKeyInput.value.trim();
    const reviewText = reviewTextArea.value.trim();

    // Validation
    if (!apiKey) {
        showError('Please enter your Gemini API key');
        return;
    }

    if (!reviewText) {
        showError('Please enter a review to analyze');
        return;
    }

    // Hide previous results and errors
    hideAll();
    showLoading();
    analyzeBtn.disabled = true;

    try {
        // Call Gemini API
        const result = await callGeminiAPI(apiKey, reviewText);

        // Display results
        displayResults(result);
    } catch (error) {
        showError(error.message || 'An error occurred while analyzing the review');
    } finally {
        hideLoading();
        analyzeBtn.disabled = false;
    }
}

async function callGeminiAPI(apiKey, reviewText) {
    const prompt = `Is the following a positive or negative review?\n"${reviewText}"`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response from API');
    }

    return {
        text: data.candidates[0].content.parts[0].text,
        usageMetadata: data.usageMetadata
    };
}

function displayResults(result) {
    const responseText = result.text;
    const isPositive = responseText.toLowerCase().includes('positive');

    // Display LLM response
    llmResponseDiv.textContent = responseText;

    // Display sentiment
    sentimentDiv.textContent = isPositive ? '✓ Celebrate! (Positive Review)' : '⚠ Alert the author! (Negative Review)';
    sentimentDiv.className = `sentiment ${isPositive ? 'positive' : 'negative'}`;

    // Display token usage if available
    if (result.usageMetadata) {
        const { promptTokenCount, candidatesTokenCount, totalTokenCount } = result.usageMetadata;
        tokenInfoDiv.innerHTML = `
            <strong>Token Usage:</strong><br>
            Input: ${promptTokenCount || 'N/A'} tokens |
            Output: ${candidatesTokenCount || 'N/A'} tokens |
            Total: ${totalTokenCount || 'N/A'} tokens
        `;
    } else {
        tokenInfoDiv.innerHTML = '<strong>Token Usage:</strong> Not available';
    }

    // Show result
    resultDiv.classList.remove('hidden');
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function showLoading() {
    loadingDiv.classList.remove('hidden');
}

function hideLoading() {
    loadingDiv.classList.add('hidden');
}

function hideAll() {
    resultDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    loadingDiv.classList.add('hidden');
}
