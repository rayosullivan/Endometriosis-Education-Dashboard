import LayoutPatient from "@/components/layout-patient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronRight, AlertTriangle, Activity } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";

// Mock Question Flow
const QUESTIONS = [
  {
    id: "pain_level",
    title: "How severe is your pelvic pain today?",
    type: "slider",
    min: 0,
    max: 10,
    labels: ["No Pain", "Severe"],
  },
  {
    id: "cycle_timing",
    title: "Where are you in your menstrual cycle?",
    type: "choice",
    options: [
      { value: "menstruating", label: "Menstruating (Period)" },
      { value: "ovulating", label: "Ovulating" },
      { value: "luteal", label: "Luteal Phase (Before Period)" },
      { value: "unknown", label: "Not sure / Irregular" },
    ],
  },
  {
    id: "symptoms_list",
    title: "Are you experiencing any of these symptoms?",
    type: "choice_multi", // Simplified to radio for mock
    options: [
      { value: "bloating", label: "Severe Bloating ('Endo Belly')" },
      { value: "fatigue", label: "Extreme Fatigue" },
      { value: "nausea", label: "Nausea or Vomiting" },
      { value: "none", label: "None of the above" },
    ],
  },
  {
    id: "red_flags",
    title: "Safety Check",
    type: "choice",
    options: [
      { value: "severe_new", label: "Sudden, severe new pain" },
      { value: "fainting", label: "Feeling faint or dizzy" },
      { value: "heavy_bleeding", label: "Soaking >1 pad per hour" },
      { value: "no_red_flags", label: "No emergency symptoms" },
    ],
  },
];

export default function SymptomCheckPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [completed, setCompleted] = useState(false);
  const [showRedFlag, setShowRedFlag] = useState(false);

  const currentQuestion = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  const handleNext = () => {
    // Mock Logic for Red Flags
    if (currentQuestion.id === "red_flags" && answers["red_flags"] !== "no_red_flags" && answers["red_flags"]) {
      setShowRedFlag(true);
      return;
    }

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleValueChange = (value: any) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  if (showRedFlag) {
    return (
      <LayoutPatient>
        <div className="container max-w-md py-12 px-4">
          <Card className="border-destructive/50 shadow-xl shadow-destructive/10">
            <CardHeader className="bg-destructive/10 pb-8">
              <div className="mx-auto bg-destructive/20 p-4 rounded-full w-fit mb-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="text-center text-destructive font-serif text-2xl">Medical Attention Recommended</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Potential Emergency Symptom</AlertTitle>
                <AlertDescription>
                  Your response indicates a symptom that may require immediate assessment.
                </AlertDescription>
              </Alert>
              <p className="text-muted-foreground text-center">
                Please contact your GP, out-of-hours service, or local emergency department immediately if you are experiencing severe pain, heavy bleeding, or fainting.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full bg-destructive hover:bg-destructive/90 text-white" size="lg">Call Emergency Services (112/999)</Button>
              <Button variant="ghost" onClick={() => setShowRedFlag(false)}>Back to Assessment</Button>
            </CardFooter>
          </Card>
        </div>
      </LayoutPatient>
    );
  }

  if (completed) {
    return (
      <LayoutPatient>
        <div className="container max-w-md py-12 px-4">
          <Card className="border-primary/20 shadow-xl shadow-primary/5">
            <CardHeader className="text-center pb-8">
               <div className="mx-auto bg-primary/20 p-4 rounded-full w-fit mb-4">
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="font-serif text-2xl">Check-in Complete</CardTitle>
              <CardDescription>Your symptoms have been logged to your diary.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-secondary/50 p-4">
                <h4 className="font-semibold text-secondary-foreground mb-2">Summary</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between border-b border-white/50 pb-2">
                    <span>Pain Level</span>
                    <span className="font-medium text-foreground">{answers.pain_level || 0}/10</span>
                  </div>
                  <div className="flex justify-between border-b border-white/50 pb-2">
                    <span>Cycle Phase</span>
                    <span className="font-medium text-foreground capitalize">{answers.cycle_timing || "-"}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <h4 className="font-semibold text-primary mb-1 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Recommendation
                </h4>
                <p className="text-sm text-muted-foreground">
                  Based on your pain level of {answers.pain_level}, consider using a heat pack and gentle stretching. Continue to monitor for any changes.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Link href="/dashboard">
                 {/* This would normally be "My Health", but linking to clinician dash for demo purposes */}
                 <Button className="w-full">View My Symptom Diary</Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="w-full">Return Home</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </LayoutPatient>
    );
  }

  return (
    <LayoutPatient>
      <div className="container max-w-lg py-12 px-4">
        <div className="mb-8">
           <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Symptom Check-in</span>
              <span>Step {step + 1} of {QUESTIONS.length}</span>
           </div>
           <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="min-h-[400px] flex flex-col">
              <CardHeader>
                <CardTitle className="font-serif text-2xl leading-tight">
                  {currentQuestion.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pt-6">
                {currentQuestion.type === "slider" && (
                  <div className="space-y-8 px-2">
                    <div className="flex justify-center">
                       <span className="text-6xl font-bold text-primary">{answers[currentQuestion.id] || 0}</span>
                    </div>
                    <Slider
                      defaultValue={[0]}
                      max={currentQuestion.max}
                      min={currentQuestion.min}
                      step={1}
                      value={[answers[currentQuestion.id] || 0]}
                      onValueChange={(val) => handleValueChange(val[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-muted-foreground text-sm font-medium">
                      <span>{currentQuestion.labels?.[0]}</span>
                      <span>{currentQuestion.labels?.[1]}</span>
                    </div>
                  </div>
                )}

                {(currentQuestion.type === "choice" || currentQuestion.type === "choice_multi") && (
                  <RadioGroup 
                    onValueChange={handleValueChange} 
                    value={answers[currentQuestion.id]}
                    className="space-y-3"
                  >
                    {currentQuestion.options?.map((option) => (
                      <div key={option.value} className={`
                        flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-all
                        ${answers[currentQuestion.id] === option.value ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50"}
                      `}>
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer font-medium">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
              <CardFooter className="pt-6 border-t bg-muted/20">
                <Button 
                  onClick={handleNext} 
                  className="w-full gap-2"
                  disabled={!answers[currentQuestion.id] && currentQuestion.type !== "slider"}
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </LayoutPatient>
  );
}
