import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Activity, MessageCircle, FileText, Heart, Shield, Zap } from "lucide-react";
import { Link } from "wouter";

const SLIDES = [
  {
    id: "title",
    title: "EndoCare Platform",
    subtitle: "Empowering Patients, Informing Clinicians",
    content: "A comprehensive digital health solution for endometriosis management and diagnosis acceleration.",
    icon: <Heart className="w-16 h-16 text-primary" />,
    color: "bg-primary/10"
  },
  {
    id: "problem",
    title: "The Problem",
    subtitle: "7.5 Years Average Diagnosis Time",
    content: "Patients struggle to track complex, interconnected symptoms over time. Doctors lack structured, actionable data during brief consultations.",
    icon: <Activity className="w-16 h-16 text-destructive" />,
    color: "bg-destructive/10"
  },
  {
    id: "solution",
    title: "Our Solution",
    subtitle: "Bridging the Gap",
    content: "An intelligent platform that combines daily symptom tracking, AI-powered health literacy, and structured GP reports to accelerate care.",
    icon: <Zap className="w-16 h-16 text-accent" />,
    color: "bg-accent/10"
  },
  {
    id: "features",
    title: "Key Capabilities",
    subtitle: "Built for Patients and Clinicians",
    bullets: [
      { title: "Smart Tracking", desc: "Log symptoms, cycles, and triggers effortlessly", icon: <Activity className="w-8 h-8 text-primary" /> },
      { title: "AI Assistant", desc: "Clinician-verified answers with source citations", icon: <MessageCircle className="w-8 h-8 text-primary" /> },
      { title: "GP Reports", desc: "Actionable summaries highlighting red flags", icon: <FileText className="w-8 h-8 text-primary" /> }
    ],
    color: "bg-secondary/10"
  },
  {
    id: "value",
    title: "Value Proposition",
    subtitle: "Better Outcomes for Everyone",
    bullets: [
      { title: "For Patients", desc: "Validation, understanding, and agency over their health journey.", icon: <Heart className="w-8 h-8 text-green-500" /> },
      { title: "For Clinicians", desc: "Structured data, triaged severity, and efficient consultations.", icon: <Shield className="w-8 h-8 text-blue-500" /> }
    ],
    color: "bg-green-500/10"
  },
  {
    id: "cta",
    title: "Join the Movement",
    subtitle: "Transforming Women's Healthcare",
    content: "Let's work together to reduce diagnosis times and improve quality of life for millions of women worldwide.",
    cta: true,
    color: "bg-primary/20"
  }
];

export default function PitchDeckPage() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        scrollNext();
      } else if (e.key === 'ArrowLeft') {
        scrollPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollNext, scrollPrev]);

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="w-4 h-4" /> Back to App
          </Button>
        </Link>
        <div className="flex gap-2">
          {SLIDES.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-300 ${idx === selectedIndex ? "w-8 bg-primary" : "w-2 bg-primary/20 cursor-pointer hover:bg-primary/40"}`}
              onClick={() => emblaApi?.scrollTo(idx)}
            />
          ))}
        </div>
      </header>

      {/* Presentation Carousel */}
      <div className="flex-1 flex" ref={emblaRef}>
        <div className="flex w-full h-full">
          {SLIDES.map((slide, idx) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0 h-screen flex items-center justify-center p-6 sm:p-12 relative">
              {/* Decorative background */}
              <div className={`absolute inset-0 opacity-30 ${slide.color} transition-colors duration-1000`} />
              
              <AnimatePresence mode="wait">
                {selectedIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="max-w-4xl w-full bg-background/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 sm:p-16 relative z-10"
                  >
                    <div className="flex flex-col md:flex-row gap-8 sm:gap-12 items-center">
                      {slide.icon && (
                        <div className={`p-8 rounded-full ${slide.color} bg-opacity-50 shrink-0`}>
                          {slide.icon}
                        </div>
                      )}
                      
                      <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="space-y-2">
                          <h2 className="text-sm sm:text-base font-bold tracking-widest text-primary uppercase">
                            {slide.subtitle}
                          </h2>
                          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground">
                            {slide.title}
                          </h1>
                        </div>
                        
                        {slide.content && (
                          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                            {slide.content}
                          </p>
                        )}
                        
                        {slide.bullets && (
                          <div className="grid gap-6 mt-8 sm:grid-cols-2">
                            {slide.bullets.map((bullet, i) => (
                              <div key={i} className="flex gap-4 items-start text-left">
                                <div className="mt-1 shrink-0 bg-background rounded-full p-2 shadow-sm border">
                                  {bullet.icon}
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg">{bullet.title}</h3>
                                  <p className="text-muted-foreground">{bullet.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {slide.cta && (
                          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link href="/">
                              <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto shadow-xl shadow-primary/20">
                                Explore Platform
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-10 pointer-events-none">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-14 w-14 bg-background/50 backdrop-blur border-primary/20 pointer-events-auto hover:bg-background/80"
          onClick={scrollPrev}
          disabled={selectedIndex === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-14 w-14 bg-background/50 backdrop-blur border-primary/20 pointer-events-auto hover:bg-background/80"
          onClick={scrollNext}
          disabled={selectedIndex === SLIDES.length - 1}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
