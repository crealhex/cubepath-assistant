import { ChatPanel } from "../features/chat/chat-panel";
import { InfraSidebar } from "../features/infrastructure/infra-sidebar";

export default function Home() {
  return (
    <>
      <ChatPanel />
      <InfraSidebar />
    </>
  );
}
