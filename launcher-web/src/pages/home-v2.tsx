import { useOutletContext } from "react-router";
import { ChatPanelV2 } from "../features/chat-v2/chat-panel-v2";

export interface V2Context {
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
}

export default function HomeV2() {
  const { activeChatId, setActiveChatId } = useOutletContext<V2Context>();
  return <ChatPanelV2 chatId={activeChatId} onChatCreated={setActiveChatId} />;
}
