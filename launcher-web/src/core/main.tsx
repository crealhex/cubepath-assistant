import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { TooltipProvider } from "cubepath-ui";
import { AppProvider } from "./providers";
import { AppLayoutV2 } from "./layout/app-layout";
import ChatScreen from "@/features/chat/screens/chat-screen";
import { Onboarding } from "@/features/onboarding/screens/onboarding-screen";
import LogoShowcase from "@/features/onboarding/screens/logo-showcase";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <TooltipProvider>
          <Routes>
            <Route element={<AppLayoutV2 />}>
              <Route path="/" element={<ChatScreen />} />
              <Route path="/chat" element={<Navigate to="/" replace />} />
              <Route path="/chat/:chatId" element={<ChatScreen />} />
            </Route>
            <Route path="/logo-showcase" element={<LogoShowcase />} />
          </Routes>
        </TooltipProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);
