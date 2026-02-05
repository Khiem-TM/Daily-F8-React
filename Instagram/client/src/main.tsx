import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import QueryProvider from "./providers/QueryProvider.tsx";

// Initialize theme from localStorage before render
const initializeTheme = () => {
  try {
    const stored = localStorage.getItem("instagram-theme");
    if (stored) {
      const { state } = JSON.parse(stored);
      const theme = state?.theme || "dark";

      if (theme === "system") {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        document.documentElement.classList.toggle("dark", prefersDark);
        document.documentElement.classList.toggle("light", !prefersDark);
      } else {
        document.documentElement.classList.toggle("dark", theme === "dark");
        document.documentElement.classList.toggle("light", theme === "light");
      }
    } else {
      // Default to dark mode
      document.documentElement.classList.add("dark");
    }
  } catch {
    document.documentElement.classList.add("dark");
  }
};

initializeTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>
);
