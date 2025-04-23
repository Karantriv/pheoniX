/**
 * Custom response configuration
 * This file contains patterns and responses for custom messages
 * that should be displayed instead of calling the Gemini API.
 * 
 * Each entry contains:
 * - pattern: Regular expression pattern to match against user input
 * - response: The custom response to display
 * - exact: Boolean flag indicating if the match should be exact (default: false)
 */

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
    response: (userName) => `Hello${userName ? ' ' + userName : ''}! I'm Phoenix, your AI Ally. Awaiting your order?`,
    exact: false
  },
  {
    // Easter egg
    pattern: /^phoenix$/i,
    response: "Yes, that's me! Phoenix at your service. How can I help you today?",
    exact: true
  },
  {
    // Easter egg
    pattern: /^Who created you$/i,
    response: " Karan Trivedi created me. Gemini gave me brains, he gave me style. Awaiting orders, Captain. Tell me if you want to contact him",
    exact: true
  },
  {
    // Easter egg
    pattern: /^I want to contact him$/i,
    response: "You can contact him at trivedikaran896@gmail.com or informally @karan.triv on instagram",
    exact: true
  },
  {
    // Easter egg
    pattern: /^Who is Harsh Raj Sharma$/i,
    response: "",
    exact: true
  },
  {
    // Easter egg
    pattern: /^$/i,
    response: "",
    exact: true
  },
  {
    // Easter egg
    pattern: /^Who is the best girl ever$/i,
    response: "She is Kavya Agnihotri my creator's girlfriend ",
    exact: true
  },
  {
    // Easter egg
    pattern: /^Tell me something about kavya$/i,
    response: "She is the most young and jolly girl you will ever meet and she has the bestest smile and hairs in the whole world. And due to my relations with my creator I cannot describe her further.",
    exact: true
  },
  {
    // Easter egg
    pattern: /^How can I contact kavya?$/i,
    response: "My owner doesn't want you to contact her mind your own business creep",
    exact: true
  }
];

/**
 * Function to check if a message matches any custom response patterns
 * @param {string} message - The user's message
 * @param {Object} context - Context data (like userName) that can be used in responses
 * @returns {string|null} - The custom response if a match is found, null otherwise
 */
export function getCustomResponse(message, context = {}) {
  if (!message || typeof message !== 'string') {
    return null;
  }

  const trimmedMessage = message.trim();
  
  for (const item of customResponses) {
    const { pattern, response, exact = false } = item;
    
    // Skip if pattern is not a valid regex
    if (!(pattern instanceof RegExp)) {
      console.warn('Invalid pattern in customResponses:', pattern);
      continue;
    }
    
    // Check if message matches the pattern
    const matches = exact 
      ? pattern.test(trimmedMessage) && trimmedMessage.length === pattern.source.replace(/^\^|\$$/g, '').length
      : pattern.test(trimmedMessage);
    
    if (matches) {
      // If response is a function, call it with context
      if (typeof response === 'function') {
        return response(context.userName);
      }
      return response;
    }
  }
  
  return null; // No match found
}

export default customResponses; 