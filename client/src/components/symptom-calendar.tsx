import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Activity, Droplet, AlertCircle } from "lucide-react";

// Mock data for symptom history
const SYMPTOM_HISTORY: Record<string, { pain: number; flow?: string; notes?: string }> = {
  "2026-02-10": { pain: 4, flow: "Light", notes: "Mild cramping" },
  "2026-02-11": { pain: 6, flow: "Medium", notes: "Fatigue" },
  "2026-02-12": { pain: 8, flow: "Heavy", notes: "Severe pain, took medication" },
};

export function SymptomCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to determine modifiers for the calendar
  const modifiers = {
    hasSymptom: (date: Date) => {
      const key = format(date, "yyyy-MM-dd");
      return !!SYMPTOM_HISTORY[key];
    },
    highPain: (date: Date) => {
      const key = format(date, "yyyy-MM-dd");
      return SYMPTOM_HISTORY[key]?.pain >= 7;
    },
  };

  const modifiersStyles = {
    hasSymptom: { border: "2px solid var(--primary)" },
    highPain: { backgroundColor: "var(--destructive)", color: "white" },
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsDialogOpen(true);
  };

  const selectedData = selectedDate ? SYMPTOM_HISTORY[format(selectedDate, "yyyy-MM-dd")] : null;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Symptom Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <style>{`
          .rdp-day_selected { 
            background-color: var(--primary) !important; 
            color: var(--primary-foreground) !important; 
          }
          .rdp-button:hover:not([disabled]) { 
            background-color: var(--secondary); 
            color: var(--secondary-foreground);
          }
        `}</style>
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          onDayClick={handleDayClick}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="p-4 bg-background rounded-lg border shadow-sm"
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Symptom Log: {selectedDate ? format(selectedDate, "MMMM do, yyyy") : ""}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedData ? (
                <>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <span className="font-medium">Pain Level</span>
                    <Badge variant={selectedData.pain >= 7 ? "destructive" : "secondary"}>
                      {selectedData.pain}/10
                    </Badge>
                  </div>
                  {selectedData.flow && (
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <span className="font-medium flex items-center gap-2">
                        <Droplet className="h-4 w-4 text-blue-500" /> Flow
                      </span>
                      <span>{selectedData.flow}</span>
                    </div>
                  )}
                  {selectedData.notes && (
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <span className="font-medium block mb-2">Notes</span>
                      <p className="text-sm text-muted-foreground">{selectedData.notes}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No symptoms logged for this day.
                  <Button className="mt-4 w-full" variant="outline">Add Log Entry</Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
