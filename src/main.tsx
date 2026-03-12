// React
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// App Entry
import App from "@/app/App";

// Styles
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
