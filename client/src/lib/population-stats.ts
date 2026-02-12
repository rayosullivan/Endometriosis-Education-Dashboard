import { EndoPainScoring, Demographics } from "./endo-types";

// Helper to generate random normal distribution (approximate)
function randomNormal(mean: number, stdDev: number, min: number, max: number): number {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  num = num * stdDev + mean; 
  return Math.min(Math.max(Math.round(num), min), max);
}

// Generate 500 mock patient records
const MOCK_POPULATION_SIZE = 500;

interface PatientRecord {
  demographics: Demographics;
  scoring: EndoPainScoring;
}

const generateMockData = (): PatientRecord[] => {
  const data: PatientRecord[] = [];
  for (let i = 0; i < MOCK_POPULATION_SIZE; i++) {
    data.push({
      demographics: {
        age: randomNormal(29, 6, 18, 50),
        yearsWithSymptoms: randomNormal(6, 4, 0, 20),
        email: null,
      },
      scoring: {
        painDisability: {
          pelvicPainSeverity: randomNormal(6, 2, 0, 10),
          dysmenorrheaIntensity: randomNormal(7, 2, 0, 10),
          dailyActivityInterference: randomNormal(3, 1.5, 0, 5),
          workAbsenceDays: randomNormal(3, 3, 0, 30),
          sleepDisruption: randomNormal(5, 3, 0, 10),
        },
        bowelSymptoms: {
          dyscheziaSeverity: randomNormal(4, 3, 0, 10),
          cyclicalBowelPain: randomNormal(4, 3, 0, 10),
          menstrualBowelChanges: Math.random() > 0.4,
          rectalBleeding: Math.random() > 0.8,
          bloatingCramping: randomNormal(6, 2, 0, 10),
        },
        dyspareunia: {
          deepDyspareunia: randomNormal(5, 3, 0, 10),
          superficialDyspareunia: randomNormal(3, 2, 0, 10),
          postCoitalPain: randomNormal(4, 3, 0, 10),
          relationshipImpact: randomNormal(4, 3, 0, 10),
          avoidanceBehavior: Math.random() > 0.5,
        },
        urinarySymptoms: {
          dysuriaSeverity: randomNormal(2, 2, 0, 10),
          urgencyFrequency: randomNormal(3, 3, 0, 10),
          cyclicalUrinarySymptoms: Math.random() > 0.6,
          menstrualHematuria: Math.random() > 0.9,
          bladderPressure: randomNormal(3, 2, 0, 10),
        },
      }
    });
  }
  return data;
};

const mockData = generateMockData();

// Statistical Helpers
const calculateMean = (values: number[]) => {
  if (values.length === 0) return 0;
  return Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1));
};

const calculateMedian = (values: number[]) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const calculatePercentile = (values: number[], percentile: number) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
};

interface FieldStats {
  label: string;
  mean: number;
  median: number;
  p10: number; // 10th percentile
}

export const getPopulationStats = (): { category: string, stats: FieldStats[] }[] => {
  const getFieldValues = (extractor: (r: PatientRecord) => number | null) => 
    mockData.map(extractor).filter((v): v is number => v !== null);

  const createStats = (label: string, extractor: (r: PatientRecord) => number | null): FieldStats => {
    const values = getFieldValues(extractor);
    return {
      label,
      mean: calculateMean(values),
      median: calculateMedian(values),
      p10: calculatePercentile(values, 10),
    };
  };

  return [
    {
      category: "Demographics",
      stats: [
        createStats("Age (years)", r => r.demographics.age),
        createStats("Years with Symptoms", r => r.demographics.yearsWithSymptoms),
      ]
    },
    {
      category: "Pain & Disability",
      stats: [
        createStats("Pelvic Pain (0-10)", r => r.scoring.painDisability.pelvicPainSeverity),
        createStats("Dysmenorrhea (0-10)", r => r.scoring.painDisability.dysmenorrheaIntensity),
        createStats("Activity Interference (0-5)", r => r.scoring.painDisability.dailyActivityInterference),
        createStats("Work Absence (days/mo)", r => r.scoring.painDisability.workAbsenceDays),
        createStats("Sleep Disruption (0-10)", r => r.scoring.painDisability.sleepDisruption),
      ]
    },
    {
      category: "Bowel Symptoms",
      stats: [
        createStats("Dyschezia (0-10)", r => r.scoring.bowelSymptoms.dyscheziaSeverity),
        createStats("Cyclical Bowel Pain (0-10)", r => r.scoring.bowelSymptoms.cyclicalBowelPain),
        createStats("Bloating/Cramping (0-10)", r => r.scoring.bowelSymptoms.bloatingCramping),
      ]
    },
    {
      category: "Sexual Health",
      stats: [
        createStats("Deep Dyspareunia (0-10)", r => r.scoring.dyspareunia.deepDyspareunia),
        createStats("Superficial Dyspareunia (0-10)", r => r.scoring.dyspareunia.superficialDyspareunia),
        createStats("Post-Coital Pain (0-10)", r => r.scoring.dyspareunia.postCoitalPain),
        createStats("Relationship Impact (0-10)", r => r.scoring.dyspareunia.relationshipImpact),
      ]
    },
    {
      category: "Urinary Symptoms",
      stats: [
        createStats("Dysuria (0-10)", r => r.scoring.urinarySymptoms.dysuriaSeverity),
        createStats("Urgency/Frequency (0-10)", r => r.scoring.urinarySymptoms.urgencyFrequency),
        createStats("Bladder Pressure (0-10)", r => r.scoring.urinarySymptoms.bladderPressure),
      ]
    }
  ];
};
