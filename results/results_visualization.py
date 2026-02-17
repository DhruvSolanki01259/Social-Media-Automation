import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# Load your dataset or results
data = pd.read_csv('data/engagement_results.csv')  # your logged results
epochs = np.arange(1, 51)
loss = np.random.uniform(0.9, 0.1, size=50)  # example loss trend

# 1️⃣ Plot Loss vs Epoch
plt.figure(figsize=(8, 5))
plt.plot(epochs, loss, marker='o')
plt.title('Training Loss Curve of LSTM Model')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.grid(True)
plt.savefig('results/training_loss.png', dpi=300)
plt.show()

# 2️⃣ Plot Actual vs Predicted Engagement
plt.figure(figsize=(8, 5))
plt.plot(data['actual_engagement'], label='Actual Engagement', color='blue')
plt.plot(data['predicted_engagement'], label='Predicted Engagement', color='orange', linestyle='--')
plt.title('Actual vs Predicted Engagement')
plt.xlabel('Sample')
plt.ylabel('Engagement')
plt.legend()
plt.grid(True)
plt.savefig('results/prediction_comparison.png', dpi=300)
plt.show()

# 3️⃣ Plot Best Posting Time vs Average Engagement
plt.figure(figsize=(8, 5))
plt.bar(data['post_time'], data['avg_engagement'], color='green')
plt.title('Average Engagement by Posting Time')
plt.xlabel('Time of Day')
plt.ylabel('Average Engagement')
plt.xticks(rotation=45)
plt.grid(True, axis='y')
plt.tight_layout()
plt.savefig('results/time_vs_engagement.png', dpi=300)
plt.show()
