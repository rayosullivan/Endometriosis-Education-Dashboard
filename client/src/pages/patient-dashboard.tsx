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
import { Plus, Save, Activity, Droplet, MapPin, Zap, Calendar as CalendarIcon, History } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock Data Structure for Diary Entry
type DiaryEntry = {
  date: Date;
  painLevel: number;
  flow?: string;
  painLocations: string[];
  triggers: string[];
  notes: string;
};

// Initial state for a new entry
const INITIAL_ENTRY = {
  painLevel: 0,
  flow: "none",
  painLocations: [] as string[],
  triggers: [] as string[],
  notes: "",
};

export default function PatientDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(INITIAL_ENTRY);
  
  // Mock History Data
  const [history, setHistory] = useState<DiaryEntry[]>([
    { date: new Date(2026, 1, 10), painLevel: 4, flow: "light", painLocations: ["Pelvis"], triggers: [], notes: "Mild cramping" },
    { date: new Date(2026, 1, 11), painLevel: 7, flow: "medium", painLocations: ["Pelvis", "Back"], triggers: ["Bowel Movement"], notes: "Pain worsened in afternoon" },
  ]);

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">My Health Journal</h1>
            <p className="text-muted-foreground">Track your symptoms daily to identify patterns.</p>
          </div>
          <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-lg shadow-primary/20">
                <Plus className="mr-2 h-5 w-5" /> Log Symptoms for Today
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
          <Card className="lg:col-span-1 h-fit">
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

          {/* Diary Feed / Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
               <Card className="bg-primary/5 border-none shadow-sm">
                 <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold text-primary">
                      {history.filter(h => h.painLevel > 0).length}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Pain Days (Month)</span>
                 </CardContent>
               </Card>
               <Card className="bg-secondary/10 border-none shadow-sm">
                 <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold text-secondary-foreground">
                       {(history.reduce((acc, curr) => acc + curr.painLevel, 0) / (history.length || 1)).toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Avg Pain Level</span>
                 </CardContent>
               </Card>
               <Card className="bg-orange-50 border-none shadow-sm hidden sm:block">
                 <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold text-orange-600">
                      {history.filter(h => h.triggers.length > 0).length}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Trigger Events</span>
                 </CardContent>
               </Card>
            </div>

            {/* Recent Entries */}
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
          </div>
        </div>
      </div>
    </LayoutPatient>
  );
}
