import LayoutPatient from "@/components/layout-patient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ExternalLink, Calendar, BookOpen, Filter, ArrowRight } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

// Mock Data for Articles
type Article = {
  id: string;
  title: string;
  summary: string;
  category: "Diagnosis" | "Treatment" | "Lifestyle" | "Research" | "Mental Health";
  source: string;
  date: string;
  readTime: string;
  imageUrl?: string;
  url?: string;
};

const ARTICLES: Article[] = [
  {
    id: "1",
    title: "ESHRE Guideline on the Management of Women with Endometriosis",
    summary: "The European Society of Human Reproduction and Embryology (ESHRE) provides updated evidence-based guidelines on the diagnosis and treatment of endometriosis, including surgical and pharmacological approaches.",
    category: "Diagnosis",
    source: "ESHRE",
    date: "2022-02-02",
    readTime: "15 min read",
    url: "https://www.eshre.eu/Guidelines-and-Legal/Guidelines/Endometriosis-Guideline"
  },
  {
    id: "2",
    title: "Non-invasive Diagnosis of Endometriosis: The Role of Ultrasound",
    summary: "Recent studies highlight the increasing accuracy of transvaginal ultrasound in detecting deep infiltrating endometriosis, potentially reducing the need for diagnostic laparoscopy.",
    category: "Diagnosis",
    source: "Journal of Ultrasound in Medicine",
    date: "2025-11-15",
    readTime: "8 min read"
  },
  {
    id: "3",
    title: "Dietary Interventions for Endometriosis Symptoms",
    summary: "An overview of how anti-inflammatory diets, including gluten-free and low-FODMAP options, may help manage pelvic pain and bloating associated with endometriosis.",
    category: "Lifestyle",
    source: "Endometriosis UK",
    date: "2026-01-10",
    readTime: "6 min read"
  },
  {
    id: "4",
    title: "New Potential Non-Hormonal Drug Target Identified",
    summary: "Researchers have identified a new inflammatory pathway that could lead to non-hormonal treatments for endometriosis pain, offering hope for patients who cannot take hormonal contraceptives.",
    category: "Research",
    source: "Science Daily / University of Oxford",
    date: "2026-02-05",
    readTime: "5 min read"
  },
  {
    id: "5",
    title: "Mental Health Support Strategies for Chronic Pelvic Pain",
    summary: "Strategies for coping with the psychological impact of chronic pain, including CBT, mindfulness, and support groups. A holistic approach to care.",
    category: "Mental Health",
    source: "NICE Guidelines",
    date: "2025-09-20",
    readTime: "10 min read"
  },
  {
    id: "6",
    title: "Surgical Management of Deep Endometriosis: Outcomes & Risks",
    summary: "A comprehensive review of the outcomes of excision surgery for deep endometriosis affecting the bowel and bladder, helping patients make informed decisions.",
    category: "Treatment",
    source: "The Lancet",
    date: "2025-12-01",
    readTime: "12 min read"
  }
];

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Diagnosis", "Treatment", "Lifestyle", "Research", "Mental Health"];

  const filteredArticles = ARTICLES.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <LayoutPatient>
      <div className="bg-secondary/30 border-b">
        <div className="container px-4 py-12 md:py-16 text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="outline" className="bg-background/50 backdrop-blur border-primary/20 text-primary mb-2">
            Knowledge Hub
          </Badge>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
            Learn About Endometriosis
          </h1>
          <p className="text-muted-foreground text-lg">
            Curated articles from reputable scientific sources to help you understand your condition, treatment options, and latest research.
          </p>
          
          <div className="pt-6 relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search articles, topics, or keywords..." 
              className="pl-10 h-12 bg-background shadow-sm rounded-full border-primary/20 focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container px-4 py-8">
        <Tabs defaultValue="All" value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" /> Filter by Topic:
            </div>
          </div>
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0 justify-start">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-background px-4 py-2 rounded-full"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <Card key={article.id} className="flex flex-col border-none shadow-md hover:shadow-lg transition-shadow group h-full">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground hover:bg-secondary/70">
                      {article.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <BookOpen className="h-3 w-3 mr-1" /> {article.readTime}
                    </span>
                  </div>
                  <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <span className="font-medium text-foreground">{article.source}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(article.date), "MMM d, yyyy")}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {article.summary}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/5">
                    Read Article <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 opacity-50" />
              </div>
              <p className="text-lg font-medium">No articles found</p>
              <p>Try adjusting your search terms or filters.</p>
              <Button variant="link" onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}>Clear all filters</Button>
            </div>
          )}
        </div>
      </div>
    </LayoutPatient>
  );
}
