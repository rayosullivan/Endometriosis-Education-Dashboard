

export interface PainDisabilitySymptoms {
  pelvicPainSeverity: number; // 0-10
  dysmenorrheaIntensity: number; // 0-10
  dailyActivityInterference: number; // 0-5
  workAbsenceDays: number; // 0-30
  sleepDisruption: number; // 0-10
}

export interface BowelSymptoms {
  dyscheziaSeverity: number; // 0-10
  cyclicalBowelPain: number; // 0-10
  menstrualBowelChanges: boolean;
  rectalBleeding: boolean;
  bloatingCramping: number; // 0-10
}

export interface DyspareuniaSymptoms {
  deepDyspareunia: number; // 0-10
  superficialDyspareunia: number; // 0-10
  postCoitalPain: number; // 0-10
  relationshipImpact: number; // 0-10
  avoidanceBehavior: boolean;
}

export interface UrinarySymptoms {
  dysuriaSeverity: number; // 0-10
  urgencyFrequency: number; // 0-10
  cyclicalUrinarySymptoms: boolean;
  menstrualHematuria: boolean;
  bladderPressure: number; // 0-10
}

export interface EndoPainScoring {
  painDisability: PainDisabilitySymptoms;
  bowelSymptoms: BowelSymptoms;
  dyspareunia: DyspareuniaSymptoms;
  urinarySymptoms: UrinarySymptoms;
}

export interface Demographics {
    age: number | null;
    yearsWithSymptoms: number | null;
    email: string | null;
}

export interface MedicalReport {
  patientId: string;
  assessmentDate: Date;
  riskScore: number;
  riskCategory: 'Low' | 'Moderate' | 'High' | 'Very High';
  endopainBreakdown: EndoPainScoring;
  demographics: Demographics;
  clinicalRecommendations: string[];
  redFlags: string[];
  suggestedInvestigations: string[];
}

export enum Step {
    Welcome,
    Demographics,
    PainDisability,
    BowelSymptoms,
    Dyspareunia,
    UrinarySymptoms,
    Results,
}