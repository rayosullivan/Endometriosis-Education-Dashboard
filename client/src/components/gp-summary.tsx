import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Download, Check, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function GPSummaryGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      toast({
        title: "Report Generated",
        description: "Your GP Summary is ready for download.",
      });
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-secondary-foreground" />
          GP Summary Report
        </CardTitle>
        <CardDescription>
          Generate a clinician-friendly summary of your symptoms, cycle patterns, and red flags for your next appointment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Period</label>
            <Select defaultValue="3months">
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last 30 Days</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="all">All History</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Include</label>
            <div className="space-y-3">
              <Select defaultValue="summary">
                <SelectTrigger>
                  <SelectValue placeholder="Select details" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary Only</SelectItem>
                  <SelectItem value="detailed">Detailed Logs</SelectItem>
                  <SelectItem value="redflags">Red Flags Only</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2 border rounded-md p-2 bg-muted/20">
                <Checkbox id="include-diary" />
                <label
                  htmlFor="include-diary"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Append Symptom Diary
                </label>
              </div>
            </div>
          </div>
        </div>

        {isGenerated && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 text-green-800">
            <Check className="h-5 w-5" />
            <div className="flex-1">
              <p className="font-medium text-sm">Report Ready: GP_Summary_Feb2026.pdf</p>
              <p className="text-xs opacity-80">Generated on Feb 12, 2026</p>
            </div>
            <Button size="sm" variant="outline" className="h-8 border-green-300 hover:bg-green-100 text-green-900">
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!isGenerated ? (
          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              "Generate Report"
            )}
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setIsGenerated(false)} className="w-full">
            Create New Report
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
