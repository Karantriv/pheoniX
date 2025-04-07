import React from 'react'
import Sidebar from './components/sidebar/Sidebar';
import Main from './components/main/Main'
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './firebase/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginSignup from "./components/login-signup/LoginSignup";
import Profile from "./components/profile/Profile";
import "./App.css";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/" element={
            <PrivateRoute>
              <div className="protected-container">
                <Sidebar />
                <Main />
              </div>
            </PrivateRoute>
          }/>
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }/>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App