import numpy as np
from datetime import datetime

def extract_features(post_info, candidate_hour=None):
    followers = float(post_info.get("followers", 0))
    content_len = float(len(post_info.get("content_text", "")))
    hashtags = float(post_info.get("hashtags_count", 0))

    dt = candidate_hour or datetime.utcnow()
    hour = dt.hour
    dow = dt.weekday()
    hour_sin = np.sin(2 * np.pi * hour / 24)
    hour_cos = np.cos(2 * np.pi * hour / 24)
    dow_sin = np.sin(2 * np.pi * dow / 7)
    dow_cos = np.cos(2 * np.pi * dow / 7)

    return [followers, content_len, hashtags, hour_sin, hour_cos, dow_sin, dow_cos]
