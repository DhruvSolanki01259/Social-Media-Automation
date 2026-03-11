import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

export const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <LoadingSpinner label="Checking authentication..." />;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
