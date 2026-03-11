import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

const API = "http://localhost:8000/api";

export const useSyncUser = () => {
  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {
    const sync = async () => {
      try {
        const token = await getToken();

        await axios.get(`${API}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("User sync failed", error);
      }
    };

    if (isSignedIn) sync();
  }, [isSignedIn]);
};