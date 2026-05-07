"use client";

import { createContext, useContext, useMemo } from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  isReady: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function ThemeContextBridge({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useNextTheme();
  const activeTheme: Theme = theme === "dark" ? "dark" : "light";
  const isReady = theme === "light" || theme === "dark";

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: activeTheme,
      isReady,
      setTheme: (nextTheme) => setTheme(nextTheme),
      toggleTheme: () => {
        setTheme(activeTheme === "light" ? "dark" : "light");
      },
    }),
    [activeTheme, isReady, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      enableColorScheme={false}
      storageKey="theme"
    >
      <ThemeContextBridge>{children}</ThemeContextBridge>
    </NextThemesProvider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
