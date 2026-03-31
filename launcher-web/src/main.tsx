import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { TooltipProvider } from "cubepath-ui";
import { AppProvider } from "./providers/app-provider";
import { AppLayout } from "./routes/v1/layout";
import { AppLayoutV2 } from "./routes/v2/layout";
import Home from "./routes/v1/page";
import PageV2 from "./routes/v2/page";
import Showcase from "./routes/showcase/page";
import ComponentsPage from "./routes/components/page";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <TooltipProvider>
          <Routes>
            <Route element={<AppLayoutV2 />}>
              <Route path="/" element={<PageV2 />} />
              <Route path="/chat" element={<Navigate to="/" replace />} />
              <Route path="/chat/:chatId" element={<PageV2 />} />
              <Route path="/v2" element={<PageV2 />} />
              <Route path="/v2/chat/:chatId" element={<PageV2 />} />
            </Route>
            <Route element={<AppLayout />}>
              <Route path="/v1" element={<Home />} />
            </Route>
            <Route path="/showcase" element={<Showcase />} />
            <Route path="/components" element={<ComponentsPage />} />
          </Routes>
        </TooltipProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);
