import requests
import pandas as pd
from datetime import datetime

url = "https://min-api.cryptocompare.com/data/v2/histohour"

# 10 important cryptocurrencies
cryptos = ["BTC", "ETH", "BNB", "SOL", "XRP", "ADA", "DOGE", "DOT", "MATIC", "LTC"]

crypto_data = {}

for coin in cryptos:
    params = {
        "fsym": coin,   # from symbol
        "tsym": "USD",  # convert to USD
        "limit": 10     # last 10 hours
    }

    response = requests.get(url, params=params)
    data = response.json()

    if "Data" in data and "Data" in data["Data"]:
        df = pd.DataFrame(data["Data"]["Data"])
        df["time"] = pd.to_datetime(df["time"], unit="s")
        crypto_data[coin] = df
        print(f"\n✅ {coin} data collected")
        print(df)
    else:
        print(f"❌ Failed to fetch {coin} data")

# Example: Access BTC data
btc_df = crypto_data["BTC"]
print("\nBitcoin DataFrame:")
print(btc_df)
