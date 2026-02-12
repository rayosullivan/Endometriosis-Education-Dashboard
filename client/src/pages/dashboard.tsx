import LayoutClinician from "@/components/layout-clinician";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocation } from "wouter";
import { 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { AlertCircle, FileText, CheckCircle2, Clock, Upload, Filter, Plus, ShieldCheck, History } from "lucide-react";
import { SymptomCalendar } from "@/components/symptom-calendar";
import { GPSummaryGenerator } from "@/components/gp-summary";

const DATA_SYMPTOMS = [
  { name: "Mon", pain: 4, queries: 12 },
  { name: "Tue", pain: 3, queries: 19 },
  { name: "Wed", pain: 7, queries: 25 },
  { name: "Thu", pain: 5, queries: 18 },
  { name: "Fri", pain: 6, queries: 22 },
  { name: "Sat", pain: 8, queries: 15 },
  { name: "Sun", pain: 6, queries: 10 },
];

const REVIEW_QUEUE = [
  { id: 1, title: "Updated NICE Guidelines 2026 - Summary", type: "Guideline", status: "Pending Review", author: "Dr. Sarah Smith", date: "2h ago" },
  { id: 2, title: "Dietary Management of Endometriosis", type: "Patient Leaflet", status: "Pending Review", author: "NutriTeam", date: "5h ago" },
  { id: 3, title: "Post-Laparoscopy Care Instructions", type: "Protocol", status: "Changes Requested", author: "Surgical Dept", date: "1d ago" },
];

const CONTENT_CORPUS = [
  { id: "C-001", title: "Endometriosis: Diagnosis and Management (NG73)", version: "2.4", lastUpdated: "2025-11-15", status: "Published", type: "Guideline" },
  { id: "C-002", title: "ESHRE Guideline: Endometriosis", version: "2022.1", lastUpdated: "2023-02-10", status: "Published", type: "Guideline" },
  { id: "C-003", title: "Pelvic Pain Management Pathways", version: "1.2", lastUpdated: "2026-01-20", status: "Draft", type: "Protocol" },
  { id: "C-004", title: "Patient Leaflet: Understanding Your Cycle", version: "3.0", lastUpdated: "2026-02-01", status: "Published", type: "Leaflet" },
  { id: "C-005", title: "Urgent Care Triage Protocols", version: "4.1", lastUpdated: "2026-02-10", status: "Published", type: "Safety" },
];

const AUDIT_LOGS = [
  { id: 1, action: "CONTENT_PUBLISH", user: "Dr. A. Ray", resource: "C-005", timestamp: "2026-02-10 14:30" },
  { id: 2, action: "TRIAGE_TRIGGER", user: "System", resource: "Patient-882", timestamp: "2026-02-12 09:15" },
  { id: 3, action: "LOGIN_FAILED", user: "Unknown", resource: "-", timestamp: "2026-02-12 10:00" },
];

export default function DashboardPage() {
  const [location] = useLocation();

  // DASHBOARD HOME VIEW
  if (location === "/dashboard") {
    return (
      <LayoutClinician>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Clinician Dashboard</h1>
              <p className="text-muted-foreground">Overview of content governance and patient engagement metrics.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Export Reports</Button>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                New Content
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,284</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Safety Triggers</CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">24</div>
                <p className="text-xs text-muted-foreground">Triaged to urgent care this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Content Corpus</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <p className="text-xs text-muted-foreground">Version 2.1.0 (Live)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">RAG Accuracy</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.2%</div>
                <p className="text-xs text-muted-foreground">Citation verification rate</p>
              </CardContent>
            </Card>
          </div>

          {/* NEW: Patient Tools Section (Calendar & Report) */}
          <div className="grid gap-6 md:grid-cols-2">
             <SymptomCalendar />
             <GPSummaryGenerator />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            {/* Charts */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Patient Engagement & Symptoms</CardTitle>
                <CardDescription>Average reported pain levels vs assistant queries over the last 7 days.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={DATA_SYMPTOMS}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}`} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    />
                    <Line type="monotone" dataKey="pain" stroke="hsl(var(--destructive))" strokeWidth={2} activeDot={{ r: 8 }} name="Avg Pain Level" />
                    <Line type="monotone" dataKey="queries" stroke="hsl(var(--primary))" strokeWidth={2} name="Assistant Queries" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Review Queue */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Content Review Queue</CardTitle>
                <CardDescription>Pending items requiring clinical sign-off.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {REVIEW_QUEUE.map((item) => (
                    <div key={item.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{item.title}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <Badge variant="secondary" className="text-[10px] h-5">{item.type}</Badge>
                          <span className="text-xs text-muted-foreground">{item.author}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {item.date}
                        </span>
                        <Button size="sm" variant="outline" className="h-7 text-xs">Review</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </LayoutClinician>
    );
  }

  // CONTENT MANAGER VIEW
  if (location === "/dashboard/content") {
    return (
      <LayoutClinician>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Content Governance</h1>
              <p className="text-muted-foreground">Manage the retrieval corpus, guidelines, and safety protocols.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                 <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Corpus Library</CardTitle>
              <CardDescription>Current indexed documents available to the Patient Assistant RAG system.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CONTENT_CORPUS.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-mono text-xs">{doc.id}</TableCell>
                      <TableCell className="font-medium">{doc.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.type}</Badge>
                      </TableCell>
                      <TableCell>{doc.version}</TableCell>
                      <TableCell>{doc.lastUpdated}</TableCell>
                      <TableCell>
                        <Badge variant={doc.status === "Published" ? "default" : "secondary"} className={doc.status === "Published" ? "bg-green-600 hover:bg-green-700" : ""}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
               <div className="text-xs text-muted-foreground">Showing 5 of 142 documents</div>
               <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
               </div>
            </CardFooter>
          </Card>
        </div>
      </LayoutClinician>
    );
  }

  // GOVERNANCE VIEW (Fallback for other sub-routes)
  return (
    <LayoutClinician>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">System Governance</h1>
            <p className="text-muted-foreground">Audit logs, access control, and safety rule configuration.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <History className="h-5 w-5" />
                 Audit Log
               </CardTitle>
               <CardDescription>Immutable record of system actions.</CardDescription>
             </CardHeader>
             <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {AUDIT_LOGS.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs font-mono">{log.timestamp}</TableCell>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell>{log.user}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <ShieldCheck className="h-5 w-5" />
                 Safety Thresholds
               </CardTitle>
               <CardDescription>Configure automated triage triggers.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex items-center justify-between border p-3 rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">Severe Pain Escalation</p>
                    <p className="text-xs text-muted-foreground">Trigger urgent care on Pain &gt; 8/10 + Fever</p>
                  </div>
                  <Switch checked />
               </div>
               <div className="flex items-center justify-between border p-3 rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">Pregnancy Exclusion</p>
                    <p className="text-xs text-muted-foreground">Mandatory question flow for 18-45y</p>
                  </div>
                  <Switch checked />
               </div>
               <Button variant="outline" className="w-full">
                 <Plus className="mr-2 h-4 w-4" /> Add Safety Rule
               </Button>
             </CardContent>
           </Card>
        </div>
      </div>
    </LayoutClinician>
  );
}

function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function Switch({ checked }: { checked: boolean }) {
  return (
    <div className={`w-10 h-6 rounded-full relative transition-colors ${checked ? "bg-primary" : "bg-muted"}`}>
      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${checked ? "left-5" : "left-1"}`} />
    </div>
  );
}
