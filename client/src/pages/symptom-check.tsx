import LayoutPatient from "@/components/layout-patient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, Activity, FileText, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { assessmentService } from "@/lib/assessment-service";
import type { EndoPainScoring, Demographics, MedicalReport } from "@/lib/endo-types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Initial State
const INITIAL_DEMOGRAPHICS: Demographics = {
  age: null,
  yearsWithSymptoms: null,
  email: "",
};

const INITIAL_SCORING: EndoPainScoring = {
  painDisability: {
    pelvicPainSeverity: 0,
    dysmenorrheaIntensity: 0,
    dailyActivityInterference: 0,
    workAbsenceDays: 0,
    sleepDisruption: 0,
  },
  bowelSymptoms: {
    dyscheziaSeverity: 0,
    cyclicalBowelPain: 0,
    menstrualBowelChanges: false,
    rectalBleeding: false,
    bloatingCramping: 0,
  },
  dyspareunia: {
    deepDyspareunia: 0,
    superficialDyspareunia: 0,
    postCoitalPain: 0,
    relationshipImpact: 0,
    avoidanceBehavior: false,
  },
  urinarySymptoms: {
    dysuriaSeverity: 0,
    urgencyFrequency: 0,
    cyclicalUrinarySymptoms: false,
    menstrualHematuria: false,
    bladderPressure: 0,
  },
};

const STEPS = [
  "Welcome",
  "Demographics",
  "Pain & Disability",
  "Bowel Symptoms",
  "Sexual Health",
  "Urinary Symptoms",
  "Results"
];

export default function SymptomCheckPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [demographics, setDemographics] = useState<Demographics>(INITIAL_DEMOGRAPHICS);
  const [scoring, setScoring] = useState<EndoPainScoring>(INITIAL_SCORING);
  const [report, setReport] = useState<MedicalReport | null>(null);
  
  // GP Letter Dialog State
  const [isGpDialogOpen, setIsGpDialogOpen] = useState(false);
  const [gpDetails, setGpDetails] = useState({ name: "", address: "" });

  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStepIndex === STEPS.length - 2) {
      calculateResults();
    }
    setCurrentStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const updateScoring = (section: keyof EndoPainScoring, field: string, value: any) => {
    setScoring((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const calculateResults = () => {
    const risk = assessmentService.calculator.calculateRisk(scoring, demographics);
    let category: 'Low' | 'Moderate' | 'High' | 'Very High' = 'Low';
    
    if (risk > 70) category = 'Very High';
    else if (risk >= 30) category = 'Moderate';
    else category = 'Low';

    const redFlags: string[] = [];
    if (scoring.bowelSymptoms.rectalBleeding) redFlags.push("Rectal bleeding during period");
    if (scoring.urinarySymptoms.menstrualHematuria) redFlags.push("Blood in urine during period");
    if (scoring.painDisability.pelvicPainSeverity >= 9) redFlags.push("Severe incapacitating pelvic pain");

    const newReport: MedicalReport = {
      patientId: `PAT-${Math.floor(Math.random() * 10000)}`,
      assessmentDate: new Date(),
      riskScore: risk,
      riskCategory: category,
      endopainBreakdown: scoring,
      demographics: demographics,
      clinicalRecommendations: [
        "Consult with an endometriosis specialist for further evaluation.",
        "Maintain a detailed symptom diary using the dashboard.",
        "Consider pelvic floor physical therapy if dyspareunia is present."
      ],
      redFlags: redFlags,
      suggestedInvestigations: [
        "Transvaginal Ultrasound (TVUS) with bowel preparation",
        "MRI Pelvis (if deep endometriosis suspected)"
      ]
    };
    setReport(newReport);
  };

  const renderStep = () => {
    switch (currentStepIndex) {
      case 0: // Welcome
        return (
          <div className="space-y-6 text-center py-8">
            <div className="mx-auto bg-primary/10 p-6 rounded-full w-fit">
              <Activity className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-3xl font-serif font-bold">Endometriosis Symptom Assessment</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              This tool uses the ENDOPAIN-4D framework to assess your symptoms and estimate your risk profile. It is not a medical diagnosis.
            </p>
            <Button size="lg" onClick={handleNext} className="mt-4 w-full sm:w-auto">
              Start Assessment <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case 1: // Demographics
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>What is your age?</Label>
              <Input 
                type="number" 
                value={demographics.age || ""} 
                onChange={(e) => setDemographics({...demographics, age: parseInt(e.target.value) || null})}
                placeholder="e.g. 28"
              />
            </div>
            <div className="space-y-4">
              <Label>Years with symptoms?</Label>
              <Input 
                type="number" 
                value={demographics.yearsWithSymptoms || ""} 
                onChange={(e) => setDemographics({...demographics, yearsWithSymptoms: parseInt(e.target.value) || null})}
                placeholder="e.g. 5"
              />
            </div>
            <div className="space-y-4">
              <Label>Email (Optional)</Label>
              <Input 
                type="email" 
                value={demographics.email || ""} 
                onChange={(e) => setDemographics({...demographics, email: e.target.value})}
                placeholder="For your report..."
              />
            </div>
          </div>
        );

      case 2: // Pain
        return (
          <div className="space-y-8">
            <SliderField 
              label="Average Pelvic Pain (0-10)" 
              value={scoring.painDisability.pelvicPainSeverity}
              onChange={(v) => updateScoring('painDisability', 'pelvicPainSeverity', v)}
            />
            <SliderField 
              label="Period Pain Intensity (Dysmenorrhea) (0-10)" 
              value={scoring.painDisability.dysmenorrheaIntensity}
              onChange={(v) => updateScoring('painDisability', 'dysmenorrheaIntensity', v)}
            />
            <SliderField 
              label="Activity Interference (0-5)" 
              value={scoring.painDisability.dailyActivityInterference}
              max={5}
              onChange={(v) => updateScoring('painDisability', 'dailyActivityInterference', v)}
            />
             <div className="space-y-4">
              <Label>Days of work/school missed (last month)</Label>
              <Input 
                type="number" 
                value={scoring.painDisability.workAbsenceDays} 
                onChange={(e) => updateScoring('painDisability', 'workAbsenceDays', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        );

      case 3: // Bowel
        return (
          <div className="space-y-8">
            <SliderField 
              label="Painful Bowel Movements (Dyschezia) (0-10)" 
              value={scoring.bowelSymptoms.dyscheziaSeverity}
              onChange={(v) => updateScoring('bowelSymptoms', 'dyscheziaSeverity', v)}
            />
            <SliderField 
              label="Cyclical Bowel Pain (0-10)" 
              value={scoring.bowelSymptoms.cyclicalBowelPain}
              onChange={(v) => updateScoring('bowelSymptoms', 'cyclicalBowelPain', v)}
            />
            <CheckboxField 
              label="Do bowel habits change with your period?"
              checked={scoring.bowelSymptoms.menstrualBowelChanges}
              onCheckedChange={(c) => updateScoring('bowelSymptoms', 'menstrualBowelChanges', c)}
            />
            <CheckboxField 
              label="Have you experienced rectal bleeding during period?"
              checked={scoring.bowelSymptoms.rectalBleeding}
              onCheckedChange={(c) => updateScoring('bowelSymptoms', 'rectalBleeding', c)}
              warning="This is a potential Red Flag symptom."
            />
          </div>
        );

      case 4: // Sexual
        return (
          <div className="space-y-8">
            <div className="bg-muted/30 p-4 rounded-lg text-sm text-muted-foreground mb-4">
              Note: You can skip this section if it doesn't apply to you.
            </div>
            <SliderField 
              label="Deep Pain During Intercourse (0-10)" 
              value={scoring.dyspareunia.deepDyspareunia}
              onChange={(v) => updateScoring('dyspareunia', 'deepDyspareunia', v)}
            />
            <SliderField 
              label="Superficial Pain (0-10)" 
              value={scoring.dyspareunia.superficialDyspareunia}
              onChange={(v) => updateScoring('dyspareunia', 'superficialDyspareunia', v)}
            />
            <CheckboxField 
              label="Do you avoid intimacy due to pain?"
              checked={scoring.dyspareunia.avoidanceBehavior}
              onCheckedChange={(c) => updateScoring('dyspareunia', 'avoidanceBehavior', c)}
            />
          </div>
        );

      case 5: // Urinary
        return (
          <div className="space-y-8">
            <SliderField 
              label="Painful Urination (Dysuria) (0-10)" 
              value={scoring.urinarySymptoms.dysuriaSeverity}
              onChange={(v) => updateScoring('urinarySymptoms', 'dysuriaSeverity', v)}
            />
            <SliderField 
              label="Urgency / Frequency (0-10)" 
              value={scoring.urinarySymptoms.urgencyFrequency}
              onChange={(v) => updateScoring('urinarySymptoms', 'urgencyFrequency', v)}
            />
             <CheckboxField 
              label="Worse during period?"
              checked={scoring.urinarySymptoms.cyclicalUrinarySymptoms}
              onCheckedChange={(c) => updateScoring('urinarySymptoms', 'cyclicalUrinarySymptoms', c)}
            />
             <CheckboxField 
              label="Blood in urine during period?"
              checked={scoring.urinarySymptoms.menstrualHematuria}
              onCheckedChange={(c) => updateScoring('urinarySymptoms', 'menstrualHematuria', c)}
              warning="This is a potential Red Flag symptom."
            />
          </div>
        );

      case 6: // Results
        if (!report) return null;
        return (
          <div className="space-y-8 text-center">
            <div className="space-y-2">
              <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-serif font-bold">Assessment Complete</h2>
              <p className="text-muted-foreground">Your estimated risk probability:</p>
            </div>

            <div className="py-8">
              <div className="text-6xl font-bold text-primary mb-2">
                {report.riskScore}%
              </div>
              <div className={`text-xl font-medium px-4 py-1 rounded-full w-fit mx-auto ${
                report.riskCategory === 'Very High' ? 'bg-destructive/10 text-destructive' : 
                report.riskCategory === 'High' ? 'bg-orange-100 text-orange-700' :
                'bg-green-100 text-green-700'
              }`}>
                {report.riskCategory} Risk Profile
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 max-w-md mx-auto">
              <Button onClick={() => assessmentService.reportGenerator.generatePDF(report)} variant="outline" className="h-12">
                <Download className="mr-2 h-4 w-4" /> Download Report
              </Button>
              <Dialog open={isGpDialogOpen} onOpenChange={setIsGpDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="h-12">
                    <FileText className="mr-2 h-4 w-4" /> GP Referral Letter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate GP Referral Letter</DialogTitle>
                    <DialogDescription>
                      Enter your GP's details to personalize the referral letter.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>GP Name</Label>
                      <Input 
                        placeholder="Dr. Jane Smith" 
                        value={gpDetails.name}
                        onChange={(e) => setGpDetails({...gpDetails, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Clinic Address</Label>
                      <Input 
                        placeholder="123 Medical Center Rd..." 
                        value={gpDetails.address}
                        onChange={(e) => setGpDetails({...gpDetails, address: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => {
                       assessmentService.reportGenerator.generateReferralLetter(report, gpDetails);
                       setIsGpDialogOpen(false);
                    }}>
                      Generate Letter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="border-t pt-6 mt-8">
               <Link href="/dashboard">
                 <Button variant="link">Go to Dashboard</Button>
               </Link>
            </div>
          </div>
        );
        
      default: return null;
    }
  };

  return (
    <LayoutPatient>
      <div className="container max-w-xl py-12 px-4">
        {currentStepIndex > 0 && currentStepIndex < 6 && (
          <div className="mb-8">
             <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>{STEPS[currentStepIndex]}</span>
                <span>Step {currentStepIndex} of {STEPS.length - 1}</span>
             </div>
             <Progress value={progress} className="h-2" />
          </div>
        )}

        <Card className="min-h-[400px] flex flex-col shadow-lg border-primary/10">
          <CardHeader>
             {currentStepIndex > 0 && currentStepIndex < 6 && (
               <CardTitle className="font-serif text-2xl">{STEPS[currentStepIndex]}</CardTitle>
             )}
          </CardHeader>
          <CardContent className="flex-1">
             <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {renderStep()}
                </motion.div>
             </AnimatePresence>
          </CardContent>
          
          {currentStepIndex > 0 && currentStepIndex < 6 && (
            <CardFooter className="flex justify-between border-t bg-muted/20 p-6">
               <Button variant="ghost" onClick={handleBack}>
                 <ChevronLeft className="mr-2 h-4 w-4" /> Back
               </Button>
               <Button onClick={handleNext}>
                 {currentStepIndex === STEPS.length - 2 ? "Finish" : "Next"} <ChevronRight className="ml-2 h-4 w-4" />
               </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </LayoutPatient>
  );
}

function SliderField({ label, value, onChange, max = 10 }: { label: string, value: number, onChange: (val: number) => void, max?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Label className="text-base">{label}</Label>
        <span className="font-bold text-primary">{value}</span>
      </div>
      <Slider
        min={0}
        max={max}
        step={1}
        value={[value]}
        onValueChange={(val) => onChange(val[0])}
        className="py-2"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>None</span>
        <span>Severe</span>
      </div>
    </div>
  );
}

function CheckboxField({ label, checked, onCheckedChange, warning }: { label: string, checked: boolean, onCheckedChange: (c: boolean) => void, warning?: string }) {
  return (
    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
      <Checkbox 
        id={label} 
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <div className="grid gap-1.5 leading-none">
        <Label 
          htmlFor={label}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          {label}
        </Label>
        {warning && (
          <p className="text-xs text-destructive flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3" /> {warning}
          </p>
        )}
      </div>
    </div>
  );
}
