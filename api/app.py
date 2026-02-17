# api/app.py

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))  # add project root

from fastapi import FastAPI
from datetime import datetime, timedelta
from models.online_model import OnlineModel
from utils.feature_engineering import extract_features
from utils.logger import log_prediction, update_last_log
from analystics.advanced_analysis import generate_analytics


# Initialize FastAPI app
app = FastAPI()
model = OnlineModel()

# ==========================
#  ENDPOINT 1 — Suggest Best Posting Time
# ==========================
@app.post("/suggest_time")
def suggest_time(payload: dict):
    """
    Example payload:
    {
        "content_text": "Hello everyone!",
        "followers": 1200,
        "hashtags_count": 3
    }
    """
    try:
        candidate_hours = [
            datetime.utcnow() + timedelta(hours=i + 1)
            for i in range(24)
        ]

        scores = []

        for hour in candidate_hours:
            feats = extract_features(payload, hour)
            score = model.predict(feats)
            scores.append((hour.isoformat(), float(score)))

        top3 = sorted(scores, key=lambda x: x[1], reverse=True)[:3]

        # Log only best predicted time
        log_prediction(top3[0][0], payload)

        return {
            "recommended_times": top3,
            "all_predictions": scores
        }

    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}


# ==========================
#  ENDPOINT 2 — Update Engagement Log
# ==========================
@app.post("/update_log")
def update_log_api(payload: dict):
    """
    Example payload:
    {
        "actual_post_time": "2025-10-13T18:00:00",
        "engagement_value": 320,
        "reach": 1200,
        "impressions": 1500,
        "media_type": "image"
    }
    """

    actual_post_time = payload.get("actual_post_time")
    engagement_value = payload.get("engagement_value")
    reach = payload.get("reach", 0)
    impressions = payload.get("impressions", 0)
    media_type = payload.get("media_type", "unknown")

    if not actual_post_time or engagement_value is None:
        return {
            "error": "actual_post_time and engagement_value are required"
        }

    result = update_last_log(
        actual_post_time,
        engagement_value,
        reach,
        impressions,
        media_type
    )

    return result


# ==========================
#  ENDPOINT 3 — Health Check
# ==========================
@app.get("/")
def root():
    return {"message": "AI Social Media Automation API is running"}

@app.get("/analytics")
def analytics():
    return generate_analytics()

