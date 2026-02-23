from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_db_connection, init_db
import sqlite3
import uuid
import keras
import tensorflow as tf
import numpy as np
import pandas as pd
import os
import requests
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime, timedelta
import threading
import time
from data_sync import run_sync, HOURLY_PATH, DAILY_PATH, FILE_MAP

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Absolute paths to ensure it works from any directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "milestone-2", "infosys", "outputs", "models")
USD_TO_INR = 88.19

# Coin mapping (same as in milestone-2/main.py)
MODEL_NAME_MAP = {
    "BTC": "BITCOIN_INR",
    "ETH": "ETHEREUM_INR",
    "DOGE": "DOGECOIN_INR",
    "LTC": "LITECOIN_INR",
    "DOT": "POLKADOT_INR",
    "MATIC": "POLYGON_INR",
    "XRP": "RIPPLE_INR",
    "LINK": "CHAINLINK_INR",
    "BCH": "BITCOIN_CASH_INR",
    "BNB": "BINANCE_INR",
}

models = {
    "hourly": {},
    "daily": {}
}

def get_model(timeframe, coin):
    if coin in models[timeframe]:
        return models[timeframe][coin]
    
    # Try to load if not cached
    mapped_name = MODEL_NAME_MAP.get(coin)
    if not mapped_name:
        return None
    
    model_file = f"{mapped_name}.keras"
    model_path = os.path.join(MODEL_PATH, timeframe, model_file)
    
    if os.path.exists(model_path):
        print(f"📦 Lazy loading {timeframe} model for {coin} from {model_file}...")
        try:
            model = keras.models.load_model(model_path)
            models[timeframe][coin] = model
            return model
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            return None
    return None

# Initialize Database
init_db()

@app.route("/health")
def health():
    return "ok"

@app.route("/api/auth/google", methods=["POST"])
def google_auth():
    data = request.get_json()
    email = data.get("email")
    name = data.get("name")
    avatar = data.get("avatar")
    google_id = data.get("id") or str(uuid.uuid4())

    conn = get_db_connection()
    cursor = conn.cursor()
    
    user = cursor.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    
    if not user:
        cursor.execute(
            "INSERT INTO users (id, email, name, avatar, created_at) VALUES (?, ?, ?, ?, ?)",
            (google_id, email, name, avatar, datetime.now().isoformat())
        )
        conn.commit()
    
    user = cursor.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()
    
    return jsonify({
        "success": True,
        "user": dict(user)
    })

@app.route("/api/user/stats/<user_id>")
def get_user_stats(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    total = cursor.execute("SELECT COUNT(*) FROM predictions WHERE user_id = ?", (user_id,)).fetchone()[0]
    # Simulate accuracy for now, in a real app we'd compare with historical data later
    accuracy = 85 if total > 0 else 0 
    
    predictions = cursor.execute(
        "SELECT * FROM predictions WHERE user_id = ? ORDER BY timestamp DESC LIMIT 10", 
        (user_id,)
    ).fetchall()
    
    conn.close()
    
    return jsonify({
        "success": True,
        "totalPredictions": total,
        "accuracyRate": accuracy,
        "history": [dict(p) for p in predictions]
    })

@app.route("/predict", methods=["POST"])
def predict():
    print("📥 Received prediction request")
    try:
        data = request.get_json()
        coin = data.get("coin", "BTC").upper()
        timeframe = data.get("timeframe", "hourly") # "hourly" or "daily"
        user_id = data.get("user_id", "anonymous")
        
        model = get_model(timeframe, coin)
        if not model:
            return jsonify({"error": f"Model for {coin} ({timeframe}) not found"}), 400

        # Data source selection (local sync CSV)
        folder = HOURLY_PATH if timeframe == "hourly" else DAILY_PATH
        file_prefix = FILE_MAP.get(coin.upper(), coin.lower() + "_inr")
        filename = f"{file_prefix}_{timeframe}.csv"
        file_path = os.path.join(folder, filename)

        if not os.path.exists(file_path):
             return jsonify({"error": f"Data file for {coin} not found"}), 404
             
        df_full = pd.read_csv(file_path)
        df = df_full.tail(60) 
        
        if len(df) < 60:
             return jsonify({"error": f"Insufficient data (need 60, have {len(df)})"}), 400

        close_prices = df["CLOSE"].values.reshape(-1, 1)

        # Scale
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(close_prices)

        # Prepare last 60 timesteps
        X_input = np.array([scaled_data[-60:]]).reshape((1, 60, 1))

        # Prediction
        predicted_scaled = model.predict(X_input)
        predicted_price = scaler.inverse_transform(predicted_scaled)[0][0]
        
        # Prepare Response Object FIRST
        prediction_result = {
            "success": True,
            "coin": coin,
            "timeframe": timeframe,
            "currentPrice": float(close_prices[-1][0]),
            "predictedPrice": float(predicted_price),
            "historicalData": close_prices.flatten().tolist(), # Added for frontend charts
            "confidence": 85,
            "timestamp": datetime.now().isoformat(),
            "status": "Live Data Connected",
            "version": "2.1"
        }

        # Save to DB using the result object
        conn = get_db_connection()
        conn.execute(
            "INSERT INTO predictions (user_id, coin, timeframe, current_price, predicted_price, confidence, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (user_id, coin, timeframe, prediction_result["currentPrice"], prediction_result["predictedPrice"], 
             int(prediction_result["confidence"]), prediction_result["timestamp"])
        )
        conn.commit()
        conn.close()

        return jsonify(prediction_result)
        
    except Exception as e:
        print(f"❌ Prediction Error: {e}")
        return jsonify({"error": str(e)}), 500

def background_sync():
    """Run data sync every 60 minutes."""
    while True:
        try:
            run_sync()
        except Exception as e:
            print(f"❌ Background sync error: {e}")
        time.sleep(3600)

if __name__ == "__main__":
    # Start sync thread
    print("⏲️ Starting background sync thread...")
    threading.Thread(target=background_sync, daemon=True).start()
    
    # Use environment port for deployment (Render/Heroku/etc)
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=False, port=port, host="0.0.0.0")
