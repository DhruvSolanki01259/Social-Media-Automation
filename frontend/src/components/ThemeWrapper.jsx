import { useEffect, useState } from "react";
import { useThemeStore } from "../stores/theme.store.js";

const ThemeWrapper = ({ children }) => {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // wait for component mount to prevent SSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme, mounted]);

  return <>{children}</>;
};

export default ThemeWrapper;
