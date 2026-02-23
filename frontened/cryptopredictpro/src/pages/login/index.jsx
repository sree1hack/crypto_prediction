import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthCard from './components/AuthCard';
import ErrorMessage from './components/ErrorMessage';
import LoadingOverlay from './components/LoadingOverlay';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const navigate = useNavigate();

  // Mock existing user data for successful authentication
  const mockExistingUsers = [
    {
      id: "user_123456789",
      email: "john.doe@gmail.com",
      name: "John Doe",
      provider: "google",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      createdAt: "2024-01-15T10:30:00Z",
      lastLogin: new Date()?.toISOString(),
      isNewUser: false
    },
    {
      id: "user_987654321",
      email: "jane.smith@gmail.com",
      name: "Jane Smith",
      provider: "google",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      createdAt: "2024-02-20T14:15:00Z",
      lastLogin: new Date()?.toISOString(),
      isNewUser: false
    }
  ];

  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('cryptoUser');
    if (savedUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    setShowLoadingOverlay(true);

    try {
      // Simulate OAuth popup delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockGoogleResponse = {
        id: "google_" + Math.random().toString(36).substr(2, 9),
        email: "user_" + Math.random().toString(36).substr(2, 5) + "@gmail.com",
        name: "Google User",
        avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
      };

      const result = await loginWithGoogle(mockGoogleResponse);

      if (result.success) {
        localStorage.setItem('cryptoUser', JSON.stringify(result.user));
        localStorage.setItem('authToken', 'v_jwt_' + Date.now());
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Connection to auth server failed. Is the backend running?");
    } finally {
      setIsLoading(false);
      setShowLoadingOverlay(false);
    }
  };

  const handleDismissError = () => {
    setError('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>

      {/* Main Content */}
      <div className="relative w-full max-w-md">
        {/* Back to Landing */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </div>

        {/* Error Message */}
        <ErrorMessage
          error={error}
          onDismiss={handleDismissError}
        />

        {/* Authentication Card */}
        <AuthCard
          onGoogleLogin={handleGoogleLogin}
          isLoading={isLoading}
        />

        {/* Don't have account */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/sign-up" className="text-primary hover:underline font-medium">
              Create one here
            </Link>
          </p>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground">
            New to cryptocurrency trading?{' '}
            <Link to="/" className="text-primary hover:underline">
              Learn more about our predictions
            </Link>
          </p>
        </div>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={showLoadingOverlay}
        message="Authenticating with Google..."
      />
    </div>
  );
};

export default Login;