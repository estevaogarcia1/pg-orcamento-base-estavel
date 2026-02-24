import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import {
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MenuItem, MenuSection, sectionLabels, sectionOrder } from "@/hooks/useMenuPreferences";

interface SortableMenuItemProps {
  item: MenuItem;
  index: number;
  sectionItems: MenuItem[];
  onMoveItem: (itemId: string, direction: "up" | "down") => void;
  onToggleVisibility: (itemId: string) => void;
  onMoveToSection: (itemId: string, section: MenuSection) => void;
}

export function SortableMenuItem({
  item,
  index,
  sectionItems,
  onMoveItem,
  onToggleVisibility,
  onMoveToSection,
}: SortableMenuItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isFirst = index === 0;
  const isLast = index === sectionItems.length - 1;
  const Icon = item.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-all",
        item.visible
          ? "bg-card border-border"
          : "bg-muted/50 border-dashed border-muted-foreground/30 opacity-60",
        isDragging && "opacity-50 shadow-lg z-50"
      )}
    >
      <button
        className="cursor-grab active:cursor-grabbing touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Icon className="h-4 w-4 text-primary flex-shrink-0" />
        <span className="text-sm font-medium truncate">{item.label}</span>
      </div>

      <div className="flex items-center gap-1">
        {/* Move up/down */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onMoveItem(item.id, "up")}
          disabled={isFirst}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onMoveItem(item.id, "down")}
          disabled={isLast}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>

        {/* Move to section */}
        <Select
          value={item.section}
          onValueChange={(value: MenuSection) => onMoveToSection(item.id, value)}
        >
          <SelectTrigger className="h-7 w-28 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sectionOrder.map((section) => (
              <SelectItem key={section} value={section}>
                {sectionLabels[section]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Toggle visibility */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onToggleVisibility(item.id)}
        >
          {item.visible ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}