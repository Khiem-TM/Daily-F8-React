import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { router } from "./app/router.jsx";
import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <StrictMode>
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <App />
    </AuthProvider>
  </StrictMode>
);
