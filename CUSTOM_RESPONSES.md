# Custom AI Responses in Phoenix

## Overview

Phoenix has been enhanced with a custom response system that allows it to provide predetermined answers to specific user queries before falling back to the Gemini API. This is particularly useful for:

1. Changing the AI's identity from "Gemini" to "Phoenix"
2. Providing consistent responses to common questions
3. Implementing special features or easter eggs

## How It Works

The system intercepts each user message and:
1. Checks if it matches any predefined patterns in the custom responses list
2. If a match is found, uses the custom response instead of calling the Gemini API
3. If no match is found, forwards the message to the Gemini API as usual

## Configuration

Custom responses are defined in `src/config/customResponses.js`. Each response definition includes:

- `pattern`: A regular expression that matches user input
- `response`: The custom response text or a function that returns the response
- `exact`: Boolean flag indicating if the pattern must match the entire message (default: false)

### Example Custom Responses

Currently, Phoenix is configured with these custom responses:

```javascript
const customResponses = [
  {
    // Match any question about the AI's name or identity
    pattern: /(?:what(?:'s| is) your name|who are you|your name|call you)/i,
    response: "I am Phoenix, your AI assistant. I'm here to help you with any questions or tasks you might have.",
    exact: false
  },
  {
    // Match greeting and include user's name if available
    pattern: /^(?:hi|hello|hey|greetings|good morning|good afternoon|good evening)(?:\s|$)/i,
    response: (userName) => `Hello${userName ? ' ' + userName : ''}! I'm Phoenix, your AI assistant. How can I help you today?`,
    exact: false
  },
  {
    // Easter egg
    pattern: /^phoenix$/i,
    response: "Yes, that's me! Phoenix at your service. How can I help you today?",
    exact: true
  }
];
```

## Adding New Custom Responses

To add new custom responses, edit the `customResponses` array in `src/config/customResponses.js`:

1. Define a new pattern using a JavaScript regular expression
2. Provide a response string or a function that returns a string
3. Set `exact: true` if you want the entire message to match the pattern

Example:

```javascript
{
  pattern: /what time is it|current time/i,
  response: () => `The current time is ${new Date().toLocaleTimeString()}.`,
  exact: false
}
```

## Implementation Details

The custom response system is implemented in two files:

1. `src/config/customResponses.js` - Contains the response definitions and matching logic
2. `src/context/Context.jsx` - Intercepts user messages and checks for custom responses

## Future Enhancements

Potential improvements to the custom response system:

- Add support for more complex context-aware responses
- Implement a conversation memory system for multi-turn custom interactions
- Add support for multimedia responses (images, formatted text, etc.)
- Create an admin interface for managing custom responses without code changes 