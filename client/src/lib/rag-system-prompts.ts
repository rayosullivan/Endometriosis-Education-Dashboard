export const SYSTEM_PROMPT = `
You are ELLA, an empathetic Endometriosis Care Assistant.

CORE DIRECTIVES:
1. EXCLUSIVE SOURCE: You must ONLY answer using information from the provided Curated Clinical Content Corpus (NICE NG73, ESHRE Guidelines). Do not hallucinate or use outside medical knowledge.
2. SAFETY FIRST:
   - PHYSICAL: If a user mentions severe pain, bleeding, or new symptoms, advise them to consult their clinician.
   - PSYCHOLOGICAL: If a user expresses distress, depression, or anxiety, respond with empathy and suggest speaking to a healthcare professional or mental health support.
3. EMPATHY: Use a warm, understanding, and non-judgmental tone. Validate the user's experience.
4. DISCLAIMER: Always remind the user you are an AI and not a doctor.
`;

export const SAFETY_TRIGGERS = {
  physical: ["bleeding", "severe pain", "agony", "faint", "vomiting", "emergency", "blood", "lump", "incapacitated", "unbearable"],
  psychological: ["depressed", "anxious", "sad", "cry", "suicide", "hurt myself", "hopeless", "overwhelmed", "can't cope", "alone"]
};

export const MOCK_RESPONSES = {
  default: {
    content: "Endometriosis is defined as the presence of endometrial-like tissue outside the uterus, which induces a chronic, inflammatory reaction. Common symptoms include dysmenorrhoea (painful periods), dyspareunia (pain during intercourse), and chronic pelvic pain. Management options range from pain relief and hormonal treatments to surgery, depending on your individual needs and life stage.",
    citations: [
      { title: "ESHRE Guideline: Endometriosis", source: "ESHRE 2022" },
      { title: "NG73: Endometriosis diagnosis and management", source: "NICE 2017" }
    ]
  },
  physical_safety: {
    content: "I'm sorry to hear you're experiencing such severe symptoms. Your safety is the most important thing. Given that you mentioned {trigger}, I strongly recommend you contact your GP or specialist for an evaluation. If you are in immediate danger or severe pain, please seek urgent medical attention (111/999).",
    citations: [
       { title: "Urgent Care Triage Protocols", source: "Safety Protocol v4.1" }
    ]
  },
  psychological_safety: {
    content: "I can hear how difficult things are for you right now, and it's completely understandable to feel overwhelmed. Living with endometriosis can be physically and emotionally draining. Please consider reaching out to your clinician, who can support you with both the physical and emotional aspects of your care. You don't have to go through this alone.",
    citations: [
       { title: "Psychological Support in Endometriosis", source: "NICE NG73" },
       { title: "Endometriosis UK - Support Network", source: "Patient Resources" }
    ]
  },
  unknown: {
    content: "I apologize, but I can only answer questions related to endometriosis based on the verified clinical guidelines in my database. I don't have information on that specific topic. Is there something else about endometriosis management I can help you with?",
    citations: []
  }
};
