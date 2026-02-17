import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("data/logs.csv")
df["actual_post_time"] = pd.to_datetime(df["actual_post_time"])
df["hour"] = df["actual_post_time"].dt.hour

hourly = df.groupby("hour")["actual_engagement"].mean()

hourly.plot(kind="line")
plt.title("Hour vs Engagement")
plt.show()
