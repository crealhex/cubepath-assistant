import { useState, useCallback, useEffect } from "react";
import { Button, Tooltip, TooltipTrigger, TooltipContent, Skeleton } from "cubepath-ui";
import { Plus, FolderOpen, Settings } from "lucide-react";
import { api, type Project, type Chat } from "@/services/api-client";

interface SidebarProps {
  activeChatId?: string | null;
  onSelectChat?: (chat: Chat) => void;
  onNewChat?: () => void;
  onOpenSettings?: () => void;
}

export function Sidebar({ activeChatId = null, onSelectChat, onNewChat, onOpenSettings }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  function loadProjects() {
    api.listProjects().then((p) => {
      setProjects(p);
      if (p.length > 0 && !activeProject) setActiveProject(p[0]);
    });
  }

  function loadChatsOnProjectChange() {
    if (!activeProject) return;
    setLoading(true);
    api.listChats(activeProject.id).then((c) => {
      setChats(c);
      setLoading(false);
    });
  }

  function refreshChatsOnExternalCreate() {
    if (!activeProject || !activeChatId) return;
    const exists = chats.some((c) => c.id === activeChatId);
    if (!exists) {
      api.listChats(activeProject.id).then(setChats);
    }
  }

  useEffect(loadProjects, []);
  useEffect(loadChatsOnProjectChange, [activeProject?.id]);
  useEffect(refreshChatsOnExternalCreate, [activeChatId]);

  const handleNewChat = useCallback(() => {
    onNewChat?.();
  }, [onNewChat]);

  return (
    <div
      className="flex h-full shrink-0 flex-col border-r border-border bg-muted/30 transition-[width] duration-200 ease-in-out overflow-hidden"
      style={{ width: expanded ? 256 : 48 }}
    >
      {/* Top actions */}
      <div className="flex flex-col gap-1 p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className={expanded ? "justify-start gap-2 w-full h-9 px-3" : "size-9"} onClick={handleNewChat}>
              <Plus className="size-4 shrink-0" />
              {expanded && <span className="truncate text-sm">New Chat</span>}
            </Button>
          </TooltipTrigger>
          {!expanded && <TooltipContent side="right">New Chat</TooltipContent>}
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={expanded ? "secondary" : "ghost"}
              size="icon"
              className={expanded ? "justify-start gap-2 w-full h-9 px-3" : "size-9"}
              onClick={() => setExpanded((p) => !p)}
            >
              <FolderOpen className="size-4 shrink-0" />
              {expanded && <span className="truncate text-sm">Projects</span>}
            </Button>
          </TooltipTrigger>
          {!expanded && <TooltipContent side="right">Projects & Chats</TooltipContent>}
        </Tooltip>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="flex flex-1 flex-col overflow-hidden px-2">
          {/* Project selector */}
          <div className="mb-2">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide px-1">Project</span>
            <div className="mt-1 flex flex-col gap-0.5">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveProject(p)}
                  className={`rounded-md px-3 py-1 text-left text-sm truncate transition-colors ${
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

          <div className="border-b border-border mb-2" />

          {/* Chat list */}
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Chats</span>
          </div>

          <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
            {loading ? (
              <>
                <Skeleton className="h-7 w-full rounded-md" />
                <Skeleton className="h-7 w-full rounded-md" />
              </>
            ) : chats.length === 0 ? (
              <p className="text-xs text-muted-foreground px-1 py-2">No chats yet</p>
            ) : (
              chats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectChat?.(c)}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors truncate ${
                    activeChatId === c.id
                      ? "bg-primary/10 text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="truncate">{c.title}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Bottom: settings */}
      <div className="mt-auto p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={expanded ? "justify-start gap-2 w-full h-9 px-3" : "size-9"}
              onClick={() => onOpenSettings?.()}
            >
              <Settings className="size-4 shrink-0" />
              {expanded && <span className="truncate text-sm">Settings</span>}
            </Button>
          </TooltipTrigger>
          {!expanded && <TooltipContent side="right">Settings</TooltipContent>}
        </Tooltip>
      </div>
    </div>
  );
}
