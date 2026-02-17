import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export const PublicRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (isSignedIn) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};
