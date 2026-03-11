import { useEffect, useLayoutEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import SplashScreen from "./components/SplashScreen";
import AppRoutes from "./routes/AppRoutes";
import { useThemeStore } from "./stores/theme.store";

import { useAuth } from "@clerk/clerk-react";
import { usePostStore } from "./stores/post.store.js";

const App = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [ready, setReady] = useState(false);
  const theme = useThemeStore((s) => s.theme);

  // Clerk Token
  const { getToken } = useAuth();
  const setApi = usePostStore((s) => s.setApi);

  useEffect(() => {
    setApi(getToken);
  }, [getToken]);

  /* ---------------- THEME SYNC (NO BLINK) ---------------- */
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  /* ---------------- SPLASH LOGIC ---------------- */
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("visited");

    if (!hasVisited) {
      setShowSplash(true);
      sessionStorage.setItem("visited", "true");
    } else {
      setReady(true);
    }
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      {/* Splash */}
      {showSplash && (
        <SplashScreen
          onComplete={() => {
            setShowSplash(false);
            setReady(true);
          }}
        />
      )}

      {/* App */}
      {ready && <AppRoutes />}
    </>
  );
};

export default App;
