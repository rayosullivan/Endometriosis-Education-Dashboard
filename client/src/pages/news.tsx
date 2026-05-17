import LayoutPatient from "@/components/layout-patient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ExternalLink, Calendar, BookOpen, Microscope, GraduationCap, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const MOCK_NEWS = [
  {
    id: 1,
    title: "FDA clears ENDO-205 Investigational New Drug application for endometriosis",
    source: "Contemporary OB/GYN",
    date: "2026-02-15", // Archive
    category: "Regulatory",
    summary: "ENDO-205 is a first-in-class, non-hormonal targeted peptide therapeutic whose FDA Investigational New Drug (IND) application was recently cleared. It is described as the first therapy in development designed to eliminate endometriosis lesions and address associated symptoms, including pain and systemic complications. This represents a significant shift towards non-hormonal, disease-modifying treatments.",
    link: "https://www.contemporaryobgyn.net/view/fda-clears-endo-205-investigational-new-drug-application-for-endometriosis",
    icon: <BookOpen className="w-4 h-4" />
  },
  {
    id: 2,
    title: "MSU researchers make progress toward non-hormonal treatment for endometriosis",
    source: "Michigan State University (MSUToday)",
    date: "2026-03-05", // Archive
    category: "Research",
    summary: "A new study explores how immune cells interact with endometriosis lesions, revealing that the epithelium can selectively communicate with macrophages to alter their function. Instead of clearing the tissue, these macrophages contribute to disease progression. Targeting this macrophage-epithelium crosstalk offers new insights for potential immunotherapy-based non-hormonal treatments.",
    link: "https://msutoday.msu.edu/news/2025/03/msu-researchers-make-progress-toward-non-hormonal-treatment-for-endometriosis",
    icon: <Microscope className="w-4 h-4" />
  },
  {
    id: 3,
    title: "Big Data Begins to Crack the Case of Endometriosis",
    source: "UC San Francisco",
    date: "2026-04-10", // Last Month
    category: "Epidemiology",
    summary: "A UCSF study published in Cell Reports Medicine utilized computational methods to analyze anonymized patient records, identifying strong comorbidities with conditions like Crohn's disease and migraine. The research supports the reframing of endometriosis as a chronic, multisystem, neuro-inflammatory disease. These findings could significantly improve early diagnosis and inform systemic, personalized treatment approaches.",
    link: "https://www.ucsf.edu/news/2025/07/430471/big-data-begins-crack-case-endometriosis",
    icon: <GraduationCap className="w-4 h-4" />
  },
  {
    id: 4,
    title: "Endometriosis: new insights and opportunities for relief of symptoms",
    source: "PubMed Central (PMC)",
    date: "2026-04-18", // Last Month
    category: "Research",
    summary: "This comprehensive review discusses the paradigm shift in understanding endometriosis from a purely pelvic organ disease to a systemic condition involving genetic, epigenetic, and immune factors. It highlights emerging diagnostic modalities, including non-invasive menstrual blood tests and AI-assisted imaging. Furthermore, it evaluates the pipeline of novel therapeutics targeting neuro-angiogenesis and inflammatory pathways.",
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12621312/",
    icon: <Microscope className="w-4 h-4" />
  },
  {
    id: 5,
    title: "Endometriosis Breakthroughs: New Treatments and Research",
    source: "News-Medical.net",
    date: "2026-04-25", // Last Month
    category: "Clinical Trials",
    summary: "Recent clinical trials have highlighted the efficacy of new therapeutic agents, including the FDA-approved GnRH antagonist Linzagolix, which significantly reduces painful periods and pelvic pain when used with add-back therapy. The article also covers Phase 2 successes for monoclonal antibodies like HMI-115, which blocks the prolactin receptor. These advancements signal a rapidly accelerating pipeline for endometriosis drug discovery.",
    link: "https://www.news-medical.net/health/Endometriosis-Breakthroughs-New-Treatments-and-Research.aspx",
    icon: <BookOpen className="w-4 h-4" />
  }
];

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("Last Month");

  const filteredNews = MOCK_NEWS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || item.category === filter;
    
    let matchesTime = true;
    const itemDate = new Date(item.date);
    if (timeFilter === "Last Month") {
      // For mockup purposes, assuming current date is May 2026
      matchesTime = itemDate.getFullYear() === 2026 && itemDate.getMonth() === 3; // April (0-indexed)
    } else if (timeFilter === "Archive") {
      matchesTime = itemDate.getFullYear() < 2026 || (itemDate.getFullYear() === 2026 && itemDate.getMonth() < 3);
    }
    
    return matchesSearch && matchesFilter && matchesTime;
  });

  return (
    <LayoutPatient>
      <div className="container max-w-5xl py-12 px-4 space-y-8">
        <div className="space-y-4">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20" variant="outline">
            Clinical & Scientific Updates
          </Badge>
          <h1 className="text-4xl font-serif font-bold tracking-tight">Endometriosis Research Hub</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Stay informed with the latest peer-reviewed studies, clinical trials, and medical guidelines regarding endometriosis care and diagnosis.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center bg-muted/30 p-4 rounded-xl border">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search studies, trials, or keywords..." 
              className="pl-9 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-background">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Last Month">Last Month (April 2026)</SelectItem>
              <SelectItem value="Archive">Historical Archive</SelectItem>
              <SelectItem value="All">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-background">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Clinical Trials">Clinical Trials</SelectItem>
              <SelectItem value="Research">Research</SelectItem>
              <SelectItem value="Guidelines">Guidelines</SelectItem>
              <SelectItem value="Epidemiology">Epidemiology</SelectItem>
              <SelectItem value="Regulatory">Regulatory</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {filteredNews.length > 0 ? (
            filteredNews.map((news, idx) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card className="hover:border-primary/50 transition-colors shadow-sm overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 md:w-1/4 bg-muted/20 border-r flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <Badge variant="secondary" className="flex w-fit items-center gap-1.5">
                          {news.icon} {news.category}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground gap-1.5 font-medium">
                          <Calendar className="w-4 h-4" />
                          {new Date(news.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-primary/80">
                        {news.source}
                      </div>
                    </div>
                    <div className="p-6 md:w-3/4 space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold font-serif leading-tight">
                          {news.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {news.summary}
                        </p>
                      </div>
                      <div className="pt-2">
                        <Button variant="link" className="p-0 h-auto font-semibold group" asChild>
                          <a href={news.link} target="_blank" rel="noopener noreferrer">
                            Read Full Publication 
                            <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
              <Microscope className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg">No publications found matching your criteria.</p>
              <Button variant="link" onClick={() => { setSearchTerm(""); setFilter("All"); setTimeFilter("All"); }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </LayoutPatient>
  );
}
