# CryptoPredictPro: ML-Driven Cryptocurrency Price Forecasting

CryptoPredictPro is a full-stack web application designed to forecast cryptocurrency prices using machine learning. It provides real-time data synchronization and predictive analysis through an intuitive web interface.

## 🚀 Features

- **Real-time Data Sync**: Periodically fetches and synchronizes cryptocurrency data from external APIs.
- **Price Forecasting**: Utilizes ML models to predict future price movements (hourly timeframe).
- **Task Scheduling**: Uses Celery for background data fetching and processing.
- **RESTful API**: A robust Flask backend providing endpoints for predictions and data checks.
- **Responsive UI**: A modern frontend for visualizing predictions.

## 🛠️ Technology Stack

- **Backend**: Python, Flask, SQLAlchemy, Celery, Gunicorn
- **Frontend**: JavaScript (React/Vite)
- **Database**: SQLite (via SQLAlchemy)
- **Deployment**: Configured for Pepper/Render with `render.yaml`

## 📂 Project Structure

```bash
├── backened/          # Flask API, DB models, and ML logic
├── frontened/         # Modern web frontend
├── milestone-1/       # Project documentation & early designs
├── milestone-2/       # Implementation details
├── app.py             # Root application entry point
└── render.yaml        # Deployment configuration
```

## ⚙️ Getting Started

### Prerequisites

- Python 3.10+
- Node.js & npm (for frontend)
- Redis (required for Celery tasks)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sree1hack/crypto_prediction.git
   cd crypto_prediction
   ```

2. **Backend Setup**:
   ```bash
   pip install -r backened/requirements.txt
   ```

3. **Frontend Setup**:
   ```bash
   cd frontened/cryptopredictpro
   npm install
   ```

### Running Locally

1. **Start the Backend**:
   ```bash
   python backened/app.py
   ```

2. **Start the Frontend**:
   ```bash
   cd frontened/cryptopredictpro
   npm run dev
   ```

## 🌐 Open Source & Community

Contributed to machine learning forecasting models in private repositories (e.g., **Infosys ML Prediction**) and actively participate in technical discussions across **GitHub**, **Stack Exchange**, and **Quora** to solve complex engineering challenges.

Check out my profiles: [GitHub](https://github.com/sree1hack) | [Stack Exchange](#) | [Quora](#)

## 📜 License

This project is licensed under the MIT License.
