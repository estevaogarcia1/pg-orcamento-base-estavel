import { ReactNode } from "react";
import { AppSidebar, SidebarTrigger, useSidebarState } from "./AppSidebar";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { collapsed } = useSidebarState();
  
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      
      {/* Header com trigger mobile */}
      <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur px-4 lg:hidden">
        <SidebarTrigger />
        <span className="font-semibold text-foreground">P&G Reformas</span>
      </header>
      
      <main className={cn(
        "min-h-screen p-6 pt-20 lg:pt-6 transition-all duration-300",
        collapsed ? "lg:ml-20" : "lg:ml-64"
      )}>
        {children}
      </main>
    </div>
  );
}
