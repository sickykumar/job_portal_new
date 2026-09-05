import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  isDark: true,
  resetToSystem: () => {},
});

/**
 * Get current system color scheme ("dark" or "light")
 */
const getSystemTheme = () => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "dark";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      // Check if user manually chose a theme
      const userChoice = localStorage.getItem("theme_user_choice");
      if (userChoice === "light" || userChoice === "dark") {
        return userChoice;
      }
      // By default, strictly follow system preference
      return getSystemTheme();
    } catch {
      return getSystemTheme();
    }
  });

  // Listen to OS / System color scheme changes in real-time
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e) => {
      // If user hasn't manually locked their preference, automatically adapt
      const userChoice = localStorage.getItem("theme_user_choice");
      if (!userChoice) {
        const newSystemTheme = e.matches ? "dark" : "light";
        setTheme(newSystemTheme);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    } else if (mediaQuery.addListener) {
      // Older browser fallback
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, []);

  // Sync with DOM html root tag
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.style.colorScheme = "light";
    }
  }, [theme]);

  // User manually toggles theme
  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme_user_choice", next);
        localStorage.setItem("theme", next);
      } catch {}
      return next;
    });
  };

  // Reset to auto system theme
  const resetToSystem = () => {
    try {
      localStorage.removeItem("theme_user_choice");
    } catch {}
    setTheme(getSystemTheme());
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        resetToSystem,
        isDark: theme === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
