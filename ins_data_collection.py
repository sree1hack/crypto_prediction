import requests
import pandas as pd
from datetime import datetime
import time
import os

os.makedirs("data", exist_ok=True)

coins = [
    "bitcoin", "ethereum", "tether", "binancecoin", "solana",
    "ripple", "cardano", "dogecoin", "tron", "polkadot"
]

days = 90

def fetch_coin_data(coin):
    url = f"https://api.coingecko.com/api/v3/coins/{coin}/market_chart?vs_currency=usd&days={days}"
    resp = requests.get(url)
    resp.raise_for_status()
    data = resp.json()

    records = []
    for i in range(len(data["prices"])):
        timestamp = data["prices"][i][0]
        price = data["prices"][i][1]
        market_cap = data["market_caps"][i][1]
        volume = data["total_volumes"][i][1]

        date = datetime.utcfromtimestamp(timestamp/1000)
        records.append([coin, date, price, market_cap, volume])

    return pd.DataFrame(records, columns=["coin", "timestamp", "price", "market_cap", "volume"])


for coin in coins:
    try:
        df_coin = fetch_coin_data(coin)
        df_coin.to_csv(f"data/{coin}.csv", index=False)  # save per coin
        print(f"✅ Saved {coin}.csv")
        time.sleep(20)  # avoid rate limit
    except Exception as e:
        print(f"⚠️ Error with {coin}: {e}")
