# utils/logger.py

import csv
import os
from datetime import datetime

LOG_FILE = "data/logs.csv"
os.makedirs("data", exist_ok=True)

# Updated column structure for advanced analytics
COLUMNS = [
    "timestamp_request",
    "predicted_best_time",
    "content_text",
    "followers",
    "hashtags_count",
    "actual_post_time",
    "actual_engagement",
    "reach",
    "impressions",
    "media_type"
]

# Create file with headers if not exists
if not os.path.exists(LOG_FILE):
    with open(LOG_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(COLUMNS)


def log_prediction(predicted_time, payload):
    """
    Log model prediction to CSV
    Called when /suggest_time endpoint runs
    """
    with open(LOG_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            datetime.utcnow().isoformat(),
            predicted_time,
            payload.get("content_text", ""),
            payload.get("followers", ""),
            payload.get("hashtags_count", ""),
            "",   # actual_post_time
            "",   # actual_engagement
            "",   # reach
            "",   # impressions
            ""    # media_type
        ])


def update_last_log(actual_post_time, actual_engagement, reach, impressions, media_type):
    """
    Update the most recent row with actual engagement data.
    Called after post is published.
    """

    if not os.path.exists(LOG_FILE):
        return {"error": "Log file not found"}

    rows = []

    # Read existing rows
    with open(LOG_FILE, "r", newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        rows = list(reader)

    if len(rows) <= 1:
        return {"error": "No prediction row to update"}

    # Update last row (latest prediction)
    rows[-1][5] = actual_post_time
    rows[-1][6] = actual_engagement
    rows[-1][7] = reach
    rows[-1][8] = impressions
    rows[-1][9] = media_type

    # Write back updated rows
    with open(LOG_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerows(rows)

    return {"status": "Log updated successfully"}



