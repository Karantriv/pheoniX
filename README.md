# Phoenix AI Chat Application

![Phoenix Logo](./src/assets/gemini_icon.png)

Phoenix is a modern AI chat application built with React and Firebase, featuring a beautiful UI with Three.js animations. The application allows users to interact with AI models, manage chat history, and personalize their experience.

## ✨ Features

- **Immersive UI** - Beautiful 3D animated background using Three.js
- **User Authentication** - Email/password, Google, and GitHub login options
- **Chat Functionality** - Real-time AI chat with message history
- **Profile Management** - Customize your display name
- **Responsive Design** - Works on desktop and mobile devices
- **Dark Mode Support** - Automatic theme detection based on system preferences

## 🚀 Live Demo

[Visit Phoenix AI Chat](https://phoenix-ai-chat.web.app) *(Replace with your actual deployment URL)*

## 🔧 Tech Stack

- **Frontend**: React 19, React Router v7
- **AI Integration**: Google Generative AI (@google/generative-ai)
- **3D Graphics**: Three.js with React Three Fiber & Drei
- **Authentication & Database**: Firebase (Authentication, Firestore, Storage)
- **Styling**: CSS with responsive design
- **Build Tool**: Vite
- **Deployment**: Firebase Hosting

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Firebase account

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Karantriv/phoeniX.git
   cd phoenix
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Set up Authentication (Email/Password, Google, and GitHub providers)
   - Create a Firestore database
   - Set up Storage

4. Create a `.env` file in the root directory:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 🔥 Deployment

### Firebase Deployment

1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize your project:
   ```bash
   firebase init
   ```
   - Select Hosting
   - Choose your Firebase project
   - Use `dist` as your public directory
   - Configure as a single-page app
   - Set up GitHub Actions (optional)

4. Build your project:
   ```bash
   npm run build
   ```

5. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

### Other Deployment Options

The application can also be deployed to platforms like:
- Vercel
- Netlify
- GitHub Pages
- AWS Amplify

For these platforms, follow their respective documentation for deploying Vite-built applications.

## 📁 Project Structure

```
phoenix/
├── public/           # Static assets
├── src/
│   ├── assets/       # Images and icons
│   │   ├── auth/     # Authentication components
│   │   ├── landing/  # Landing page components
│   │   ├── main/     # Main chat interface
│   │   ├── profile/  # User profile components
│   │   └── sidebar/  # Sidebar navigation
│   ├── context/      # React context for state management
│   ├── firebase/     # Firebase configuration and utilities
│   ├── styles/       # Global CSS files
│   ├── App.jsx       # Main application component
│   └── main.jsx      # Application entry point
├── .env              # Environment variables
├── package.json      # Dependencies and scripts
└── vite.config.js    # Vite configuration
```

## 🔒 Security

- **Authentication**: Uses Firebase Authentication for secure user management
- **Database Rules**: Implement proper Firestore security rules
- **Storage Rules**: Set up Firebase Storage rules to secure user uploads
- **API Keys**: Keep your API keys in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Karan Trivedi - [trivedikaran896@gmail.com](mailto:trivedikaran896@gmail.com)

Project Link: [https://github.com/Karantriv/phoeniX.git](https://github.com/Karantriv/phoeniX.git)

---

Made with ❤️ by [Karan Trivedi]
