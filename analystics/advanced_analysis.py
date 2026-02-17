# analytics/advanced_analysis.py

import pandas as pd

LOG_FILE = "data/logs.csv"

def generate_analytics():
    try:
        df = pd.read_csv(LOG_FILE)

        if df.empty:
            return {"message": "No data available"}

        # Convert datetime
        df["actual_post_time"] = pd.to_datetime(df["actual_post_time"], errors="coerce")

        # Drop rows without actual engagement
        df = df.dropna(subset=["actual_post_time", "actual_engagement"])

        if df.empty:
            return {"message": "No completed engagement data available"}

        # Extract hour and day
        df["hour"] = df["actual_post_time"].dt.hour
        df["day"] = df["actual_post_time"].dt.day_name()

        # Avoid division by zero
        df = df[df["reach"] > 0]

        df["engagement_rate"] = df["actual_engagement"] / df["reach"]

        # Hour-wise performance
        hourly_data = (
            df.groupby("hour")["actual_engagement"]
            .mean()
            .round(2)
            .to_dict()
        )

        # Day-wise performance
        daily_data = (
            df.groupby("day")["actual_engagement"]
            .mean()
            .round(2)
            .to_dict()
        )

        # Heatmap data
        heatmap_data = (
            df.groupby(["day", "hour"])["actual_engagement"]
            .mean()
            .unstack()
            .fillna(0)
            .round(2)
            .to_dict()
        )

        # Trend (7-post rolling average)
        df = df.sort_values("actual_post_time")
        df["rolling_7"] = df["actual_engagement"].rolling(7).mean().round(2)

        trend_data = df[["actual_post_time", "rolling_7"]] \
            .dropna() \
            .to_dict(orient="records")

        return {
            "total_posts": int(len(df)),
            "average_engagement": round(df["actual_engagement"].mean(), 2),
            "average_engagement_rate": round(df["engagement_rate"].mean(), 4),
            "best_hour": int(max(hourly_data, key=hourly_data.get)),
            "best_day": max(daily_data, key=daily_data.get),
            "hourly_data": hourly_data,
            "daily_data": daily_data,
            "heatmap_data": heatmap_data,
            "trend_data": trend_data
        }

    except Exception as e:
        return {"error": str(e)}
