import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BookOpen, MessageCircle, Activity, Heart, ShieldAlert } from "lucide-react";

export default function LayoutPatient({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Heart },
    { href: "/symptom-check", label: "Symptom Checker", icon: Activity },
    { href: "/chat", label: "Care Assistant", icon: MessageCircle },
    { href: "/education", label: "Learn", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold text-primary hover:opacity-90 transition-opacity">
            <Heart className="h-6 w-6 fill-primary/20" />
            ELLA
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === item.href ? "text-primary" : "text-muted-foreground"
                }`}>
                  {item.label}
                </a>
              </Link>
            ))}
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="ml-4 text-xs text-muted-foreground">
                Clinician Portal
              </Button>
            </Link>
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
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a className="flex items-center gap-2 text-lg font-medium">
                      <item.icon className="h-5 w-5 text-primary" />
                      {item.label}
                    </a>
                  </Link>
                ))}
                <div className="mt-8 border-t pt-4">
                  <Link href="/dashboard">
                    <a className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ShieldAlert className="h-4 w-4" />
                      Clinician Access
                    </a>
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
    </div>
  );
}
