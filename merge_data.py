import pandas as pd
import glob
csv_files = glob.glob("data/*.csv")
print("Found CSV files:", csv_files)

all_dataframes = [pd.read_csv(f) for f in csv_files]

df_merged = pd.concat(all_dataframes).sort_values(by=["coin", "timestamp"]).reset_index(drop=True)

df_merged.to_csv("crypto_merged.csv", index=False)

print("✅ Merged dataset saved as crypto_merged.csv")
print(df_merged.head())
