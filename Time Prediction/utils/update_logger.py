import pandas as pd
from utils.logger import LOG_FILE

def update_log(actual_post_time: str, engagement_value: float):
    """
    Update the last logged prediction with the actual post time and engagement.
    Example:
        update_log("2025-10-13T18:00:00Z", 320)
    """
    df = pd.read_csv(LOG_FILE)
    if df.empty:
        print("⚠️ No logs found yet to update.")
        return
    df.loc[df.index[-1], "actual_post_time"] = actual_post_time
    df.loc[df.index[-1], "actual_engagement"] = engagement_value
    df.to_csv(LOG_FILE, index=False)
    print("✅ Log updated successfully.")
