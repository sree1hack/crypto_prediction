import pandas as pd

# Read the merged dataset
input_file = "crypto_merged.csv"   # change this if your file has a different name
df = pd.read_csv(input_file)

# Rename the column ~coin -> coin
df.rename(columns={"~coin": "coin"}, inplace=True)

# Save each cryptocurrency into its own CSV file
for coin, df_coin in df.groupby("coin"):
    output_file = f"{coin}.csv"
    df_coin.to_csv(output_file, index=False)
    print(f"Saved {output_file}")
