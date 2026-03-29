import { Button, Tooltip, TooltipTrigger, TooltipContent } from "cubepath-ui";
import { Plus, FolderOpen, Settings } from "lucide-react";

interface SidebarRailProps {
  onNewChat: () => void;
  onTogglePanel: () => void;
  onOpenSettings: () => void;
  panelOpen: boolean;
}

export function SidebarRail({ onNewChat, onTogglePanel, onOpenSettings, panelOpen }: SidebarRailProps) {
  return (
    <div className="flex w-12 shrink-0 flex-col items-center border-r border-border bg-muted/30 py-3">
      <div className="flex flex-col items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-9" onClick={onNewChat}>
              <Plus className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">New Chat</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={panelOpen ? "secondary" : "ghost"}
              size="icon"
              className="size-9"
              onClick={onTogglePanel}
            >
              <FolderOpen className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Projects & Chats</TooltipContent>
        </Tooltip>
      </div>

      <div className="mt-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-9" onClick={onOpenSettings}>
              <Settings className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
