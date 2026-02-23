import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "crypto_pro.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    print("🗄️ Initializing Database...")
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        avatar TEXT,
        created_at TEXT
    )
    ''')
    
    # Predictions table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        coin TEXT,
        timeframe TEXT,
        current_price REAL,
        predicted_price REAL,
        confidence INTEGER,
        timestamp TEXT,
        is_correct INTEGER DEFAULT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')
    
    conn.commit()
    conn.close()
    print("✅ Database Initialized.")

if __name__ == "__main__":
    init_db()
