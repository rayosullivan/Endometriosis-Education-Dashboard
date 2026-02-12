import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es' | 'pt' | 'uk' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "hero.badge": "Regulated Health Information System",
    "hero.title": "Your Trusted Companion for Endometriosis Care",
    "hero.description": "Track symptoms, access clinician-verified guidelines, and navigate your care pathway with confidence.",
    "hero.login": "Log In",
    "hero.check_symptoms": "Check Symptoms (Anonymous)",
    "hero.ask_assistant": "Ask Assistant",
    "hero.clinician_verified": "Clinician Verified",
    "features.title": "Empowering Your Health Journey",
    "features.description": "Designed with clinicians to provide safe, accurate, and helpful tools for managing endometriosis.",
    "card.tracking.title": "Symptom Tracking",
    "card.tracking.desc": "Keep a detailed daily journal of your symptoms, triggers, and pain locations.",
    "card.rag.title": "ELLA Assistant",
    "card.rag.desc": "Ask questions and get answers based on official guidelines and verified medical sources.",
    "card.gp.title": "GP Summary",
    "card.gp.desc": "Generate a professional summary of your symptoms to share with your healthcare provider.",
    "nav.home": "Home",
    "nav.symptom_checker": "Symptom Checker",
    "nav.care_assistant": "Care Assistant",
    "nav.learn": "Learn",
    "nav.clinician_portal": "Clinician Portal"
  },
  es: {
    "hero.badge": "Sistema de Información de Salud Regulado",
    "hero.title": "Tu Compañera de Confianza para la Endometriosis",
    "hero.description": "Registra síntomas, accede a guías verificadas por médicos y navega tu camino de cuidado con confianza.",
    "hero.login": "Iniciar Sesión",
    "hero.check_symptoms": "Revisar Síntomas (Anónimo)",
    "hero.ask_assistant": "Preguntar al Asistente",
    "hero.clinician_verified": "Verificado por Médicos",
    "features.title": "Empoderando Tu Viaje de Salud",
    "features.description": "Diseñado con médicos para proporcionar herramientas seguras, precisas y útiles para manejar la endometriosis.",
    "card.tracking.title": "Seguimiento de Síntomas",
    "card.tracking.desc": "Mantén un diario detallado de tus síntomas, desencadenantes y ubicaciones del dolor.",
    "card.rag.title": "Asistente ELLA",
    "card.rag.desc": "Haz preguntas y obtén respuestas basadas en pautas oficiales y fuentes médicas verificadas.",
    "card.gp.title": "Resumen para el Médico",
    "card.gp.desc": "Genera un resumen profesional de tus síntomas para compartir con tu proveedor de atención médica.",
    "nav.home": "Inicio",
    "nav.symptom_checker": "Verificador de Síntomas",
    "nav.care_assistant": "Asistente de Cuidado",
    "nav.learn": "Aprender",
    "nav.clinician_portal": "Portal Médico"
  },
  pt: {
    "hero.badge": "Sistema de Informação de Saúde Regulamentado",
    "hero.title": "Sua Companheira de Confiança para Endometriose",
    "hero.description": "Acompanhe sintomas, acesse diretrizes verificadas por médicos e navegue em sua jornada de cuidados com confiança.",
    "hero.login": "Entrar",
    "hero.check_symptoms": "Verificar Sintomas (Anônimo)",
    "hero.ask_assistant": "Perguntar ao Assistente",
    "hero.clinician_verified": "Verificado por Médicos",
    "features.title": "Empoderando Sua Jornada de Saúde",
    "features.description": "Projetado com médicos para fornecer ferramentas seguras, precisas e úteis para o gerenciamento da endometriose.",
    "card.tracking.title": "Rastreamento de Sintomas",
    "card.tracking.desc": "Mantenha um diário detalhado de seus sintomas, gatilhos e locais de dor.",
    "card.rag.title": "Assistente ELLA",
    "card.rag.desc": "Faça perguntas e obtenha respostas baseadas em diretrizes oficiais e fontes médicas verificadas.",
    "card.gp.title": "Resumo para o Médico",
    "card.gp.desc": "Gere um resumo profissional de seus sintomas para compartilhar com seu médico.",
    "nav.home": "Início",
    "nav.symptom_checker": "Verificador de Sintomas",
    "nav.care_assistant": "Assistente de Cuidados",
    "nav.learn": "Aprender",
    "nav.clinician_portal": "Portal do Médico"
  },
  uk: {
    "hero.badge": "Регульована інформаційна система охорони здоров'я",
    "hero.title": "Ваш надійний супутник у догляді при ендометріозі",
    "hero.description": "Відстежуйте симптоми, отримуйте доступ до перевірених лікарями рекомендацій та впевнено керуйте своїм лікуванням.",
    "hero.login": "Увійти",
    "hero.check_symptoms": "Перевірити симптоми (Анонімно)",
    "hero.ask_assistant": "Запитати асистента",
    "hero.clinician_verified": "Перевірено лікарями",
    "features.title": "Розширення можливостей вашого здоров'я",
    "features.description": "Розроблено спільно з клініцистами для надання безпечних, точних та корисних інструментів для лікування ендометріозу.",
    "card.tracking.title": "Відстеження симптомів",
    "card.tracking.desc": "Ведіть детальний щоденник симптомів, тригерів та локалізації болю.",
    "card.rag.title": "Асистент ELLA",
    "card.rag.desc": "Задавайте питання та отримуйте відповіді на основі офіційних рекомендацій та перевірених медичних джерел.",
    "card.gp.title": "Звіт для лікаря",
    "card.gp.desc": "Створіть професійний звіт про ваші симптоми, щоб поділитися ним з вашим лікарем.",
    "nav.home": "Головна",
    "nav.symptom_checker": "Перевірка симптомів",
    "nav.care_assistant": "Асистент догляду",
    "nav.learn": "Навчання",
    "nav.clinician_portal": "Портал лікаря"
  },
  ar: {
    "hero.badge": "نظام معلومات صحية منظم",
    "hero.title": "رفيقك الموثوق لرعاية بطانة الرحم المهاجرة",
    "hero.description": "تتبعي الأعراض، واحصلي على إرشادات تم التحقق منها من قبل الأطباء، وتنلقي في مسار رعايتك بثقة.",
    "hero.login": "تسجيل الدخول",
    "hero.check_symptoms": "التحقق من الأعراض (مجهول)",
    "hero.ask_assistant": "اسأل المساعد",
    "hero.clinician_verified": "تم التحقق منه طبياً",
    "features.title": "تمكين رحلتك الصحية",
    "features.description": "تم تصميمه مع الأطباء لتوفير أدوات آمنة ودقيقة ومفيدة لإدارة بطانة الرحم المهاجرة.",
    "card.tracking.title": "تتبع الأعراض",
    "card.tracking.desc": "احتفظي بمذكرات يومية مفصلة عن الأعراض والمحفزات ومواقع الألم.",
    "card.rag.title": "مساعد ELLA",
    "card.rag.desc": "اطرحي الأسئلة واحصلي على إجابات بناءً على الإرشادات الرسمية والمصادر الطبية الموثوقة.",
    "card.gp.title": "ملخص الطبيب",
    "card.gp.desc": "أنشئي ملخصاً احترافياً لأعراضك لمشاركته مع مقدم الرعاية الصحية الخاص بك.",
    "nav.home": "الرئيسية",
    "nav.symptom_checker": "فاحص الأعراض",
    "nav.care_assistant": "مساعد الرعاية",
    "nav.learn": "تعلم",
    "nav.clinician_portal": "بوابة الأطباء"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      <div dir={dir} className={language === 'ar' ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
