import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import ProfileHeader from './components/ProfileHeader';
import AccountDetails from './components/AccountDetails';
import ActivitySection from './components/ActivitySection';
import SecuritySection from './components/SecuritySection';
import DataManagement from './components/DataManagement';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock user data - in real app this would come from authentication context
  const mockUser = {
    id: "user_2025_001",
    name: "John Anderson",
    email: "john.anderson@gmail.com",
    provider: "Google",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    createdAt: "2024-12-15T10:30:00Z",
    lastLogin: "2025-01-11T13:45:00Z",
    isVerified: true
  };

  useEffect(() => {
    // Simulate loading user data
    const loadUserData = async () => {
      try {
        // In real app, check authentication and fetch user data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Use mock data for demo
          setUser(mockUser);
          localStorage.setItem('user', JSON.stringify(mockUser));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Redirect to login if no user found
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={handleLogout} />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-muted-foreground">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={null} onLogout={handleLogout} />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Profile Not Found
            </h2>
            <p className="text-muted-foreground mb-4">
              Unable to load your profile information.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <button
              onClick={handleNavigateToDashboard}
              className="hover:text-foreground transition-smooth"
            >
              Dashboard
            </button>
            <Icon name="ChevronRight" size={16} />
            <span className="text-foreground font-medium">Profile</span>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              User Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your account information and security settings
            </p>
          </div>

          {/* Profile Content */}
          <div className="space-y-6">
            {/* Profile Header */}
            <ProfileHeader user={user} />

            {/* Two Column Layout for Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <AccountDetails user={user} />
                <ActivitySection user={user} />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <SecuritySection user={user} onLogout={handleLogout} />
                <DataManagement user={user} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 p-6 bg-card rounded-lg shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleNavigateToDashboard}
                className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
              >
                <Icon name="BarChart3" size={16} className="mr-2" />
                Go to Dashboard
              </button>
              <button
                onClick={() => window.location?.reload()}
                className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-smooth"
              >
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Refresh Profile
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;