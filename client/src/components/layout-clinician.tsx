import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  ShieldCheck, 
  LogOut,
  Bell
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import hseLogo from "@assets/HSE-logo_1772456801625.jpg";

export default function LayoutClinician({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const menuItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Content Manager", url: "/dashboard/content", icon: FileText },
    { title: "Governance", url: "/dashboard/reviews", icon: Users },
    { title: "Settings", url: "/dashboard/settings", icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-sidebar">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <div className="flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold text-sidebar-primary">
                <ShieldCheck className="h-6 w-6" />
                <span>ELLA Pro</span>
              </Link>
              <img src={hseLogo} alt="HSE Logo" className="h-8 object-contain self-start" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground px-1">
              Clinician Portal • v2.1.0
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location === item.url}
                        tooltip={item.title}
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 flex flex-col min-w-0 bg-background">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary font-bold text-xs">
              DR
            </div>
          </header>
          <div className="flex-1 p-6 md:p-8 overflow-auto">
            {children}
          </div>
        </main>
        {/* Prototype Watermark */}
        <div className="fixed bottom-4 right-4 z-50 pointer-events-none opacity-20 select-none">
          <span className="text-2xl md:text-4xl font-black uppercase tracking-widest text-primary border-4 border-primary p-2 rounded-lg bg-background/50 backdrop-blur-sm -rotate-12 inline-block">
            Prototype
          </span>
        </div>
      </div>
    </SidebarProvider>
  );
}
