import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import os

print("📂 Loading dataset...")

try:
    df = pd.read_csv("cleaned_stock.csv")
    print(f"✅ Dataset Loaded Successfully! Total Records: {len(df)}")
except Exception as e:
    print(f"❌ Error loading file: {e}")
    exit()

# Keep only the price column
if "price" not in df.columns:
    raise ValueError("❌ 'price' column not found in the dataset.")

df = df[["price"]].dropna()
df["price"] = pd.to_numeric(df["price"], errors="coerce")
df = df.dropna()

if len(df) < 10:
    raise ValueError("❌ Not enough valid numeric data to train the model.")

# ---- Step 1: Scale data ----
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_prices = scaler.fit_transform(df["price"].values.reshape(-1, 1))

# ---- Step 2: Create sequences ----
window_size = 5
X, y = [], []
for i in range(len(scaled_prices) - window_size):
    X.append(scaled_prices[i:i + window_size])
    y.append(scaled_prices[i + window_size])

X, y = np.array(X), np.array(y)

# ---- Step 3: Split data ----
train_size = int(len(X) * 0.8)
X_train, X_test = X[:train_size], X[train_size:]
y_train, y_test = y[:train_size], y[train_size:]

# ---- Step 4: Build model ----
model = Sequential([
    LSTM(64, return_sequences=True, input_shape=(X_train.shape[1], 1)),
    Dropout(0.2),
    LSTM(64),
    Dense(1)
])

model.compile(optimizer="adam", loss="mse")

print("🚀 Training LSTM model...")
model.fit(X_train, y_train, epochs=30, batch_size=8, verbose=1)

# ---- Step 5: Predict and visualize ----
predictions = model.predict(X_test)
predicted_prices = scaler.inverse_transform(predictions)
real_prices = scaler.inverse_transform(y_test)

# ---- Step 6: Plot and Save ----
os.makedirs("results", exist_ok=True)
plt.figure(figsize=(10, 6))
plt.plot(real_prices, label="Actual Prices", color="blue")
plt.plot(predicted_prices, label="Predicted Prices", color="red")
plt.title("📈 LSTM Stock Model Results")
plt.xlabel("Time")
plt.ylabel("Price")
plt.legend()
plt.savefig("results/lstm_stock_results.png")
plt.show()

print("✅ Graph saved at results/lstm_stock_results.png")
