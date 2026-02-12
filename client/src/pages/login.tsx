import LayoutPatient from "@/components/layout-patient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ShieldCheck, User, Lock } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (role: 'patient' | 'clinician') => {
    setIsLoading(true);
    setTimeout(() => {
      if (role === 'patient') setLocation('/patient/dashboard');
      else setLocation('/dashboard'); // Clinician dashboard
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col items-center justify-center p-4">
      <Link href="/">
        <div className="flex items-center gap-2 font-serif text-2xl font-bold text-primary mb-8 cursor-pointer">
          <Heart className="h-8 w-8 fill-primary/20" />
          EndoCare
        </div>
      </Link>

      <Tabs defaultValue="patient" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="patient">Patient Portal</TabsTrigger>
          <TabsTrigger value="clinician">Clinician Access</TabsTrigger>
        </TabsList>
        
        <TabsContent value="patient">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Log in to your symptom diary and personal records.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" onClick={() => handleLogin('patient')} disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account? <span className="text-primary underline cursor-pointer">Sign up</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="clinician">
          <Card className="border-none shadow-lg border-t-4 border-t-primary">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="w-fit gap-1 text-xs">
                  <ShieldCheck className="h-3 w-3" /> Regulated Access
                </Badge>
              </div>
              <CardTitle>Clinician Portal</CardTitle>
              <CardDescription>Secure access for healthcare providers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinician-id">Medical ID / Email</Label>
                <Input id="clinician-id" placeholder="Dr. ID or Email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinician-pass">Password</Label>
                <Input id="clinician-pass" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="secondary" onClick={() => handleLogin('clinician')} disabled={isLoading}>
                {isLoading ? "Verifying..." : "Secure Log In"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-center text-xs text-muted-foreground max-w-sm">
        <Lock className="h-3 w-3 inline mr-1" />
        Your data is encrypted and stored securely in compliance with GDPR and health data regulations.
      </div>
    </div>
  );
}

function Badge({ children, variant, className }: any) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className} ${variant === 'outline' ? 'text-foreground' : 'bg-primary text-primary-foreground'}`}>
      {children}
    </div>
  );
}
