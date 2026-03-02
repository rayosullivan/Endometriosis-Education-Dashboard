import LayoutPatient from "@/components/layout-patient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Activity, MessageCircle, FileText, Calendar, Lock } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/lib/i18n";
import heroImage from "@assets/ChatGPT_Image_Feb_13,_2026,_10_37_23_PM_1771022255876.png";

import { motion } from "framer-motion";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <LayoutPatient>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary/30 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <motion.div 
              className="flex flex-col justify-center space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="space-y-4">
                <Badge variant="outline" className="w-fit bg-background/50 backdrop-blur border-primary/20 text-primary">
                  {t("hero.badge")}
                </Badge>
                <h1 className="text-4xl font-serif font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground">
                  {t("hero.title")}
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl font-light">
                  {t("hero.description")}
                </p>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:flex-row">
                <Link href="/login">
                  <Button size="lg" className="gap-2 h-12 px-8 text-base">
                    <Lock className="h-4 w-4" />
                    {t("hero.login")}
                  </Button>
                </Link>
                <Link href="/symptom-check">
                  <Button size="lg" variant="outline" className="gap-2 h-12 px-8 text-base bg-background/50 backdrop-blur hover:bg-background/80">
                    <Activity className="h-4 w-4" />
                    {t("hero.check_symptoms")}
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                 <Link href="/chat">
                    <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer underline underline-offset-4">
                      <MessageCircle className="h-4 w-4" />
                      {t("hero.ask_assistant")}
                    </span>
                 </Link>
                 <span className="text-muted-foreground/50">|</span>
                 <span className="flex items-center gap-1">
                   <div className="h-2 w-2 rounded-full bg-green-500" />
                   {t("hero.clinician_verified")}
                 </span>
              </div>
            </motion.div>
            <motion.div 
              className="mx-auto lg:mr-0 rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/50 bg-white/30 backdrop-blur-sm p-2"
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
            >
              <img
                alt="Endometriosis Care Platform Hero"
                className="aspect-[4/3] object-cover rounded-2xl bg-muted"
                src={heroImage}
              />
            </motion.div>
          </div>
        </div>
        
        {/* Background decorative blobs */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-30 pointer-events-none">
          <div className="aspect-square h-[400px] rounded-full bg-primary" />
        </div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 blur-3xl opacity-30 pointer-events-none">
          <div className="aspect-square h-[300px] rounded-full bg-secondary" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
            <motion.h2 
              className="text-3xl font-serif font-bold tracking-tighter sm:text-4xl text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {t("features.title")}
            </motion.h2>
            <motion.p 
              className="text-muted-foreground md:text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t("features.description")}
            </motion.p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-none shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-shadow h-full">
                <CardHeader>
                <Activity className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="font-serif">{t("card.tracking.title")}</CardTitle>
                <CardDescription>
                  {t("card.tracking.desc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                  <li>Daily log entries</li>
                  <li>Cycle tracking</li>
                  <li>Trigger identification</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/login">
                   <Button variant="link" className="p-0 h-auto text-primary">Log In to Track <ArrowRight className="ml-1 h-4 w-4" /></Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-shadow">
              <CardHeader>
                <MessageCircle className="h-10 w-10 text-accent-foreground mb-2" />
                <CardTitle className="font-serif">{t("card.rag.title")}</CardTitle>
                <CardDescription>
                  {t("card.rag.desc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                  <li>Instant answers</li>
                  <li>Source citations</li>
                  <li>Safety-checked responses</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/chat">
                   <Button variant="link" className="p-0 h-auto text-primary">Chat Now <ArrowRight className="ml-1 h-4 w-4" /></Button>
                </Link>
              </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
            <Card className="border-none shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-shadow h-full">
              <CardHeader>
                <FileText className="h-10 w-10 text-secondary-foreground mb-2" />
                <CardTitle className="font-serif">{t("card.gp.title")}</CardTitle>
                <CardDescription>
                  {t("card.gp.desc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                  <li>Concise history</li>
                  <li>Red flag highlights</li>
                  <li>PDF export ready</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/symptom-check">
                   <Button variant="link" className="p-0 h-auto text-primary">Start Assessment <ArrowRight className="ml-1 h-4 w-4" /></Button>
                </Link>
              </CardFooter>
            </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </LayoutPatient>
  );
}
