import { Routes, Route, Navigate } from "react-router";
import { AppLayoutV2 } from "./layout/app-layout";
import ChatScreen from "@/features/chat/screens/chat-screen";
import LogoShowcase from "@/features/onboarding/screens/logo-showcase";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayoutV2 />}>
        <Route path="/" element={<ChatScreen />} />
        <Route path="/chat" element={<Navigate to="/" replace />} />
        <Route path="/chat/:chatId" element={<ChatScreen />} />
      </Route>
      <Route path="/logo-showcase" element={<LogoShowcase />} />
    </Routes>
  );
}
