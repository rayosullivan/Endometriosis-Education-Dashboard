import LayoutPatient from "@/components/layout-patient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Activity, MessageCircle, FileText, Heart, ShieldAlert, Zap, Calendar, History } from "lucide-react";
import { motion } from "framer-motion";

export default function UserGuidePage() {
  return (
    <LayoutPatient>
      <div className="bg-secondary/30 border-b">
        <div className="container px-4 py-12 md:py-16 text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
              ELLA User Guide
            </h1>
            <p className="text-muted-foreground text-lg mt-4">
              Everything you need to know to get the most out of your trusted endometriosis care companion.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container px-4 py-12 max-w-4xl mx-auto">
        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto gap-2 bg-transparent p-0 mb-8">
            <TabsTrigger value="getting-started" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background px-4 py-2 rounded-lg whitespace-normal text-center h-full">Getting Started</TabsTrigger>
            <TabsTrigger value="journal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background px-4 py-2 rounded-lg whitespace-normal text-center h-full">Endo Journal</TabsTrigger>
            <TabsTrigger value="assistant" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background px-4 py-2 rounded-lg whitespace-normal text-center h-full">Care Assistant</TabsTrigger>
            <TabsTrigger value="checker" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background px-4 py-2 rounded-lg whitespace-normal text-center h-full">Symptom Checker</TabsTrigger>
            <TabsTrigger value="hub" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background px-4 py-2 rounded-lg whitespace-normal text-center h-full">Knowledge Hub</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-serif">
                    <Heart className="h-6 w-6 text-primary" /> Welcome to ELLA
                  </CardTitle>
                  <CardDescription>Your centralized platform for managing endometriosis.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">What is ELLA?</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      ELLA is a comprehensive, clinician-verified health platform designed specifically for individuals dealing with endometriosis. It allows you to track symptoms, maintain your medical history, learn from verified resources, and generate reports for your healthcare providers.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Navigating the App</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <strong className="text-foreground shrink-0">Home:</strong> Overview of features and quick links.
                      </li>
                      <li className="flex items-start gap-2">
                        <strong className="text-foreground shrink-0">My Endo Journal:</strong> Your daily diary for pain, triggers, and comprehensive medical history.
                      </li>
                      <li className="flex items-start gap-2">
                        <strong className="text-foreground shrink-0">Care Assistant:</strong> An AI-powered chat to ask questions based on official guidelines.
                      </li>
                      <li className="flex items-start gap-2">
                        <strong className="text-foreground shrink-0">Symptom Checker:</strong> A tool to summarize your condition into a GP-ready report.
                      </li>
                      <li className="flex items-start gap-2">
                        <strong className="text-foreground shrink-0">Learn:</strong> Curated, reliable articles and latest research.
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="journal">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-serif">
                    <Calendar className="h-6 w-6 text-primary" /> My Endo Journal
                  </CardTitle>
                  <CardDescription>Track daily symptoms and manage long-term medical records.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="daily-log">
                      <AccordionTrigger className="text-lg font-semibold">Logging Daily Symptoms</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4 pt-2">
                        <p>The <strong>Daily Journal</strong> helps you spot patterns over time. To log an entry:</p>
                        <ol className="list-decimal list-inside space-y-2 ml-2">
                          <li>Click the <strong>Log Symptoms</strong> button.</li>
                          <li>Adjust the slider to indicate your <strong>Pain Severity</strong> (0-10).</li>
                          <li>Select your current <strong>Menstruation</strong> flow.</li>
                          <li>Tap on the specific <strong>Pain Locations</strong> (e.g., Lower Back, Pelvis).</li>
                          <li>Select any <strong>Triggers</strong> (e.g., Stress, Exercise).</li>
                          <li>Add <strong>Medications</strong> you've taken for relief.</li>
                          <li>Save the entry. It will appear in your calendar and recent entries feed.</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="ai-insights">
                      <AccordionTrigger className="text-lg font-semibold">AI Health Insights</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4 pt-2">
                        <p>Click the <strong>AI Insights</strong> button to get a quick, intelligent summary of your recent logs. It will highlight your average pain levels, common triggers, and suggest actionable recommendations based on your personal patterns.</p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="past-history">
                      <AccordionTrigger className="text-lg font-semibold">Managing Past History</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-4 pt-2">
                        <p>Switch to the <strong>Past History</strong> tab to keep your long-term medical records organized:</p>
                        <ul className="list-disc list-inside space-y-2 ml-2">
                          <li><strong>Surgical History:</strong> Log laparoscopies, excisions, or other procedures.</li>
                          <li><strong>Imaging Reports:</strong> Keep track of MRIs and Ultrasounds.</li>
                          <li><strong>Medication History:</strong> Note when you started/stopped specific hormonal or pain treatments.</li>
                        </ul>
                        <p className="mt-2">You can also attach photos or PDFs (like test results) to these records so everything is in one place for your doctor.</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="assistant">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-serif">
                    <MessageCircle className="h-6 w-6 text-primary" /> ELLA Care Assistant
                  </CardTitle>
                  <CardDescription>Your 24/7 AI companion powered by verified medical guidelines.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                    <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" /> Safety First
                    </h4>
                    <p className="text-sm text-primary/80">
                      ELLA is designed to be an educational tool, <strong>not a doctor</strong>. It cannot diagnose you or prescribe medication. In case of severe, sudden pain, heavy bleeding, or psychological distress, please seek immediate emergency care.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">How to Use the Assistant</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li><strong>Ask Questions:</strong> Type questions about symptoms, treatments, or terms (e.g., "What is dyspareunia?").</li>
                      <li><strong>Voice Input:</strong> Click the microphone icon to speak your question instead of typing.</li>
                      <li><strong>Citations:</strong> ELLA's answers will often include small badges showing where the information came from (e.g., ESHRE guidelines, NICE).</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="checker">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-serif">
                    <Activity className="h-6 w-6 text-primary" /> Symptom Checker & GP Summary
                  </CardTitle>
                  <CardDescription>Prepare for your next medical appointment.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <p className="text-muted-foreground">
                     The Symptom Checker is an interactive assessment tool. It guides you through a series of questions about your pain, cycle, and impact on daily life.
                   </p>
                   
                   <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Generating a Summary</h3>
                    <p className="text-muted-foreground">
                      After answering the questions, ELLA compiles your responses into a professional <strong>GP Summary Report</strong>. 
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground ml-2 space-y-2">
                      <li>The report highlights "Red Flags" that doctors look out for.</li>
                      <li>It gives a clear, chronological overview of your symptoms.</li>
                      <li>You can download it as a PDF or print it directly to hand to your doctor, saving time and ensuring you don't forget to mention anything important during your short appointment.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="hub">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-serif">
                    <BookOpen className="h-6 w-6 text-primary" /> Knowledge Hub (Learn)
                  </CardTitle>
                  <CardDescription>Access curated, scientifically-backed articles.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <p className="text-muted-foreground">
                     The internet is full of misinformation about endometriosis. The <strong>Learn</strong> section provides a safe space where every article is sourced from reputable institutions like ESHRE, NICE, and major medical journals.
                   </p>
                   
                   <div className="grid sm:grid-cols-2 gap-4">
                     <div className="border p-4 rounded-lg bg-muted/20">
                       <h4 className="font-semibold mb-2 flex items-center gap-2"><Zap className="h-4 w-4 text-orange-500"/> Searching</h4>
                       <p className="text-sm text-muted-foreground">Use the search bar at the top to find specific keywords or topics quickly.</p>
                     </div>
                     <div className="border p-4 rounded-lg bg-muted/20">
                       <h4 className="font-semibold mb-2 flex items-center gap-2"><FileText className="h-4 w-4 text-blue-500"/> Filtering</h4>
                       <p className="text-sm text-muted-foreground">Click the category tabs (Diagnosis, Treatment, Lifestyle, Research, Mental Health) to narrow down the articles.</p>
                     </div>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

        </Tabs>
      </div>
    </LayoutPatient>
  );
}
