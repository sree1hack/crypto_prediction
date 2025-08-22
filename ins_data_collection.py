import requests
import pandas as pd
from datetime import datetime
import time
import os

# Create folders
os.makedirs("data/daily", exist_ok=True)
os.makedirs("data/hourly", exist_ok=True)

# Coingecko names (for filenames) -> Cryptocompare symbols (for API)
symbol_map = {
    "bitcoin": "BTC",
    "ethereum": "ETH",
    "tether": "USDT",
    "binancecoin": "BNB",
    "solana": "SOL",
    "ripple": "XRP",
    "cardano": "ADA",
    "dogecoin": "DOGE",
    "tron": "TRX",
    "polkadot": "DOT"
}

def fetch_daily_data(symbol, limit=90):
    """Fetch daily historical data from Cryptocompare"""
    url = f"https://min-api.cryptocompare.com/data/v2/histoday?fsym={symbol}&tsym=USD&limit={limit}"
    resp = requests.get(url)
    resp.raise_for_status()
    data = resp.json()

    if "Data" not in data or "Data" not in data["Data"]:
        raise ValueError(f"No daily data found for {symbol}")

    records = []
    for item in data["Data"]["Data"]:
        timestamp = datetime.utcfromtimestamp(item["time"])
        records.append([
            symbol, timestamp, item["open"], item["high"],
            item["low"], item["close"], item["volumefrom"], item["volumeto"]
        ])

    return pd.DataFrame(records, columns=["coin", "timestamp", "open", "high", "low", "close", "volume_from", "volume_to"])


def fetch_hourly_data(symbol, limit=720):
    """Fetch hourly historical data from Cryptocompare"""
    url = f"https://min-api.cryptocompare.com/data/v2/histohour?fsym={symbol}&tsym=USD&limit={limit}"
    resp = requests.get(url)
    resp.raise_for_status()
    data = resp.json()

    if "Data" not in data or "Data" not in data["Data"]:
        raise ValueError(f"No hourly data found for {symbol}")

    records = []
    for item in data["Data"]["Data"]:
        timestamp = datetime.utcfromtimestamp(item["time"])
        records.append([
            symbol, timestamp, item["open"], item["high"],
            item["low"], item["close"], item["volumefrom"], item["volumeto"]
        ])

    return pd.DataFrame(records, columns=["coin", "timestamp", "open", "high", "low", "close", "volume_from", "volume_to"])


# Loop over coins
for coin, symbol in symbol_map.items():
    try:
        # Daily
        df_daily = fetch_daily_data(symbol, limit=90)
        df_daily.to_csv(f"data/daily/{coin}_daily.csv", index=False)
        print(f"✅ Saved daily {coin}")

        # Hourly
        df_hourly = fetch_hourly_data(symbol, limit=720)
        df_hourly.to_csv(f"data/hourly/{coin}_hourly.csv", index=False)
        print(f"✅ Saved hourly {coin}")

        time.sleep(10)  # avoid rate limit

    except Exception as e:
        print(f"⚠️ Error with {coin}: {e}")
