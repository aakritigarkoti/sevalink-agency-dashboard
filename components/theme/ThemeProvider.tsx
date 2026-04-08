"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  isReady: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyThemeClass(theme: Theme) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const resolvedTheme: Theme = savedTheme === "dark" ? "dark" : "light";

    setThemeState(resolvedTheme);
    applyThemeClass(resolvedTheme);
    setIsReady(true);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      isReady,
      setTheme: (nextTheme) => {
        setThemeState(nextTheme);
        window.localStorage.setItem("theme", nextTheme);
        applyThemeClass(nextTheme);
      },
      toggleTheme: () => {
        const nextTheme: Theme = theme === "light" ? "dark" : "light";

        setThemeState(nextTheme);
        window.localStorage.setItem("theme", nextTheme);
        applyThemeClass(nextTheme);
      },
    }),
    [theme, isReady],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
