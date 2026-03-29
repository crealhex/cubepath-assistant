import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { TooltipProvider } from "cubepath-ui";
import { AppProvider } from "./providers/app-provider";
import { AppLayout } from "./layouts/app-layout";
import Home from "./pages/home";
import Showcase from "./pages/showcase";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <TooltipProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
            </Route>
            <Route path="/showcase" element={<Showcase />} />
          </Routes>
        </TooltipProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);
