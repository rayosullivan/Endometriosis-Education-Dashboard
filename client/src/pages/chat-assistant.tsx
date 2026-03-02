import LayoutPatient from "@/components/layout-patient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Info, ShieldCheck, FileText, Mic, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { SAFETY_TRIGGERS, MOCK_RESPONSES, SYSTEM_PROMPT } from "@/lib/rag-system-prompts";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations?: Array<{ title: string; source: string }>;
  isThinking?: boolean;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "system-1",
    role: "system",
    content: SYSTEM_PROMPT
  },
  {
    id: "1",
    role: "assistant",
    content: "Hello. I'm ELLA, your Endometriosis Care Assistant. I can help answer questions based on official guidelines (NICE, ESHRE) and validated information.\n\nPlease note: I am an AI, not a doctor. In an emergency, always contact 112/999.",
  },
];

export default function ChatAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);

  useEffect(() => {
    // Scroll to bottom logic would go here
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    // Simulate speech-to-text
    setTimeout(() => {
      setIsListening(false);
      setInputValue((prev) => 
        (prev ? prev + " " : "") + "Can you explain what dyspareunia is?"
      );
    }, 2000);
  };

  const determineResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // Check psychological triggers
    const psychMatch = SAFETY_TRIGGERS.psychological.find(t => lowerInput.includes(t));
    if (psychMatch) {
      return MOCK_RESPONSES.psychological_safety;
    }

    // Check physical triggers
    const physMatch = SAFETY_TRIGGERS.physical.find(t => lowerInput.includes(t));
    if (physMatch) {
      const response = { ...MOCK_RESPONSES.physical_safety };
      response.content = response.content.replace("{trigger}", physMatch);
      return response;
    }

    // Default or unknown logic (simple keyword check for demo)
    if (lowerInput.includes("symptom") || lowerInput.includes("endometriosis") || lowerInput.includes("pain") || lowerInput.includes("help")) {
       return MOCK_RESPONSES.default;
    }

    return MOCK_RESPONSES.unknown;
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const thinkingMsg: Message = {
        id: "thinking",
        role: "assistant",
        content: "",
        isThinking: true,
      };
      setMessages((prev) => [...prev, thinkingMsg]);

      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== "thinking"));
        
        const aiResponseData = determineResponse(userMsg.content);
        
        const responseMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: aiResponseData.content,
          citations: aiResponseData.citations
        };
        setMessages((prev) => [...prev, responseMsg]);
      }, 1500);
    }, 500);
  };

  return (
    <LayoutPatient>
      <div className="container max-w-4xl py-6 md:py-12 px-4 h-[calc(100vh-64px)] flex flex-col">
        <Card className="flex-1 flex flex-col border-none shadow-xl shadow-primary/5 overflow-hidden">
          <CardHeader className="border-b bg-muted/20 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-serif text-lg">ELLA Assistant</CardTitle>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-green-600" />
                    Powered by Verified Clinical Guidelines
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Dialog open={showSystemPrompt} onOpenChange={setShowSystemPrompt}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="hidden md:flex">
                      <ShieldCheck className="mr-2 h-3 w-3" /> Safety Protocols
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>System Safety Configuration</DialogTitle>
                      <DialogDescription>
                         Active system prompts and safety rails enforcing clinical boundaries.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="bg-muted p-4 rounded-md font-mono text-xs whitespace-pre-wrap mt-4">
                      {SYSTEM_PROMPT}
                    </div>
                    <div className="mt-4">
                       <h4 className="font-bold text-sm mb-2">Active Triggers</h4>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="border p-3 rounded bg-red-50 text-red-900 text-xs">
                             <strong>Physical Safety:</strong>
                             <div className="mt-1 opacity-80">{SAFETY_TRIGGERS.physical.join(", ")}</div>
                          </div>
                          <div className="border p-3 rounded bg-blue-50 text-blue-900 text-xs">
                             <strong>Psychological Safety:</strong>
                             <div className="mt-1 opacity-80">{SAFETY_TRIGGERS.psychological.join(", ")}</div>
                          </div>
                       </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="sm" onClick={() => setMessages(INITIAL_MESSAGES)}>
                  Reset Chat
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 overflow-hidden relative">
             <ScrollArea className="h-full p-4 md:p-6">
                <div className="space-y-6 max-w-3xl mx-auto">
                  <AnimatePresence>
                  {messages.filter(m => m.role !== 'system').map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Avatar className={`h-8 w-8 ${msg.role === "assistant" ? "bg-primary/10" : "bg-secondary"}`}>
                        {msg.role === "assistant" ? (
                          <div className="flex items-center justify-center w-full h-full text-primary font-bold text-xs"><Bot className="h-4 w-4"/></div>
                        ) : (
                          <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        )}
                      </Avatar>
                      
                      <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 border border-muted"
                          }`}
                        >
                          {msg.isThinking ? (
                            <div className="flex gap-1 items-center h-5">
                              <span className="animate-bounce delay-0">.</span>
                              <span className="animate-bounce delay-100">.</span>
                              <span className="animate-bounce delay-200">.</span>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                          )}
                        </div>
                        
                        {msg.citations && (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {msg.citations.map((cite, idx) => (
                              <Badge key={idx} variant="outline" className="bg-background/50 hover:bg-background cursor-pointer gap-1 py-1 h-auto text-[10px] text-muted-foreground border-primary/20">
                                <FileText className="h-3 w-3 text-primary" />
                                {cite.title}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>
                </div>
             </ScrollArea>
          </CardContent>


          <CardFooter className="p-4 bg-background border-t">
            <div className="w-full max-w-3xl mx-auto flex gap-2 items-end">
              <Button
                size="icon"
                variant={isListening ? "destructive" : "outline"}
                className={`h-12 w-12 rounded-full shrink-0 ${isListening ? "animate-pulse" : ""}`}
                onClick={toggleListening}
              >
                {isListening ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mic className="h-5 w-5" />}
              </Button>
              
              <div className="relative flex-1">
                <Input 
                  placeholder={isListening ? "Listening..." : "Ask about symptoms, treatments, or guidelines..."}
                  className="pr-12 py-6 rounded-full shadow-sm h-12"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button 
                  size="icon" 
                  className="absolute right-1 top-1 h-10 w-10 rounded-full" 
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isListening}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
          <div className="bg-muted/20 py-2 text-center text-[10px] text-muted-foreground border-t">
             AI can make mistakes. Please verify important information with your clinician.
          </div>
        </Card>
      </div>
    </LayoutPatient>
  );
}
