import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BookOpen, MessageCircle, Activity, Heart, ShieldAlert, Globe, Microscope } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import hseLogo from "@assets/HSE-logo_1772456801625.jpg";

export default function LayoutPatient({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { t, setLanguage, language } = useLanguage();

  const navItems = [
    { href: "/", label: t("nav.home"), icon: Heart },
    { href: "/symptom-check", label: t("nav.symptom_checker"), icon: Activity },
    { href: "/chat", label: t("nav.care_assistant"), icon: MessageCircle },
    { href: "/learn", label: t("nav.learn"), icon: BookOpen },
    { href: "/news", label: "Research", icon: Microscope },
    { href: "/user-guide", label: "User Guide", icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold text-primary hover:opacity-90 transition-opacity">
              <Heart className="h-6 w-6 fill-primary/20" />
              ELLA
            </Link>
            <div className="h-6 w-[1px] bg-border mx-2"></div>
            <img src={hseLogo} alt="HSE Logo" className="h-8 object-contain" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={`text-sm font-medium transition-colors hover:text-primary ${
                location === item.href ? "text-primary" : "text-muted-foreground"
              }`}>
                {item.label}
              </Link>
            ))}
            
            <div className="flex items-center gap-2 border-l pl-6 ml-2">
              <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
                <SelectTrigger className="w-[130px] h-8 text-xs border-none bg-secondary/50 focus:ring-0">
                  <Globe className="mr-2 h-3 w-3" />
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="uk">Українська</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>

              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                  {t("nav.clinician_portal")}
                </Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between border-b pb-4 mb-2">
                  <span className="text-sm font-medium">Language</span>
                  <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <Globe className="mr-2 h-3 w-3" />
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="uk">Українська</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-2 text-lg font-medium">
                    <item.icon className="h-5 w-5 text-primary" />
                    {item.label}
                  </Link>
                ))}
                <div className="mt-8 border-t pt-4">
                  <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldAlert className="h-4 w-4" />
                    Clinician Access
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t bg-muted/30 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-6">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built for educational purposes. Not a substitute for professional medical advice.
          </p>
          <p className="text-xs text-muted-foreground">
             Emergency? Call 112/999 immediately.
          </p>
        </div>
      </footer>
      {/* Prototype Watermark */}
      <div className="fixed bottom-4 right-4 z-50 pointer-events-none opacity-20 select-none">
        <span className="text-2xl md:text-4xl font-black uppercase tracking-widest text-primary border-4 border-primary p-2 rounded-lg bg-background/50 backdrop-blur-sm -rotate-12 inline-block">
          Prototype
        </span>
      </div>
    </div>
  );
}
