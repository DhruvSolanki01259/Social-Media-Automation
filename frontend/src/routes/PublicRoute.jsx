import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

export const PublicRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <LoadingSpinner label="Loading..." />;
  }

  if (isSignedIn) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};
