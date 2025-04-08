# PhoenixAI: Your AI-powered Assistant

![PhoenixAI Logo](src/assets/gemini_icon.png)

PhoenixAI is a modern web application that provides an intuitive interface for interacting with AI. Powered by Google's Generative AI, it offers a user-friendly chat experience with advanced features including voice recognition, image uploads, and theme customization.

## Features

- **AI-Powered Chat**: Communicate with an advanced AI assistant that can answer questions, provide information, and assist with various tasks
- **User Authentication**: Secure login/signup system with email/password, Google, and GitHub authentication options
- **Voice Recognition**: Speak your commands and questions instead of typing
- **Image Upload**: Share images with the AI for analysis and discussion
- **Responsive Design**: Beautiful UI that works across devices of all sizes
- **Theme Toggle**: Switch between light and dark modes for comfortable viewing in any environment
- **User Profiles**: Customize your profile with a picture and personal information
- **Protected Routes**: Secure content accessible only to authenticated users

## Technologies Used

- **Frontend**: React 19, React Router, CSS
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **AI Integration**: Google Generative AI API
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Google Generative AI API key

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/phoenixai.git
   cd phoenixai
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with your API keys:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server
   ```
   npm run dev
   ```

### Building for Production

```
npm run build
```

## Usage

1. Visit the landing page and sign up for an account or log in with existing credentials
2. Use the chat interface to interact with the AI assistant
3. Try voice commands by clicking the microphone icon
4. Upload images to share with the AI
5. Customize your profile by visiting the profile page
6. Enjoy the AI assistant's responses and have meaningful conversations

## Project Structure

```
phoenixAI/
├── public/            # Public assets
├── src/
│   ├── assets/        # Images and static files
│   ├── components/    # React components
│   │   ├── auth/      # Authentication components
│   │   ├── landing/   # Landing page components
│   │   ├── main/      # Main chat interface
│   │   ├── profile/   # User profile components
│   │   └── sidebar/   # Sidebar navigation
│   ├── config/        # Configuration files
│   ├── context/       # React context providers
│   ├── firebase/      # Firebase configuration and hooks
│   ├── App.jsx        # Main application component
│   └── main.jsx       # Entry point
└── package.json       # Project dependencies and scripts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
