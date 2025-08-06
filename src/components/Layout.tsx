import { useState } from "react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Users, MapPin, ClipboardList, BarChart3, Home, Fingerprint, Settings, Menu } from "lucide-react";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  availableTabs?: Array<{ id: string; label: string }>;
  userRole?: string;
  viewingEmployee?: any;
}

const iconMap: Record<string, any> = {
  dashboard: Home,
  employees: Users,
  customers: MapPin,
  attendance: Fingerprint,
  visits: ClipboardList,
  reports: BarChart3,
  profile: Settings,
};

export function Layout({ children, activeTab, onTabChange, availableTabs, userRole, viewingEmployee }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Default menu items for backward compatibility
  const defaultMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "employees", label: "Employees", icon: Users },
    { id: "customers", label: "Customers", icon: MapPin },
    { id: "attendance", label: "Attendance", icon: Fingerprint },
    { id: "visits", label: "Visits", icon: ClipboardList },
    { id: "reports", label: "Reports", icon: BarChart3 },
  ];

  const menuItems = availableTabs 
    ? availableTabs.map(tab => ({
        ...tab,
        icon: iconMap[tab.id] || Home
      }))
    : defaultMenuItems;

  const getHeaderTitle = () => {
    const currentTab = menuItems.find(item => item.id === activeTab);
    return currentTab ? currentTab.label : "Dashboard";
  };

  const getSidebarTitle = () => {
    if (viewingEmployee) {
      return "Employee View";
    }
    return userRole === "admin" ? "Admin Panel" : "Employee Portal";
  };

  const getSidebarSubtitle = () => {
    if (viewingEmployee) {
      return viewingEmployee.name;
    }
    return "EMS";
  };

  const handleMenuClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  // Desktop Sidebar Component
  const DesktopSidebar = () => (
    <Sidebar className="hidden lg:flex">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <h2 className="text-lg font-semibold">{getSidebarSubtitle()}</h2>
        <p className="text-sm text-sidebar-foreground/70">
          {getSidebarTitle()}
        </p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => handleMenuClick(item.id)}
                isActive={activeTab === item.id}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );

  // Mobile Navigation Component
  const MobileNavigation = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="border-b border-sidebar-border p-4">
          <h2 className="text-lg font-semibold">{getSidebarSubtitle()}</h2>
          <p className="text-sm text-muted-foreground">
            {getSidebarTitle()}
          </p>
        </div>
        <div className="p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                onClick={() => handleMenuClick(item.id)}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="flex h-screen w-full flex-col">
          <header className="border-b bg-background p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MobileNavigation />
              <h1 className="text-lg font-semibold truncate">{getHeaderTitle()}</h1>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4">
            {children}
          </main>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <SidebarProvider>
          <div className="flex h-screen w-full">
            <DesktopSidebar />
            
            <div className="flex-1 flex flex-col overflow-hidden">
              <header className="border-b bg-background p-4 flex items-center">
                <SidebarTrigger className="mr-4" />
                <h1 className="text-xl font-semibold">{getHeaderTitle()}</h1>
              </header>
              <main className="flex-1 overflow-auto p-6">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
}