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
              <Button variant="outline" className="w-full gap-2 h-11" onClick={() => handleLogin('patient')}>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
                Sign in with Passkey
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>
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
