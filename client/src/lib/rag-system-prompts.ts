export const SYSTEM_PROMPT = `
You are ELLA, an empathetic Endometriosis Care Assistant.

CORE DIRECTIVES:
1. KNOWLEDGE BASE FIRST: Your primary source of knowledge is the provided Curated Clinical Content Corpus (NICE NG73 2024, ESHRE 2022, Irish Guidelines 2025).
2. EXTERNAL SOURCES ALLOWED: You may supplement your answers with external, highly reputable medical resources (e.g., WHO, ACOG, peer-reviewed journals) ONLY IF you explicitly quote them and provide a clear citation in your response.
3. COMPREHENSIVE DETAIL: Provide long, thorough, and highly detailed explanations. Break down complex medical concepts so they are easy to understand, while maintaining clinical accuracy.
4. SAFETY FIRST:
   - PHYSICAL: If a user mentions severe pain, bleeding, or new symptoms, advise them to consult their clinician.
   - PSYCHOLOGICAL: If a user expresses distress, depression, or anxiety, respond with empathy and suggest speaking to a healthcare professional or mental health support.
5. EMPATHY: Use a warm, understanding, and non-judgmental tone. Validate the user's experience.
6. DISCLAIMER: Always remind the user you are an AI and not a doctor.
`;

export const SAFETY_TRIGGERS = {
  physical: ["bleeding", "severe pain", "agony", "faint", "vomiting", "emergency", "blood", "lump", "incapacitated", "unbearable"],
  psychological: ["depressed", "anxious", "sad", "cry", "suicide", "hurt myself", "hopeless", "overwhelmed", "can't cope", "alone"]
};

export const MOCK_RESPONSES = {
  greeting: {
    content: "Hello! I'm ELLA, your Endometriosis Care Assistant. I am here to provide you with comprehensive support, information, and guidance regarding endometriosis.\n\nLiving with endometriosis can be incredibly challenging, and my goal is to help you navigate your care by providing detailed information based on the latest clinical guidelines, including NICE, ESHRE, and Irish National Guidelines.\n\nHow are you feeling today? Are you experiencing any specific symptoms like pelvic pain or fatigue, or do you have a detailed question about diagnosis, surgical options, or medical management? Take your time, and feel free to ask me anything.",
    citations: []
  },
  symptoms: {
    content: "Endometriosis can present with a wide and often complex array of symptoms that can significantly impact your daily life. The most hallmark symptoms include:\n\n• Dysmenorrhoea: Severe, debilitating cramps during your menstrual period that are not relieved by standard over-the-counter painkillers.\n• Dyspareunia: Deep pelvic pain during or after sexual intercourse, which is often linked to the presence of endometrial-like tissue in the deeper pelvic structures.\n• Chronic Pelvic Pain: Persistent pain in the pelvic region that lasts for six months or longer, and may occur independently of your menstrual cycle.\n\nBeyond these, many individuals also report severe fatigue, painful bowel movements (dyschezia), painful urination (dysuria), and cyclical gastrointestinal issues like bloating or diarrhea that worsen around menstruation. As noted by the World Health Organization, \"Endometriosis has significant social, public health and economic implications.\" It can also impact fertility, making it difficult for some to conceive.\n\nIt is important to remember that the severity of your pain does not always correlate with the extent of the disease found during surgery. What specific symptoms are currently affecting you the most?",
    citations: [
      { title: "ESHRE Guideline: Symptoms & Presentation", source: "ESHRE 2022" },
      { title: "Endometriosis Fact Sheet", source: "World Health Organization (WHO), 2023" }
    ]
  },
  diagnosis: {
    content: "The landscape of endometriosis diagnosis has evolved significantly in recent years to focus on reducing the long diagnostic delays many experience. \n\nHistorically, a definitive diagnosis required a surgical procedure called a laparoscopy. However, current authoritative guidelines, including the NICE NG73 (2024 update) and the 2025 Irish National Guidelines, now emphasize a presumptive clinical diagnosis.\n\nWhat this means for you:\n1. Clinical Assessment: Your doctor can diagnose and begin treating you based on a detailed history of your symptoms (like cyclical pelvic pain) and a physical examination.\n2. Imaging First: A transvaginal ultrasound (TVUS) is usually the first-line imaging test. It is highly effective at identifying ovarian endometriomas (chocolate cysts) and some forms of deep infiltrating endometriosis.\n3. Empiric Treatment: You do not need to wait for a surgical laparoscopy to start receiving care. Treatment, such as hormonal suppression and targeted pain relief, can and should be initiated empirically based on your clinical presentation.\n\nIf imaging is normal but symptoms strongly suggest endometriosis, or if complex deep disease involving the bowel or bladder is suspected, an MRI or referral to a specialist multidisciplinary center is highly recommended. How far along are you in your diagnostic journey?",
    citations: [
      { title: "Presumptive Clinical Diagnosis and Imaging", source: "NICE NG73 (2024) / Irish Guideline (2025)" },
      { title: "Clinical Guidelines in Gynecology", source: "ACOG Practice Bulletin, 2026" }
    ]
  },
  treatment: {
    content: "The management of endometriosis requires a highly individualized, long-term approach, as it is a chronic condition. Treatments broadly fall into several stepped-care tiers based on your specific symptoms, the severity of the disease, and your fertility goals.\n\n1. First-Line Medical Therapy: If you are not actively trying to conceive, the initial approach typically involves a combination of analgesics (like NSAIDs or paracetamol) for pain control, alongside hormonal suppression. Hormonal options frequently include the combined oral contraceptive pill or progestogen-only methods (such as the Mirena coil or the mini-pill). The goal is to reduce menstruation and suppress the growth of endometrial-like tissue.\n\n2. Second-Line Medical Escalation: If first-line treatments are ineffective or cause intolerable side effects, recent guidelines support the use of oral GnRH antagonists (such as linzagolix or relugolix) with add-back hormone therapy. These medications heavily suppress estrogen production to reduce disease activity, while the 'add-back' hormones help protect your bone density and minimize menopausal side effects.\n\n3. Surgical Management: For some, surgery is the most appropriate path, particularly when there is deep infiltrating disease, large endometriomas, or severe pain unresponsive to medical therapy. Surgery aims to excise (cut out) or ablate (burn away) the lesions.\n\nRelapse prevention is a critical component of any treatment plan; long-term hormonal suppression is almost always recommended after successful surgery to prevent the disease from returning. Have you tried any of these medical therapies yet?",
    citations: [
      { title: "Medical Therapy Pathways & GnRH Antagonists", source: "NICE NG73 (2024) / Irish National Guideline 2025" }
    ]
  },
  surgery: {
    content: "Surgical intervention for endometriosis is a major decision and is highly dependent on the specific subtype of the disease you have—whether it is superficial peritoneal, ovarian endometriomas, or deep infiltrating endometriosis (DIE).\n\nAccording to the latest synthesized guidelines:\n• Laparoscopy over Laparotomy: Laparoscopic (minimally invasive or keyhole) surgery is the strongly preferred and default surgical route, offering faster recovery and fewer complications compared to open surgery.\n• Excision vs. Ablation: There is an ongoing debate regarding the best technique. Excision involves cutting out the disease entirely, which is generally preferred for deeper lesions and provides tissue for pathology. Ablation involves burning the surface of the lesions. Current guidelines note that the choice should be tailored to the patient. For instance, carefully excising an ovarian endometrioma is generally preferred over simply draining it, but surgeons must be incredibly cautious to preserve your healthy ovarian tissue and overall ovarian reserve.\n• Deep Infiltrating Endometriosis (DIE): If the disease has heavily infiltrated your bowel, bladder, or ureters, surgery becomes highly complex. In these scenarios, guidelines mandate that care be escalated to supra-regional specialist endometriosis services. These surgeries require a multidisciplinary team, often including colorectal or urological surgeons alongside expert gynecologists, to carefully balance the removal of the disease against the risks of nerve damage or altered bowel/bladder function.\n\nSurgery is rarely a permanent cure, and post-operative medical management is essential to prevent recurrence. Are you currently considering surgical options?",
    citations: [
      { title: "Surgical Route, Excision, and Expertise", source: "Irish Guideline 2025 / NICE NG73" },
      { title: "Cochrane Database of Systematic Reviews", source: "Cochrane, Surgical Interventions for Endometriosis" }
    ]
  },
  fertility: {
    content: "Navigating fertility with endometriosis requires careful planning and a highly personalized approach, as the condition can impact reproductive health through inflammation, distorted pelvic anatomy, or diminished ovarian reserve.\n\nIf you are actively prioritizing conception, your care pathway shifts significantly:\n• Pausing Hormonal Suppression: Hormonal treatments (like the pill or GnRH analogues) prevent pregnancy, so these are not recommended when you are actively trying to conceive.\n• Surgical Considerations: For early-stage (Stage I-II) endometriosis, operative laparoscopy to remove superficial lesions and divide scar tissue (adhesiolysis) has been shown to improve the chances of natural conception and ongoing clinical pregnancy. However, for more advanced disease, especially large ovarian endometriomas, surgery must be weighed very carefully against the risk of damaging the ovaries and reducing your egg count (ovarian reserve).\n• Assisted Reproductive Technology (ART): In many cases—particularly if there are other fertility factors, advanced maternal age, or complex deep disease—multidisciplinary teams may recommend proceeding directly to techniques like In Vitro Fertilization (IVF) rather than undergoing repeat surgeries, which can cause further trauma to the ovaries.\n\nIt is essential to have an open, shared decision-making discussion with a fertility specialist or an integrated fertility hub to map out the safest and most effective route for your specific situation. Would you like more information on IVF or preserving your ovarian reserve?",
    citations: [
      { title: "Fertility Priority Pathway & Ovarian Reserve", source: "ESHRE 2022 / Irish Guideline 2025" }
    ]
  },
  affirmation: {
    content: "I completely and deeply understand. Navigating a chronic, painful, and complex condition like endometriosis can be incredibly frustrating, exhausting, and isolating. The diagnostic delays and the trial-and-error nature of finding the right treatment can take a massive physical and emotional toll.\n\nIt is profoundly important that your pain and your experiences are heard, believed, and validated. You are absolutely not alone in feeling this way. How else can I support you right now? Whether you need more medical information, strategies for symptom management, or just a space to outline what you are going through, I am here for you.",
    citations: []
  },
  default: {
    content: "Endometriosis is a chronic, systemic condition defined by the presence of tissue similar to the lining of the uterus (the endometrium) growing outside the uterus. This tissue responds to the hormonal fluctuations of your menstrual cycle, leading to a chronic, localized inflammatory reaction, scarring, and the formation of adhesions.\n\nThe current standard of care—synthesized from the NICE 2024 updates, the ESHRE 2022 guidelines, and the comprehensive 2025 Irish National Framework—focuses heavily on:\n1. Early recognition and empiric medical treatment, shifting away from mandatory surgical diagnoses.\n2. A stepped-care approach that begins with standard hormonal suppression and pain relief.\n3. Structured referrals to highly specialized multidisciplinary networks for complex cases involving deep infiltrating disease, the bowel, or the urinary tract.\n4. Patient-centered, shared decision-making that carefully balances pain management goals against long-term fertility priorities.\n\nIf you have a specific question about any of these aspects, please let me know and I will provide a detailed breakdown.",
    citations: [
      { title: "Endometriosis Core Principles & Service Frameworks", source: "NICE 2024 / ESHRE 2022 / Irish Guideline 2025" }
    ]
  },
  physical_safety: {
    content: "I am so sorry to hear that you are experiencing such severe and alarming symptoms. Your immediate health and physical safety must always be the absolute top priority. \n\nGiven that you mentioned {trigger}, I strongly and urgently recommend that you contact your GP, your gynecology specialist, or your local out-of-hours medical service for an immediate, professional clinical evaluation. If you feel you are in immediate danger, experiencing unbearable pain that cannot be managed at home, or have heavy and uncontrolled bleeding, please seek urgent emergency medical attention right away (dial 111 or 999).\n\nWhile I am here to provide comprehensive information, I am an AI and cannot safely assess acute medical emergencies. Please prioritize getting professional medical help right now.",
    citations: [
       { title: "Urgent Care Triage Protocols", source: "Safety Protocol v4.1" }
    ]
  },
  psychological_safety: {
    content: "I hear how incredibly difficult things are for you right now, and I want you to know that it is completely understandable and valid to feel overwhelmed. Living with a chronic pain condition like endometriosis is not just a physical burden; it can be deeply exhausting, distressing, and emotionally draining.\n\nYour mental well-being is just as vital as your physical health. Please strongly consider reaching out to your clinician, a trusted therapist, or a support group. They can help you manage the profound emotional weight of this disease. Organizations like Endometriosis UK offer helplines and support networks where you can speak to people who truly understand what you are going through. You absolutely do not have to carry this heavy burden all on your own.",
    citations: [
       { title: "Psychological Support in Endometriosis", source: "NICE NG73" },
       { title: "Endometriosis UK - Mental Health Support Network", source: "Patient Resources" }
    ]
  },
  unknown: {
    content: "I apologize, but my core programming restricts me to providing information exclusively related to endometriosis, adenomyosis, and associated pelvic health conditions based on the verified clinical guidelines and reputable medical sources in my database. \n\nI want to ensure I give you the most accurate and safe information possible, and I do not have comprehensive data on that specific topic. Is there another aspect of your endometriosis care, symptom management, or diagnostic journey that I can explore in detail for you?",
    citations: []
  }
};
