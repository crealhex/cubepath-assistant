import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { TooltipProvider } from "cubepath-ui";
import { AppProvider } from "./providers";
import { AppRouter } from "./router";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <TooltipProvider>
          <AppRouter />
        </TooltipProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);
