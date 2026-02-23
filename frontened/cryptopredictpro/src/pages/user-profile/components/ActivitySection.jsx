import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivitySection = ({ user }) => {
  const activityData = [
    {
      id: 1,
      action: 'Account Login',
      timestamp: user?.lastLogin,
      device: 'Chrome on Windows',
      location: 'New York, USA',
      status: 'success'
    },
    {
      id: 2,
      action: 'Profile Viewed',
      timestamp: '2025-01-11T12:30:00Z',
      device: 'Chrome on Windows',
      location: 'New York, USA',
      status: 'info'
    },
    {
      id: 3,
      action: 'Dashboard Access',
      timestamp: '2025-01-11T11:45:00Z',
      device: 'Chrome on Windows',
      location: 'New York, USA',
      status: 'info'
    },
    {
      id: 4,
      action: 'Prediction Generated',
      timestamp: '2025-01-11T10:15:00Z',
      device: 'Chrome on Windows',
      location: 'New York, USA',
      status: 'success'
    },
    {
      id: 5,
      action: 'Account Created',
      timestamp: user?.createdAt,
      device: 'Chrome on Windows',
      location: 'New York, USA',
      status: 'success'
    }
  ];

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'warning':
        return { icon: 'AlertTriangle', color: 'text-warning' };
      case 'error':
        return { icon: 'XCircle', color: 'text-error' };
      default:
        return { icon: 'Info', color: 'text-primary' };
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-card p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Recent Activity
        </h2>
        <div className="text-sm text-muted-foreground">
          Last 30 days
        </div>
      </div>
      <div className="space-y-4">
        {activityData?.map((activity) => {
          const statusConfig = getStatusIcon(activity?.status);
          
          return (
            <div key={activity?.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
              <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${statusConfig?.color}`}>
                <Icon name={statusConfig?.icon} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {activity?.action}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(activity?.timestamp)}
                  </span>
                </div>
                
                <div className="mt-1 flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Icon name="Monitor" size={12} className="mr-1" />
                    {activity?.device}
                  </div>
                  <div className="flex items-center">
                    <Icon name="MapPin" size={12} className="mr-1" />
                    {activity?.location}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default ActivitySection;