import { Routes, Route, Navigate, useParams } from "react-router";
import { AppLayout } from "./layout/app-layout";
import ChatScreen from "@/features/chat/screens/chat-screen";
import LogoShowcase from "@/features/onboarding/screens/logo-showcase";
import DesignSystemShowcase from "@/features/showcase/screens/design-system";
import ComponentsShowcase from "@/features/showcase/screens/components";

const showcasePages: Record<string, React.ComponentType> = {
  "1": DesignSystemShowcase,
  "2": ComponentsShowcase,
  "3": LogoShowcase,
};

function ShowcaseRouter() {
  const { numId } = useParams<{ numId: string }>();
  const Page = showcasePages[numId ?? ""];
  if (!Page) return <Navigate to="/showcase/1" replace />;
  return <Page />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<ChatScreen />} />
        <Route path="/chat" element={<Navigate to="/" replace />} />
        <Route path="/chat/:chatId" element={<ChatScreen />} />
      </Route>
      <Route path="/showcase/:numId" element={<ShowcaseRouter />} />
    </Routes>
  );
}
