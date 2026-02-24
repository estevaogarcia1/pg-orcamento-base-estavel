import { useState, createContext, useContext, forwardRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Menu, Settings2, LogOut } from "lucide-react";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import { useMenuPreferences, sectionLabels, sectionOrder, MenuSection } from "@/hooks/useMenuPreferences";
import { MenuCustomizer } from "@/components/menu/MenuCustomizer";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
// Context para compartilhar estado do sidebar
interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebarState() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarState must be used within SidebarProvider");
  }
  return context;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function AppSidebar() {
  const { collapsed, setCollapsed } = useSidebarState();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [customizerOpen, setCustomizerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: "Até logo!",
      description: "Você saiu do sistema.",
    });
    navigate("/login");
  };

  const {
    preferences,
    moveItem,
    toggleVisibility,
    moveToSection,
    updateSettings,
    reorderItems,
    resetToDefault,
  } = useMenuPreferences();

  const getItemsBySection = (section: MenuSection) =>
    preferences.items.filter((i) => i.section === section && i.visible);

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsed(true);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsed(!collapsed);
  };

  const iconSizeClass = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }[preferences.iconSize];

  const itemPadding = preferences.compactMode ? "py-1.5" : "py-2.5";

  const renderMenuItem = (item: (typeof preferences.items)[0]) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={() => window.innerWidth < 1024 && setCollapsed(true)}
        className={cn(
          "group relative flex items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-300 ease-out",
          itemPadding,
          "before:absolute before:inset-0 before:rounded-lg before:transition-all before:duration-300 before:ease-out",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-accent before:opacity-0"
            : "text-sidebar-foreground before:bg-gradient-to-r before:from-accent/20 before:to-accent/10 before:opacity-0 hover:before:opacity-100 hover:text-white hover:translate-x-1"
        )}
        title={collapsed ? item.label : undefined}
      >
        {preferences.showIcons && (
          <Icon
            className={cn(
              iconSizeClass,
              "flex-shrink-0 relative z-10 transition-all duration-300",
              !isActive && "group-hover:text-accent group-hover:scale-110"
            )}
          />
        )}
        {preferences.showLabels && (
          <span
            className={cn(
              "truncate relative z-10 transition-all duration-300",
              collapsed && "lg:hidden",
              !isActive && "group-hover:text-white"
            )}
          >
            {item.label}
          </span>
        )}
        <span
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 h-0 w-1 rounded-r-full bg-accent transition-all duration-300 ease-out",
            isActive ? "h-6" : "group-hover:h-4"
          )}
        />
      </Link>
    );
  };

  return (
    <>
      {/* Overlay para mobile quando aberto */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-sidebar transition-all duration-300 ease-in-out",
          collapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-center border-b border-sidebar-border px-4">
          <img
            src={logo}
            alt="P&G Reformas"
            className={cn(
              "transition-all duration-300",
              collapsed ? "lg:h-10 lg:w-10 lg:object-contain h-14" : "h-14"
            )}
          />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-3 overflow-y-auto h-[calc(100vh-5rem-3rem)]">
          {sectionOrder.map((section, sectionIndex) => {
            const sectionItems = getItemsBySection(section);
            if (sectionItems.length === 0) return null;

            return (
              <div key={section}>
                {/* Separador entre seções */}
                {sectionIndex > 0 && (
                  <div
                    className={cn(
                      "my-3 border-t border-sidebar-border",
                      collapsed && "lg:mx-2"
                    )}
                  />
                )}
                
                {/* Label da seção */}
                <div className={cn("mb-2", collapsed && "lg:mb-2")}>
                  <span
                    className={cn(
                      "px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50",
                      collapsed && "lg:hidden"
                    )}
                  >
                    {sectionLabels[section]}
                  </span>
                </div>
                
                {/* Items da seção */}
                {sectionItems.map(renderMenuItem)}
              </div>
            );
          })}
        </nav>

        {/* Footer with user info, customize button and toggle */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border bg-sidebar">
          {/* User info */}
          {user && !collapsed && (
            <div className="px-3 py-2 border-b border-sidebar-border">
              <p className="text-xs text-sidebar-foreground/70 truncate">{user.email}</p>
            </div>
          )}
          
          <div className="p-3">
            <div className="flex items-center justify-center gap-2">
              {/* Customize button */}
              <button
                onClick={() => setCustomizerOpen(true)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors",
                  collapsed && "lg:w-8"
                )}
                title="Personalizar menu"
              >
                <Settings2 className="h-4 w-4" />
              </button>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                title="Sair do sistema"
              >
                <LogOut className="h-4 w-4" />
              </button>

              {/* Toggle Button - Desktop */}
              <button
                onClick={handleToggle}
                className="hidden lg:flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Menu Customizer Dialog */}
      <MenuCustomizer
        open={customizerOpen}
        onOpenChange={setCustomizerOpen}
        preferences={preferences}
        onMoveItem={moveItem}
        onToggleVisibility={toggleVisibility}
        onMoveToSection={moveToSection}
        onUpdateSettings={updateSettings}
        onReorderItems={reorderItems}
        onReset={resetToDefault}
      />
    </>
  );
}

export const SidebarTrigger = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => {
    const { setCollapsed } = useSidebarState();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setCollapsed(false);
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent transition-colors lg:hidden z-50"
        {...props}
      >
        <Menu className="h-5 w-5" />
      </button>
    );
  }
);

SidebarTrigger.displayName = "SidebarTrigger";
