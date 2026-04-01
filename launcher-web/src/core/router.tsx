import { Routes, Route, Navigate } from "react-router";
import { AppLayout } from "./layout/app-layout";
import ChatScreen from "@/features/chat/screens/chat-screen";
import LogoShowcase from "@/features/onboarding/screens/logo-showcase";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<ChatScreen />} />
        <Route path="/chat" element={<Navigate to="/" replace />} />
        <Route path="/chat/:chatId" element={<ChatScreen />} />
      </Route>
      <Route path="/logo-showcase" element={<LogoShowcase />} />
    </Routes>
  );
}
