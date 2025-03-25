import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY is not defined in environment variables');
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(API_KEY);

// Get the generative model for text chat
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Get the multimodal model for image processing
const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Create a single chat instance that persists
let chatSession = null;

// Helper function to convert image file to base64 data URL
async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
  
  return {
    inlineData: { 
      data: await base64EncodedDataPromise,
      mimeType: file.type
    },
  };
}

// Function to run multimodal chat (text + image)
async function runMultiModal(prompt, imageFile) {
  try {
    // Convert image to required format
    const imagePart = await fileToGenerativePart(imageFile);
    
    // Create a prompt with text and image
    const result = await visionModel.generateContent([prompt, imagePart]);
    const response = await result.response;
    
    console.log("Vision model response:", response.text());
    
    return response.text();
  } catch (error) {
    console.error("Error in multimodal chat:", error);
    throw error;
  }
}

// Function to run the text-only chat
async function runChat(prompt, chatHistory = []) {
  try {
      // If no chat session exists or we're starting a new chat, create a new session
      if (!chatSession) {
          chatSession = model.startChat({
              generationConfig,
              safetySettings,
              history: chatHistory.map(entry => ({
                  role: entry.role,
                  parts: [{ text: entry.content }]
              })),
          });
      }

      // Send the user's prompt and get the response
      const result = await chatSession.sendMessage(prompt);
      const response = result.response;
      console.log(response.text());

      // Return the response text
      return response.text();
  } catch (error) {
      console.error("Error during chat:", error);
      throw error;
  }
}

// Reset chat session for new conversation
function resetChat() {
  chatSession = null;
}

export default runChat;
export { runMultiModal, resetChat };