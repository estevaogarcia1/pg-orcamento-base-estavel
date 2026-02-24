import { useState, useEffect, useCallback } from "react";
import {
  Home,
  Users,
  FileText,
  Settings,
  Wrench,
  Calendar,
  Image,
  DollarSign,
  ClipboardCheck,
  Building2,
  Truck,
  Bot,
  Hammer,
  UserCheck,
  BarChart3,
  LucideIcon,
} from "lucide-react";

export type MenuSection = "gestao" | "cadastro" | "planejamento" | "recursos" | "sistema";

export interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  path: string;
  section: MenuSection;
  visible: boolean;
}

export interface MenuPreferences {
  items: MenuItem[];
  compactMode: boolean;
  showLabels: boolean;
  showIcons: boolean;
  iconSize: "sm" | "md" | "lg";
}

export const sectionLabels: Record<MenuSection, string> = {
  gestao: "Gestão",
  cadastro: "Cadastro",
  planejamento: "Planejamento",
  recursos: "Recursos",
  sistema: "Sistema",
};

export const sectionOrder: MenuSection[] = ["gestao", "cadastro", "planejamento", "recursos", "sistema"];

const defaultMenuItems: MenuItem[] = [
  // Gestão
  { id: "dashboard", icon: Home, label: "Dashboard", path: "/", section: "gestao", visible: true },
  { id: "orcamentos", icon: FileText, label: "Orçamentos", path: "/orcamentos", section: "gestao", visible: true },
  { id: "financeiro", icon: DollarSign, label: "Financeiro", path: "/financeiro", section: "gestao", visible: true },
  { id: "relatorios", icon: BarChart3, label: "Relatórios", path: "/relatorios", section: "gestao", visible: true },
  // Cadastro
  { id: "clientes", icon: Users, label: "Clientes", path: "/clientes", section: "cadastro", visible: true },
  { id: "servicos", icon: Wrench, label: "Serviços", path: "/servicos", section: "cadastro", visible: true },
  { id: "fornecedores", icon: Truck, label: "Fornecedores", path: "/fornecedores", section: "cadastro", visible: true },
  { id: "profissionais", icon: UserCheck, label: "Profissionais", path: "/profissionais", section: "cadastro", visible: true },
  // Planejamento
  { id: "agenda", icon: ClipboardCheck, label: "Agenda", path: "/agenda", section: "planejamento", visible: true },
  { id: "cronograma", icon: Calendar, label: "Cronograma", path: "/cronograma", section: "planejamento", visible: true },
  { id: "checklist", icon: ClipboardCheck, label: "Checklist", path: "/checklist", section: "planejamento", visible: true },
  // Recursos
  { id: "galeria", icon: Image, label: "Galeria", path: "/galeria", section: "recursos", visible: true },
  { id: "ferramentas", icon: Hammer, label: "Ferramentas", path: "/ferramentas", section: "recursos", visible: true },
  { id: "assistente-ia", icon: Bot, label: "Assistente IA", path: "/assistente-ia", section: "recursos", visible: true },
  // Sistema
  { id: "empresa", icon: Building2, label: "Empresa", path: "/empresa", section: "sistema", visible: true },
  { id: "configuracoes", icon: Settings, label: "Configurações", path: "/configuracoes", section: "sistema", visible: true },
];

const defaultPreferences: MenuPreferences = {
  items: defaultMenuItems,
  compactMode: false,
  showLabels: true,
  showIcons: true,
  iconSize: "md",
};

const STORAGE_KEY = "menu-preferences";

// Icon map for serialization
const iconMap: Record<string, LucideIcon> = {
  dashboard: Home,
  orcamentos: FileText,
  clientes: Users,
  servicos: Wrench,
  agenda: ClipboardCheck,
  financeiro: DollarSign,
  cronograma: Calendar,
  relatorios: BarChart3,
  galeria: Image,
  ferramentas: Hammer,
  checklist: ClipboardCheck,
  fornecedores: Truck,
  profissionais: UserCheck,
  "assistente-ia": Bot,
  empresa: Building2,
  configuracoes: Settings,
};

export function useMenuPreferences() {
  const [preferences, setPreferences] = useState<MenuPreferences>(defaultPreferences);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Restore icon references
        const items = parsed.items.map((item: MenuItem) => ({
          ...item,
          icon: iconMap[item.id] || Home,
        }));
        setPreferences({ ...parsed, items });
      } catch {
        setPreferences(defaultPreferences);
      }
    }
  }, []);

  const savePreferences = useCallback((newPrefs: MenuPreferences) => {
    // Serialize without icon functions
    const toStore = {
      ...newPrefs,
      items: newPrefs.items.map(({ icon, ...rest }) => rest),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    setPreferences(newPrefs);
  }, []);

  const moveItem = useCallback((itemId: string, direction: "up" | "down") => {
    setPreferences((prev) => {
      const items = [...prev.items];
      const index = items.findIndex((i) => i.id === itemId);
      if (index === -1) return prev;

      const item = items[index];
      const sectionItems = items.filter((i) => i.section === item.section);
      const sectionIndex = sectionItems.findIndex((i) => i.id === itemId);

      if (direction === "up" && sectionIndex > 0) {
        const prevItem = sectionItems[sectionIndex - 1];
        const prevIndex = items.findIndex((i) => i.id === prevItem.id);
        [items[index], items[prevIndex]] = [items[prevIndex], items[index]];
      } else if (direction === "down" && sectionIndex < sectionItems.length - 1) {
        const nextItem = sectionItems[sectionIndex + 1];
        const nextIndex = items.findIndex((i) => i.id === nextItem.id);
        [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
      }

      const newPrefs = { ...prev, items };
      savePreferences(newPrefs);
      return newPrefs;
    });
  }, [savePreferences]);

  const toggleVisibility = useCallback((itemId: string) => {
    setPreferences((prev) => {
      const items = prev.items.map((item) =>
        item.id === itemId ? { ...item, visible: !item.visible } : item
      );
      const newPrefs = { ...prev, items };
      savePreferences(newPrefs);
      return newPrefs;
    });
  }, [savePreferences]);

  const moveToSection = useCallback((itemId: string, section: MenuSection) => {
    setPreferences((prev) => {
      const items = prev.items.map((item) =>
        item.id === itemId ? { ...item, section } : item
      );
      const newPrefs = { ...prev, items };
      savePreferences(newPrefs);
      return newPrefs;
    });
  }, [savePreferences]);

  const updateSettings = useCallback((settings: Partial<Omit<MenuPreferences, "items">>) => {
    setPreferences((prev) => {
      const newPrefs = { ...prev, ...settings };
      savePreferences(newPrefs);
      return newPrefs;
    });
  }, [savePreferences]);

  const reorderItems = useCallback((activeId: string, overId: string) => {
    setPreferences((prev) => {
      const items = [...prev.items];
      const activeIndex = items.findIndex((i) => i.id === activeId);
      const overIndex = items.findIndex((i) => i.id === overId);
      
      if (activeIndex === -1 || overIndex === -1) return prev;
      
      // Move item from activeIndex to overIndex
      const [removed] = items.splice(activeIndex, 1);
      items.splice(overIndex, 0, removed);
      
      const newPrefs = { ...prev, items };
      savePreferences(newPrefs);
      return newPrefs;
    });
  }, [savePreferences]);

  const resetToDefault = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPreferences(defaultPreferences);
  }, []);

  return {
    preferences,
    moveItem,
    toggleVisibility,
    moveToSection,
    updateSettings,
    reorderItems,
    resetToDefault,
  };
}
