import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw } from "lucide-react";
import { MenuPreferences, MenuSection, sectionLabels, sectionOrder } from "@/hooks/useMenuPreferences";
import { SortableMenuItem } from "./SortableMenuItem";

interface MenuCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: MenuPreferences;
  onMoveItem: (itemId: string, direction: "up" | "down") => void;
  onToggleVisibility: (itemId: string) => void;
  onMoveToSection: (itemId: string, section: MenuSection) => void;
  onUpdateSettings: (settings: Partial<Omit<MenuPreferences, "items">>) => void;
  onReorderItems: (activeId: string, overId: string) => void;
  onReset: () => void;
}

export function MenuCustomizer({
  open,
  onOpenChange,
  preferences,
  onMoveItem,
  onToggleVisibility,
  onMoveToSection,
  onUpdateSettings,
  onReorderItems,
  onReset,
}: MenuCustomizerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getItemsBySection = (section: MenuSection) =>
    preferences.items.filter((i) => i.section === section);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorderItems(active.id as string, over.id as string);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Personalizar Menu</DialogTitle>
          <DialogDescription>
            Arraste os itens para reorganizar, altere a visibilidade e mova entre seções.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="items" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="items">Itens do Menu</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="flex-1 overflow-hidden">
            <ScrollArea className="h-[400px] pr-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="space-y-6">
                  {sectionOrder.map((section) => {
                    const sectionItems = getItemsBySection(section);
                    if (sectionItems.length === 0) return null;

                    return (
                      <div key={section}>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                          {sectionLabels[section]}
                        </h3>
                        <SortableContext
                          items={sectionItems.map((i) => i.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-2">
                            {sectionItems.map((item, index) => (
                              <SortableMenuItem
                                key={item.id}
                                item={item}
                                index={index}
                                sectionItems={sectionItems}
                                onMoveItem={onMoveItem}
                                onToggleVisibility={onToggleVisibility}
                                onMoveToSection={onMoveToSection}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </div>
                    );
                  })}
                </div>
              </DndContext>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6 pt-4">
            <div className="grid gap-6">
              {/* Compact mode */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compact-mode">Modo Compacto</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduz o espaçamento entre os itens
                  </p>
                </div>
                <Switch
                  id="compact-mode"
                  checked={preferences.compactMode}
                  onCheckedChange={(checked) =>
                    onUpdateSettings({ compactMode: checked })
                  }
                />
              </div>

              {/* Show labels */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-labels">Mostrar Rótulos</Label>
                  <p className="text-sm text-muted-foreground">
                    Exibe o nome dos itens do menu
                  </p>
                </div>
                <Switch
                  id="show-labels"
                  checked={preferences.showLabels}
                  onCheckedChange={(checked) =>
                    onUpdateSettings({ showLabels: checked })
                  }
                />
              </div>

              {/* Show icons */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-icons">Mostrar Ícones</Label>
                  <p className="text-sm text-muted-foreground">
                    Exibe os ícones dos itens
                  </p>
                </div>
                <Switch
                  id="show-icons"
                  checked={preferences.showIcons}
                  onCheckedChange={(checked) =>
                    onUpdateSettings({ showIcons: checked })
                  }
                />
              </div>

              {/* Icon size */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tamanho dos Ícones</Label>
                  <p className="text-sm text-muted-foreground">
                    Ajuste o tamanho dos ícones
                  </p>
                </div>
                <Select
                  value={preferences.iconSize}
                  onValueChange={(value: "sm" | "md" | "lg") =>
                    onUpdateSettings({ iconSize: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Pequeno</SelectItem>
                    <SelectItem value="md">Médio</SelectItem>
                    <SelectItem value="lg">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restaurar Padrão
          </Button>
          <Button onClick={() => onOpenChange(false)}>Concluir</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}