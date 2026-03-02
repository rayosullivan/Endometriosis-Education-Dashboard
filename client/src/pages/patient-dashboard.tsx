import LayoutPatient from "@/components/layout-patient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar"; // Assuming shadcn calendar exists or using day-picker directly
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { format } from "date-fns";
import { Plus, Save, Activity, Droplet, MapPin, Zap, Calendar as CalendarIcon, History, Sparkles, TrendingUp, AlertTriangle, Pill, FileText, Camera, Upload, Scissors, ScanLine } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

// Mock Data Structure for Diary Entry
type DiaryEntry = {
  date: Date;
  painLevel: number;
  flow?: string;
  painLocations: string[];
  triggers: string[];
  medications: string[];
  notes: string;
};

// Mock History Records
type MedicalHistoryRecord = {
  id: string;
  type: 'surgery' | 'imaging' | 'medication';
  title: string;
  date: string;
  provider?: string;
  notes?: string;
  attachments?: string[];
};

// Initial state for a new entry
const INITIAL_ENTRY = {
  painLevel: 0,
  flow: "none",
  painLocations: [] as string[],
  triggers: [] as string[],
  medications: [] as string[],
  notes: "",
};

export default function PatientDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [currentEntry, setCurrentEntry] = useState(INITIAL_ENTRY);
  
  // New State for History
  const [historyRecords, setHistoryRecords] = useState<MedicalHistoryRecord[]>([
    { id: "1", type: "surgery", title: "Diagnostic Laparoscopy", date: "2024-05-15", provider: "Dr. Smith", notes: "Excision of stage 2 endometriosis.", attachments: ["report.pdf"] },
    { id: "2", type: "imaging", title: "Pelvic MRI", date: "2024-03-10", provider: "City Imaging Center", notes: "Deep infiltrating endometriosis suspected.", attachments: ["mri_scan.jpg"] },
    { id: "3", type: "medication", title: "Dienogest (Visanne)", date: "2024-06-01", notes: "Started 2mg daily.", attachments: [] },
  ]);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [newRecordType, setNewRecordType] = useState<'surgery' | 'imaging' | 'medication'>('surgery');

  // Mock History Data
  const [history, setHistory] = useState<DiaryEntry[]>([
    { date: new Date(2026, 1, 10), painLevel: 4, flow: "light", painLocations: ["Pelvis"], triggers: [], medications: [], notes: "Mild cramping" },
    { date: new Date(2026, 1, 11), painLevel: 7, flow: "medium", painLocations: ["Pelvis", "Back"], triggers: ["Bowel Movement"], medications: ["Paracetamol"], notes: "Pain worsened in afternoon" },
    { date: new Date(2026, 1, 12), painLevel: 6, flow: "medium", painLocations: ["Pelvis"], triggers: ["Stress"], medications: ["Naproxen"], notes: "Consistent ache all day" },
    { date: new Date(2026, 1, 14), painLevel: 3, flow: "spotting", painLocations: ["Lower Back"], triggers: ["Exercise"], medications: [], notes: "Felt better after yoga" },
  ]);

  const generateSummary = () => {
    setIsGeneratingSummary(true);
    setSummaryData(null);
    
    // Simulate AI Processing
    setTimeout(() => {
      const avgPain = history.reduce((acc, curr) => acc + curr.painLevel, 0) / (history.length || 1);
      const triggers = history.flatMap(h => h.triggers);
      const mostCommonTrigger = triggers.sort((a,b) =>
        triggers.filter(v => v===a).length - triggers.filter(v => v===b).length
      ).pop() || "None";

      setSummaryData({
        period: "Last 30 Days",
        avgPain: avgPain.toFixed(1),
        painTrend: avgPain > 5 ? "Increasing" : "Stable",
        commonTrigger: mostCommonTrigger,
        keyInsight: "Your symptoms appear to correlate with high-stress days. Pain levels have remained moderate but consistent.",
        symptomBurden: 65, // Mock score
        recommendation: "Consider scheduling relaxation techniques on anticipated stressful days based on your trigger patterns."
      });
      setIsGeneratingSummary(false);
    }, 2000);
  };

  const handleSaveEntry = () => {
    if (!date) return;
    const newEntry: DiaryEntry = {
      date: date,
      ...currentEntry
    };
    setHistory([...history, newEntry]);
    setIsLogOpen(false);
    setCurrentEntry(INITIAL_ENTRY);
  };

  const toggleSelection = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  return (
    <LayoutPatient>
      <div className="container max-w-6xl py-8 px-4">
        
        <Tabs defaultValue="journal" className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">My Endo Journal</h1>
              <p className="text-muted-foreground">Track your symptoms and manage your medical history.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <TabsList>
                <TabsTrigger value="journal">Daily Journal</TabsTrigger>
                <TabsTrigger value="history">Past History</TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="journal" className="space-y-8">
            <div className="flex justify-end gap-2 mb-4">
              <Dialog open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5" onClick={generateSummary}>
                     <Sparkles className="mr-2 h-4 w-4 text-purple-500" /> AI Insights
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      AI Health Summary
                    </DialogTitle>
                    <DialogDescription>
                      Analysis of your symptom logs for the last 30 days.
                    </DialogDescription>
                  </DialogHeader>
                  
                  {isGeneratingSummary ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-purple-500 animate-pulse" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground animate-pulse">Analyzing symptom patterns...</p>
                    </div>
                  ) : summaryData ? (
                    <div className="space-y-6 py-4">
                      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 space-y-3">
                        <h4 className="font-semibold text-purple-900 flex items-center gap-2">
                          <Activity className="h-4 w-4" /> Key Insight
                        </h4>
                        <p className="text-sm text-purple-800 leading-relaxed">
                          {summaryData.keyInsight}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 border rounded-lg p-3">
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> Pain Trend
                          </div>
                          <div className="text-xl font-bold">{summaryData.painTrend}</div>
                        </div>
                        <div className="space-y-1 border rounded-lg p-3">
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Top Trigger
                          </div>
                          <div className="text-xl font-bold truncate" title={summaryData.commonTrigger}>{summaryData.commonTrigger}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                         <div className="flex justify-between text-sm">
                           <span className="text-muted-foreground">Symptom Burden Score</span>
                           <span className="font-bold">{summaryData.symptomBurden}/100</span>
                         </div>
                         <Progress value={summaryData.symptomBurden} className="h-2" />
                      </div>

                      <div className="bg-muted/30 rounded-lg p-4">
                         <h4 className="font-semibold text-sm mb-2">Recommendation</h4>
                         <p className="text-sm text-muted-foreground">
                           {summaryData.recommendation}
                         </p>
                      </div>
                    </div>
                  ) : null}
                </DialogContent>
              </Dialog>

              <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="shadow-lg shadow-primary/20">
                  <Plus className="mr-2 h-5 w-5" /> Log Symptoms
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">Daily Check-in</DialogTitle>
                <DialogDescription>
                  {date ? format(date, "EEEE, MMMM do, yyyy") : "Select a date"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-8 py-4">
                {/* Pain Level */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-500" /> Pain Severity
                    </Label>
                    <span className="text-2xl font-bold text-primary">{currentEntry.painLevel}</span>
                  </div>
                  <Slider 
                    value={[currentEntry.painLevel]} 
                    max={10} 
                    step={1} 
                    onValueChange={(v) => setCurrentEntry({...currentEntry, painLevel: v[0]})}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>No Pain</span>
                    <span>Worst Possible</span>
                  </div>
                </div>

                {/* Period / Flow */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-red-500" /> Menstruation
                  </Label>
                  <RadioGroup 
                    value={currentEntry.flow} 
                    onValueChange={(v) => setCurrentEntry({...currentEntry, flow: v})}
                    className="flex flex-wrap gap-2"
                  >
                    {['none', 'spotting', 'light', 'medium', 'heavy'].map((flow) => (
                      <div key={flow}>
                        <RadioGroupItem value={flow} id={`flow-${flow}`} className="peer sr-only" />
                        <Label 
                          htmlFor={`flow-${flow}`}
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer capitalize w-20 text-center"
                        >
                          {flow}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Pain Locations (Visual-ish selection) */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> Location of Pain
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['Lower Abdomen', 'Lower Back', 'Pelvis (Deep)', 'Vagina', 'Rectum', 'Thighs/Legs'].map((loc) => (
                      <Button
                        key={loc}
                        variant={currentEntry.painLocations.includes(loc) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSelection(currentEntry.painLocations, loc, (val) => setCurrentEntry({...currentEntry, painLocations: val}))}
                        className="justify-start h-auto py-2"
                      >
                        {loc}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Triggers */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" /> Triggers / Context
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {['Bowel Movement', 'Urination', 'Sex (During)', 'Sex (After)', 'Exercise', 'Stress'].map((trigger) => (
                      <Badge
                        key={trigger}
                        variant={currentEntry.triggers.includes(trigger) ? "default" : "outline"}
                        className={`cursor-pointer px-3 py-1.5 text-sm ${currentEntry.triggers.includes(trigger) ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "hover:bg-muted"}`}
                        onClick={() => toggleSelection(currentEntry.triggers, trigger, (val) => setCurrentEntry({...currentEntry, triggers: val}))}
                      >
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Medications */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Pill className="h-4 w-4 text-green-600" /> Pain Relief / Medications
                  </Label>
                  <Select onValueChange={(val) => {
                     if (!currentEntry.medications.includes(val)) {
                        setCurrentEntry({...currentEntry, medications: [...currentEntry.medications, val]});
                     }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add medication..." />
                    </SelectTrigger>
                    <SelectContent>
                      {['Paracetamol', 'Codeine', 'Tramadol', 'Ponstan (Mefenamic Acid)', 'Diclofenac', 'Naproxen', 'Ibuprofen', 'Gabapentin'].map((med) => (
                        <SelectItem key={med} value={med}>{med}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentEntry.medications.length === 0 && <span className="text-sm text-muted-foreground italic">No medications logged</span>}
                    {currentEntry.medications.map(med => (
                      <Badge 
                        key={med} 
                        variant="secondary" 
                        className="gap-1 pr-1 bg-green-50 text-green-700 hover:bg-green-100"
                        onClick={() => toggleSelection(currentEntry.medications, med, (val) => setCurrentEntry({...currentEntry, medications: val}))}
                      >
                        {med} <span className="text-xs ml-1 cursor-pointer">×</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea 
                    placeholder="Any other symptoms or details..." 
                    value={currentEntry.notes}
                    onChange={(e) => setCurrentEntry({...currentEntry, notes: e.target.value})}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleSaveEntry} className="w-full sm:w-auto">
                  <Save className="mr-2 h-4 w-4" /> Save Entry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 h-fit"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendar</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                 <Calendar 
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border shadow-sm"
                    modifiers={{
                      hasEntry: (d) => history.some(h => format(h.date, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')),
                      highPain: (d) => history.some(h => format(h.date, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd') && h.painLevel >= 7)
                    }}
                    modifiersClassNames={{
                      hasEntry: "bg-primary/20 font-bold",
                      highPain: "bg-destructive/20 text-destructive font-bold"
                    }}
                 />
              </CardContent>
            </Card>
          </motion.div>

          {/* Diary Feed / Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.4 }}
               >
                 <Card className="bg-primary/5 border-none shadow-sm h-full">
                   <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                      <span className="text-3xl font-bold text-primary">
                        {history.filter(h => h.painLevel > 0).length}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Pain Days (Month)</span>
                   </CardContent>
                 </Card>
               </motion.div>
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.4, delay: 0.1 }}
               >
                 <Card className="bg-secondary/10 border-none shadow-sm h-full">
                   <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                      <span className="text-3xl font-bold text-secondary-foreground">
                         {(history.reduce((acc, curr) => acc + curr.painLevel, 0) / (history.length || 1)).toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Avg Pain Level</span>
                   </CardContent>
                 </Card>
               </motion.div>
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.4, delay: 0.2 }}
                 className="hidden sm:block"
               >
                 <Card className="bg-orange-50 border-none shadow-sm h-full">
                   <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                      <span className="text-3xl font-bold text-orange-600">
                        {history.filter(h => h.triggers.length > 0).length}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Trigger Events</span>
                   </CardContent>
                 </Card>
               </motion.div>
            </div>

            {/* Recent Entries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-muted-foreground" /> Recent Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {history.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        No entries yet. Start logging to see your history.
                      </div>
                    ) : (
                      [...history].reverse().map((entry, idx) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                          <div className="flex-shrink-0 flex flex-col items-center justify-center bg-muted/30 rounded-lg p-2 w-16 h-16 text-center">
                             <span className="text-xs font-semibold text-muted-foreground uppercase">{format(entry.date, "MMM")}</span>
                             <span className="text-xl font-bold text-foreground">{format(entry.date, "dd")}</span>
                          </div>
                          <div className="flex-1 space-y-2">
                             <div className="flex justify-between items-start">
                               <div className="flex items-center gap-2">
                                  <Badge variant={entry.painLevel >= 7 ? "destructive" : entry.painLevel > 3 ? "secondary" : "outline"}>
                                    Pain: {entry.painLevel}/10
                                  </Badge>
                                  {entry.flow !== 'none' && (
                                    <Badge variant="outline" className="capitalize text-red-500 border-red-200 bg-red-50">
                                      <Droplet className="h-3 w-3 mr-1" /> {entry.flow}
                                    </Badge>
                                  )}
                               </div>
                             </div>
                             
                             <div className="flex flex-wrap gap-1">
                                {entry.painLocations.map(loc => (
                                  <span key={loc} className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{loc}</span>
                                ))}
                             </div>

                             {entry.triggers.length > 0 && (
                               <div className="text-xs text-orange-600 flex items-center gap-1">
                                  <Zap className="h-3 w-3" /> Triggers: {entry.triggers.join(", ")}
                               </div>
                             )}

                             {entry.medications && entry.medications.length > 0 && (
                               <div className="text-xs text-green-700 flex items-center gap-1">
                                  <Pill className="h-3 w-3" /> Meds: {entry.medications.join(", ")}
                               </div>
                             )}

                             {entry.notes && (
                               <p className="text-sm text-muted-foreground italic mt-1">"{entry.notes}"</p>
                             )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            </motion.div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
            <div className="flex justify-end mb-6">
              <Dialog open={isAddRecordOpen} onOpenChange={setIsAddRecordOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Record
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Medical Record</DialogTitle>
                    <DialogDescription>Document a past surgery, imaging, or medication.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Record Type</Label>
                      <Select value={newRecordType} onValueChange={(v: any) => setNewRecordType(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="surgery">Surgery</SelectItem>
                          <SelectItem value="imaging">Imaging (MRI/CT/Ultrasound)</SelectItem>
                          <SelectItem value="medication">Medication History</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Title / Procedure Name</Label>
                      <Input placeholder={newRecordType === 'surgery' ? 'e.g. Laparoscopy' : newRecordType === 'imaging' ? 'e.g. Pelvic MRI' : 'e.g. Visanne'} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label>Provider / Clinic</Label>
                        <Input placeholder="e.g. Dr. Smith" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Notes / Findings</Label>
                      <Textarea placeholder="Details about the procedure or medication..." />
                    </div>

                    <div className="space-y-2">
                      <Label>Attachments</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex gap-4 mb-2">
                          <Button variant="outline" size="sm">
                            <Camera className="mr-2 h-4 w-4" /> Take Photo
                          </Button>
                          <Button variant="outline" size="sm">
                            <Upload className="mr-2 h-4 w-4" /> Upload PDF
                          </Button>
                        </div>
                        <p className="text-xs">Supports JPG, PNG, PDF</p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setIsAddRecordOpen(false)}>Save Record</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-8">
              {/* Surgeries Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-bold flex items-center gap-2">
                  <Scissors className="h-5 w-5 text-primary" /> Surgical History
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {historyRecords.filter(r => r.type === 'surgery').map(record => (
                    <Card key={record.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{record.title}</CardTitle>
                          <Badge variant="outline">{record.date}</Badge>
                        </div>
                        <CardDescription>{record.provider}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{record.notes}</p>
                        {record.attachments && record.attachments.length > 0 && (
                          <div className="mt-3 flex gap-2">
                            {record.attachments.map(file => (
                              <Badge key={file} variant="secondary" className="gap-1 text-xs">
                                <FileText className="h-3 w-3" /> {file}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {historyRecords.filter(r => r.type === 'surgery').length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground text-sm py-8 border rounded-lg border-dashed">
                      No surgeries recorded.
                    </div>
                  )}
                </div>
              </div>

              {/* Imaging Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-bold flex items-center gap-2">
                  <ScanLine className="h-5 w-5 text-blue-600" /> Imaging Reports
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {historyRecords.filter(r => r.type === 'imaging').map(record => (
                    <Card key={record.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{record.title}</CardTitle>
                          <Badge variant="outline">{record.date}</Badge>
                        </div>
                        <CardDescription>{record.provider}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{record.notes}</p>
                        {record.attachments && record.attachments.length > 0 && (
                          <div className="mt-3 flex gap-2">
                            {record.attachments.map(file => (
                              <Badge key={file} variant="secondary" className="gap-1 text-xs">
                                <FileText className="h-3 w-3" /> {file}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {historyRecords.filter(r => r.type === 'imaging').length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground text-sm py-8 border rounded-lg border-dashed">
                      No imaging reports recorded.
                    </div>
                  )}
                </div>
              </div>

              {/* Medications Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-bold flex items-center gap-2">
                  <Pill className="h-5 w-5 text-green-600" /> Medication History
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {historyRecords.filter(r => r.type === 'medication').map(record => (
                    <Card key={record.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{record.title}</CardTitle>
                          <Badge variant="outline">{record.date}</Badge>
                        </div>
                        <CardDescription>{record.provider}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{record.notes}</p>
                      </CardContent>
                    </Card>
                  ))}
                  {historyRecords.filter(r => r.type === 'medication').length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground text-sm py-8 border rounded-lg border-dashed">
                      No medication history recorded.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </LayoutPatient>
  );
}
