import { useEffect, useState } from "react";
import { Button, Skeleton } from "cubepath-ui";
import { Plus, MessageSquare } from "lucide-react";
import { api, type Project, type Chat } from "../../services/api-client";

interface SidebarPanelProps {
  activeChatId: string | null;
  onSelectChat: (chat: Chat) => void;
  onNewChat: (projectId: string) => void;
}

export function SidebarPanel({ activeChatId, onSelectChat, onNewChat }: SidebarPanelProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Load projects on mount
  useEffect(() => {
    api.listProjects().then((p) => {
      setProjects(p);
      if (p.length > 0) setActiveProject(p[0]);
    });
  }, []);

  // Load chats when project changes
  useEffect(() => {
    if (!activeProject) return;
    setLoading(true);
    api.listChats(activeProject.id).then((c) => {
      setChats(c);
      setLoading(false);
    });
  }, [activeProject?.id]);

  return (
    <div className="flex w-56 shrink-0 flex-col border-r border-border bg-muted/10 p-3">
      {/* Project selector */}
      <div className="mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Project</span>
        <div className="mt-1 flex flex-col gap-0.5">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProject(p)}
              className={`rounded-md px-2 py-1 text-left text-sm transition-colors ${
                activeProject?.id === p.id
                  ? "bg-primary/10 text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mb-3 border-b border-border" />

      {/* Chats */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Chats</span>
        {activeProject && (
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            onClick={() => onNewChat(activeProject.id)}
          >
            <Plus className="size-3" />
          </Button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {loading ? (
          <>
            <Skeleton className="h-8 w-full rounded-md" />
            <Skeleton className="h-8 w-full rounded-md" />
            <Skeleton className="h-8 w-full rounded-md" />
          </>
        ) : chats.length === 0 ? (
          <p className="text-xs text-muted-foreground py-2">No chats yet</p>
        ) : (
          chats.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectChat(c)}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors truncate ${
                activeChatId === c.id
                  ? "bg-primary/10 text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <MessageSquare className="size-3.5 shrink-0" />
              <span className="truncate">{c.title}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
