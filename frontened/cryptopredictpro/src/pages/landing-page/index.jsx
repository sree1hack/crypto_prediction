import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const LandingPage = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('cryptoUser');
    if (savedUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Icon name="TrendingUp" size={24} color="white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              CryptoPredictPro
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/login">
              <Button size="sm" className="rounded-full bg-white text-black hover:bg-white/90 px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-success rounded-full animate-ping"></span>
            <span>Market Prediction Engine v2.0 is Live</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
            Predict the Future of
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x">
              Crypto Assets
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Harness the power of deep learning and real-time Binance analytics to stay ahead
            of the market. Professional-grade predictions at your fingertips.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/login">
              <Button size="lg" className="rounded-full px-10 h-14 text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
                Start Forecasting Now
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
            </Link>
            <div className="flex -space-x-3 items-center ml-4">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} className="w-10 h-10 rounded-full border-2 border-[#030712]" src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
              ))}
              <span className="ml-6 text-sm text-white/40">+2.4k traders joined</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Glassmorphism cards */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <Icon name="Brain" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Deep Learning</h3>
              <p className="text-white/50 leading-relaxed">
                LSTM neural networks trained on years of historical data to identify complex recurring patterns in price action.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform">
                <Icon name="Zap" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Real-Time Sync</h3>
              <p className="text-white/50 leading-relaxed">
                Direct integration with Binance exchange for millisecond-perfect data synchronization and instant analysis.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500">
              <div className="w-12 h-12 bg-success/20 rounded-2xl flex items-center justify-center mb-6 text-success group-hover:scale-110 transition-transform">
                <Icon name="ShieldCheck" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Statistically Verified</h3>
              <p className="text-white/50 leading-relaxed">
                Transparent confidence scores and historical accuracy tracking for every asset we predict.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:row justify-between items-center opacity-40">
          <span className="text-sm">© 2024 CryptoPredictPro. Advanced AI Analytics.</span>
          <div className="flex space-x-8 mt-6 md:mt-0 text-sm">
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">Discord</a>
            <a href="#" className="hover:text-white">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;