import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import CryptoSelector from './components/CryptoSelector';
import TimeframeSelector from './components/TimeframeSelector';
import PredictionControls from './components/PredictionControls';
import PredictionChart from './components/PredictionChart';
import PredictionSummary from './components/PredictionSummary';
import DashboardStats from './components/DashboardStats';
import Icon from '../../components/AppIcon';
import { getLivePrediction, formatINRPrice, getUserStats } from '../../services/predictionApi';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('');
  const [loading, setLoading] = useState(false);
  const [predictionData, setPredictionData] = useState([]);
  const [predictionSummary, setPredictionSummary] = useState(null);
  const [lastPrediction, setLastPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalPredictions: 0, accuracyRate: 0, history: [] });

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('cryptoUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch real stats and history
  const fetchStats = async () => {
    if (user?.id) {
      const data = await getUserStats(user.id);
      if (data.success) {
        setStats(data);
      }
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
  }, [user]);

  const handlePredict = async () => {
    if (!selectedCrypto || !selectedTimeframe) {
      setError('Please select both cryptocurrency and timeframe');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getLivePrediction(selectedCrypto, selectedTimeframe);

      if (response?.success) {
        setPredictionData(response?.chartData || []);
        setPredictionSummary(response?.summary);

        setLastPrediction({
          crypto: selectedCrypto,
          timeframe: selectedTimeframe,
          timestamp: response?.prediction?.timestamp,
          currentPrice: response?.prediction?.currentPrice,
          predictedPrice: response?.prediction?.predictedPrice,
          confidence: response?.prediction?.confidence
        });

        fetchStats(); // Refresh stats after new prediction
      } else {
        setError(response?.error || 'Failed to generate prediction');
      }
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err?.message || 'Failed to generate prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cryptoUser');
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Icon name="User" size={24} color="var(--color-primary)" />
          </div>
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-muted-foreground">
                  Generate AI-powered cryptocurrency price predictions with real-time Binance data in INR.
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Calendar" size={16} />
                <span>{new Date()?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <DashboardStats
            user={user}
            totalPredictions={stats.totalPredictions}
            accuracyRate={stats.accuracyRate}
            lastActivity={stats.history.length > 0 ? `Last: ${stats.history[0].coin} (${new Date(stats.history[0].timestamp).toLocaleTimeString()})` : "No predictions yet"}
          />

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error flex items-center">
              <Icon name="AlertCircle" size={20} className="mr-3" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Last Prediction Summary */}
          {lastPrediction && !loading && (
            <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg text-success flex items-center justify-between">
              <div className="flex items-center">
                <Icon name="CheckCircle" size={20} className="mr-3" />
                <div>
                  <span className="font-bold">Latest Result: {lastPrediction?.crypto}</span>
                  <p className="text-sm opacity-90">
                    {formatINRPrice(lastPrediction?.currentPrice)} → {formatINRPrice(lastPrediction?.predictedPrice)}
                    ({lastPrediction?.confidence}% confidence)
                  </p>
                </div>
              </div>
              <span className="text-xs opacity-70">
                {new Date(lastPrediction?.timestamp)?.toLocaleString()}
              </span>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <CryptoSelector selectedCrypto={selectedCrypto} onCryptoChange={setSelectedCrypto} loading={loading} />
              <TimeframeSelector selectedTimeframe={selectedTimeframe} onTimeframeChange={setSelectedTimeframe} loading={loading} />
              <PredictionControls selectedCrypto={selectedCrypto} selectedTimeframe={selectedTimeframe} onPredict={handlePredict} loading={loading} lastPrediction={lastPrediction} />
            </div>

            <div className="space-y-6">
              <PredictionChart predictionData={predictionData} loading={loading} selectedCrypto={selectedCrypto} />
              <PredictionSummary predictionSummary={predictionSummary} loading={loading} selectedCrypto={selectedCrypto} selectedTimeframe={selectedTimeframe} />
            </div>
          </div>

          {/* Prediction History Table */}
          <div className="mt-12 bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
              <h3 className="text-xl font-bold text-foreground">Prediction History</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Icon name="History" size={16} className="mr-2" />
                <span>Last 10 sessions</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Asset</th>
                    <th className="px-6 py-4 font-semibold">Timeframe</th>
                    <th className="px-6 py-4 font-semibold">Price at Entry</th>
                    <th className="px-6 py-4 font-semibold">AI Prediction</th>
                    <th className="px-6 py-4 font-semibold">Confidence</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats.history.length > 0 ? stats.history.map((item, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors text-sm">
                      <td className="px-6 py-4 font-bold text-foreground">{item.coin}</td>
                      <td className="px-6 py-4 capitalize">{item.timeframe}</td>
                      <td className="px-6 py-4">{formatINRPrice(item.current_price)}</td>
                      <td className="px-6 py-4 font-semibold text-primary">{formatINRPrice(item.predicted_price)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg font-medium">
                          {item.confidence}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground italic">
                        No prediction history found. Start forecasting to see your results!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center mb-4 md:mb-0">
              <Icon name="Shield" size={16} color="var(--color-success)" className="mr-2" />
              <span>Predictions powered by LSTM Neural Networks & Real-time Binance Data</span>
            </div>
            <div className="flex items-center space-x-6">
              <span>Updated: {new Date().toLocaleTimeString()}</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-success rounded-full mr-2 shadow-[0_0_8px_var(--color-success)]"></div>
                <span>Live Marketplace Connection</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;