# models/online_model.py

import numpy as np

class OnlineModel:
    """
    Simple placeholder model.
    Later, this will learn from your engagement logs.
    For now, it gives a score based on time and basic post info.
    """

    def __init__(self):
        # You can store weights, past engagement stats, etc. here later
        pass

    def predict(self, features):
        """
        features = [followers, content_length, hashtags_count,
                    hour_sin, hour_cos, dow_sin, dow_cos]
        """
        followers, content_length, hashtags_count, hour_sin, hour_cos, dow_sin, dow_cos = features

        # Simple heuristic scoring formula
        score = (
            0.4 * hour_sin +             # certain hours get higher scores
            0.4 * dow_cos +              # some days are better
            0.001 * followers +          # more followers = higher score
            0.05 * hashtags_count +      # more hashtags can help a bit
            0.0005 * content_length      # slightly boost for longer content
        )

        return float(score)
