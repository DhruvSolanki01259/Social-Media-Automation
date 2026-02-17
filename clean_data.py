import pandas as pd

input_path = "download.txt"
output_path = "cleaned_stock.csv"

try:
    # Try reading with comma, space, or tab delimiters automatically
    df = pd.read_csv(input_path, sep=None, engine='python', on_bad_lines='skip')

    # Keep only the first two columns (date, price)
    df = df.iloc[:, :2]
    df.columns = ["date", "price"]

    # Drop rows with missing values
    df = df.dropna(subset=["date", "price"])

    # Remove spaces or unwanted characters
    df["date"] = df["date"].astype(str).str.strip()
    df["price"] = df["price"].astype(str).str.replace(r"[^0-9.]", "", regex=True)

    # Convert price to float safely
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    df = df.dropna(subset=["price"])

    # Save cleaned file
    df.to_csv(output_path, index=False)
    print(f"✅ Cleaned dataset saved to {output_path} with {len(df)} rows.")

except Exception as e:
    print(f"❌ Error cleaning file: {e}")
