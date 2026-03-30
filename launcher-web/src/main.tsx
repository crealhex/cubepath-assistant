import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { TooltipProvider } from "cubepath-ui";
import { AppProvider } from "./providers/app-provider";
import { AppLayout } from "./routes/v1/layout";
import { AppLayoutV2 } from "./routes/v2/layout";
import Home from "./routes/v1/page";
import PageV2 from "./routes/v2/page";
import Showcase from "./routes/showcase/page";
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
            <Route element={<AppLayoutV2 />}>
              <Route path="/v2" element={<PageV2 />} />
              <Route path="/v2/chat/:chatId" element={<PageV2 />} />
            </Route>
            <Route path="/showcase" element={<Showcase />} />
          </Routes>
        </TooltipProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);
