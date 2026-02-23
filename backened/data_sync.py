import os
import pandas as pd
import requests
import time
from datetime import datetime

# Configuration
COINDESK_API_BASE = "https://data-api.coindesk.com"
USD_TO_INR = 88.19  # Constant for consistency with models

# Absolute paths to ensure it works from any directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HOURLY_PATH = os.path.join(BASE_DIR, "milestone-1", "hourly")
DAILY_PATH = os.path.join(BASE_DIR, "milestone-1", "daily")

COINS = {
    "BTC": "BTC-USD",
    "ETH": "ETH-USD",
    "DOGE": "DOGE-USD",
    "LTC": "LTC-USD",
    "DOT": "DOT-USD",
    "MATIC": "MATIC-USD",
    "XRP": "XRP-USD",
    "LINK": "LINK-USD",
    "BCH": "BCH-USD",
    "BNB": "BNB-USD"
}

# Mapping symbols to existing local filenames
FILE_MAP = {
    "BTC": "btc_inr",
    "ETH": "eth_inr",
    "DOGE": "doge_inr",
    "LTC": "ltc_inr",
    "DOT": "dot_inr",
    "MATIC": "polygon_inr",
    "XRP": "ripple_inr",
    "LINK": "link_inr",
    "BCH": "bch_inr",
    "BNB": "bnb_inr"
}

def get_last_timestamp(file_path):
    if not os.path.exists(file_path):
        return None
    try:
        df = pd.read_csv(file_path)
        return int(df['TIMESTAMP'].max())
    except Exception as e:
        print(f"Error reading last timestamp from {file_path}: {e}")
        return None

def fetch_coindesk_data(endpoint, instrument, limit=2000):
    url = f"{COINDESK_API_BASE}/index/cc/v1/historical/{endpoint}"
    params = {
        "market": "cadli",
        "instrument": instrument,
        "limit": limit,
        "aggregate": 1
    }
    try:
        response = requests.get(url, params=params, timeout=10)
        if response.status_code == 200:
            return response.json().get('Data', [])
    except Exception as e:
        print(f"Error fetching {instrument} from Coindesk: {e}")
    return []

def sync_coin_data(coin_name, instrument, interval_type):
    folder = HOURLY_PATH if interval_type == "hours" else DAILY_PATH
    filename = f"{FILE_MAP[coin_name]}_{'hourly' if interval_type == 'hours' else 'daily'}.csv"
    file_path = os.path.join(folder, filename)
    
    last_ts_file = get_last_timestamp(file_path)
    if not last_ts_file:
        print(f"Skipping {coin_name} {interval_type}: CSV not found or invalid.")
        return

    print(f"Syncing {coin_name} {interval_type} since {pd.to_datetime(last_ts_file, unit='s')}...")
    
    all_new_to_append = []
    current_to_ts = int(time.time())
    chunk_size = 2000
    
    # Fetch in batches until we hit last_ts
    while True:
        url = f"{COINDESK_API_BASE}/index/cc/v1/historical/{interval_type}"
        params = {
            "market": "cadli",
            "instrument": instrument,
            "limit": chunk_size,
            "aggregate": 1,
            "to_ts": current_to_ts
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            if response.status_code != 200:
                print(f"Error: Status {response.status_code}")
                break
            
            records = response.json().get('Data', [])
            if not records:
                break
                
            batch_to_append = []
            min_batch_ts = records[0]['TIMESTAMP']
            
            # Filter and convert
            for rec in records:
                ts = int(rec['TIMESTAMP'])
                if ts > last_ts_file:
                    open_inr = float(rec['OPEN']) * USD_TO_INR
                    high_inr = float(rec['HIGH']) * USD_TO_INR
                    low_inr = float(rec['LOW']) * USD_TO_INR
                    close_inr = float(rec['CLOSE']) * USD_TO_INR
                    
                    if open_inr < 1 or high_inr < 1 or low_inr < 1 or close_inr < 1:
                        continue
                        
                    batch_to_append.append({
                        "UNIT": "HOUR" if interval_type == "hours" else "DAY",
                        "TIMESTAMP": ts,
                        "TYPE": rec.get('TYPE', '267'),
                        "MARKET": rec.get('MARKET', 'cadli'),
                        "INSTRUMENT": instrument,
                        "OPEN": open_inr,
                        "HIGH": high_inr,
                        "LOW": low_inr,
                        "CLOSE": close_inr,
                        "DATE": pd.to_datetime(ts, unit='s').strftime('%d-%m-%Y %H.%M' if interval_type == 'hours' else '%Y-%m-%d')
                    })
            
            all_new_to_append.extend(batch_to_append)
            
            # If the earliest record in this batch is still after our goal, keep going back
            if min_batch_ts > last_ts_file and len(records) == chunk_size:
                current_to_ts = min_batch_ts - 1
                print(f"  ...fetched {len(batch_to_append)} records, going further back (current earlist: {pd.to_datetime(min_batch_ts, unit='s')})")
                time.sleep(0.5) # Be kind to API
            else:
                break
                
        except Exception as e:
            print(f"Exception during batch fetch: {e}")
            break

    if all_new_to_append:
        # Sort by timestamp ascending before appending
        all_new_to_append.sort(key=lambda x: x['TIMESTAMP'])
        
        # Remove duplicates if any (just in case)
        unique_entries = {e['TIMESTAMP']: e for e in all_new_to_append}
        sorted_unique = sorted(unique_entries.values(), key=lambda x: x['TIMESTAMP'])
        
        df_new = pd.DataFrame(sorted_unique)
        df_new.to_csv(file_path, mode='a', header=False, index=False)
        print(f"✅ Successfully appended {len(sorted_unique)} new records to {filename}")
    else:
        print(f"No newer data found for {coin_name} above {last_ts_file}")

def run_sync():
    print(f"🚀 Starting Real-time Data Sync Engine at {datetime.now()}")
    for coin, instrument in COINS.items():
        sync_coin_data(coin, instrument, "hours")
        sync_coin_data(coin, instrument, "days")
    print(f"🏁 Sync completed at {datetime.now()}")

if __name__ == "__main__":
    run_sync()
