import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "../lib/axios";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const syncUser = async () => {
      try {
        // console.log("OAuth login successful");

        const token = await getToken();

        const res = await axios.get("/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          // console.log("MongoDB user created successfully");

        }

        navigate("/");
      } catch (error) {
        console.error("OAuth sync error:", error);
      }
    };

    syncUser();
  }, []);

  return <div>Logging you in...</div>;
}
