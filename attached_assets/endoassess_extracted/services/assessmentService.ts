

import { jsPDF } from 'jspdf';
import type { EndoPainScoring, MedicalReport, Demographics, PainDisabilitySymptoms, BowelSymptoms, DyspareuniaSymptoms, UrinarySymptoms } from '../types';

class EndometriosisProbabilityCalculator {
  private scorePainDimension(symptoms: PainDisabilitySymptoms): number {
    let score = 0;
    score += symptoms.pelvicPainSeverity * 1.5;
    score += symptoms.dysmenorrheaIntensity * 1.5;
    score += symptoms.dailyActivityInterference * 2;
    score += (symptoms.workAbsenceDays > 5 ? 5 : symptoms.workAbsenceDays) * 1.5;
    score += symptoms.sleepDisruption;
    return score;
  }

  private scoreBowelDimension(symptoms: BowelSymptoms): number {
    let score = 0;
    score += symptoms.dyscheziaSeverity * 2;
    score += symptoms.cyclicalBowelPain * 1.5;
    score += symptoms.menstrualBowelChanges ? 10 : 0;
    score += symptoms.rectalBleeding ? 15 : 0; // Red flag
    score += symptoms.bloatingCramping;
    return score;
  }

  private scoreSexualDimension(symptoms: DyspareuniaSymptoms): number {
    let score = 0;
    score += symptoms.deepDyspareunia * 2.5;
    score += symptoms.superficialDyspareunia;
    score += symptoms.postCoitalPain * 1.5;
    score += symptoms.relationshipImpact;
    score += symptoms.avoidanceBehavior ? 10 : 0;
    return score;
  }

  private scoreUrinaryDimension(symptoms: UrinarySymptoms): number {
    let score = 0;
    score += symptoms.dysuriaSeverity * 1.5;
    score += symptoms.urgencyFrequency;
    score += symptoms.cyclicalUrinarySymptoms ? 10 : 0;
    score += symptoms.menstrualHematuria ? 15 : 0; // Red flag
    score += symptoms.bladderPressure;
    return score;
  }

  private calculateDemographicRisk(demographics: Demographics): number {
    let risk = 0;
    if (demographics.age && demographics.age >= 25 && demographics.age <= 40) {
      risk += 5;
    }
    if (demographics.yearsWithSymptoms && demographics.yearsWithSymptoms > 5) {
      risk += demographics.yearsWithSymptoms;
    }
    return risk;
  }
  
  private convertToProbability(totalScore: number): number {
    // A non-linear conversion to probability, capping at 99%.
    const probability = 100 / (1 + Math.exp(-0.05 * (totalScore - 50)));
    return Math.min(Math.round(probability), 99);
  }

  public calculateRisk(symptoms: EndoPainScoring, demographics: Demographics): number {
    const painScore = this.scorePainDimension(symptoms.painDisability);
    const bowelScore = this.scoreBowelDimension(symptoms.bowelSymptoms);
    const sexualScore = this.scoreSexualDimension(symptoms.dyspareunia);
    const urinaryScore = this.scoreUrinaryDimension(symptoms.urinarySymptoms);
    
    const endopainTotal = painScore + bowelScore + sexualScore + urinaryScore;
    const demographicRisk = this.calculateDemographicRisk(demographics);
    
    return this.convertToProbability(endopainTotal + demographicRisk);
  }
}

class MedicalReportGenerator {
  public generatePDF(assessment: MedicalReport): void {
    const doc = new jsPDF();
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(34, 44, 84);
    doc.text('Endometriosis Symptom Assessment Report', 105, 20, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Patient ID: ${assessment.patientId}`, 20, 35);
    doc.text(`Assessment Date: ${assessment.assessmentDate.toLocaleDateString()}`, 20, 42);

    // Risk Summary
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 44, 84);
    doc.text('Risk Summary', 20, 60);
    doc.setLineWidth(0.5);
    doc.line(20, 62, 190, 62);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Calculated Risk Probability:`, 20, 72);
    doc.setFont('helvetica', 'bold');
    doc.text(`${assessment.riskScore}%`, 80, 72);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Risk Category:`, 20, 80);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(assessment.riskCategory === 'High' || assessment.riskCategory === 'Very High' ? '#DC2626' : '#16A34A');
    doc.text(assessment.riskCategory, 80, 80);
    doc.setTextColor(0, 0, 0);

    // Breakdown
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 44, 84);
    doc.text('ENDOPAIN-4D Symptom Breakdown', 20, 95);
    doc.line(20, 97, 190, 97);
    
    const breakdown = assessment.endopainBreakdown;
    let y = 107;
    
    const addSection = (title: string, data: [string, string | number | boolean][]) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 25, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      data.forEach(([label, value]) => {
        const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value.toString();
        doc.text(`- ${label}:`, 30, y);
        doc.text(displayValue, 100, y);
        y += 6;
      });
      y += 4;
    };

    addSection('Pain & Disability', [
      ['Pelvic Pain Severity (0-10)', breakdown.painDisability.pelvicPainSeverity],
      ['Dysmenorrhea Intensity (0-10)', breakdown.painDisability.dysmenorrheaIntensity],
      ['Activity Interference (0-5)', breakdown.painDisability.dailyActivityInterference],
      ['Work Absence Days (last month)', breakdown.painDisability.workAbsenceDays],
      ['Sleep Disruption (0-10)', breakdown.painDisability.sleepDisruption],
    ]);
    
    addSection('Bowel Symptoms', [
        ['Dyschezia Severity (0-10)', breakdown.bowelSymptoms.dyscheziaSeverity],
        ['Cyclical Bowel Pain (0-10)', breakdown.bowelSymptoms.cyclicalBowelPain],
        ['Menstrual Bowel Changes', breakdown.bowelSymptoms.menstrualBowelChanges],
        ['Rectal Bleeding', breakdown.bowelSymptoms.rectalBleeding],
        ['Bloating/Cramping (0-10)', breakdown.bowelSymptoms.bloatingCramping],
    ]);

    doc.addPage();
    y = 20;

    addSection('Dyspareunia (Sexual Pain)', [
        ['Deep Dyspareunia (0-10)', breakdown.dyspareunia.deepDyspareunia],
        ['Superficial Dyspareunia (0-10)', breakdown.dyspareunia.superficialDyspareunia],
        ['Post-Coital Pain (0-10)', breakdown.dyspareunia.postCoitalPain],
        ['Relationship Impact (0-10)', breakdown.dyspareunia.relationshipImpact],
        ['Avoidance Behavior', breakdown.dyspareunia.avoidanceBehavior],
    ]);

    addSection('Urinary Symptoms', [
        ['Dysuria Severity (0-10)', breakdown.urinarySymptoms.dysuriaSeverity],
        ['Urgency/Frequency (0-10)', breakdown.urinarySymptoms.urgencyFrequency],
        ['Cyclical Urinary Symptoms', breakdown.urinarySymptoms.cyclicalUrinarySymptoms],
        ['Menstrual Hematuria', breakdown.urinarySymptoms.menstrualHematuria],
        ['Bladder Pressure (0-10)', breakdown.urinarySymptoms.bladderPressure],
    ]);

    // Recommendations
    const addListSection = (title: string, items: string[]) => {
      if (items.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(34, 44, 84);
        doc.text(title, 20, y);
        doc.line(20, y + 2, 190, y + 2);
        y += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0,0,0);
        items.forEach(rec => {
          const splitText = doc.splitTextToSize(`• ${rec}`, 165);
          doc.text(splitText, 25, y);
          y += (splitText.length * 5);
        });
        y += 5;
      }
    };
    
    addListSection('Key Red Flags Identified', assessment.redFlags);
    addListSection('Suggested Next Steps & Investigations', assessment.suggestedInvestigations);
    addListSection('Clinical Recommendations', assessment.clinicalRecommendations);

    // Disclaimer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    const disclaimer = 'This assessment is an informational tool based on the ENDOPAIN-4D scoring system and is not a substitute for a medical diagnosis. All findings and recommendations should be discussed with a qualified healthcare provider for proper evaluation and management.';
    const splitDisclaimer = doc.splitTextToSize(disclaimer, 170);
    doc.text(splitDisclaimer, 20, 280);

    doc.save(`Endometriosis_Assessment_${assessment.patientId}.pdf`);
  }

  public generateReferralLetter(assessment: MedicalReport, gpDetails: { name: string, address: string }): void {
    const doc = new jsPDF();
    const patientIdentifier = assessment.demographics.email || assessment.patientId;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    // Header
    const today = new Date().toLocaleDateString();
    doc.text(`Patient: ${patientIdentifier}`, 190, 20, { align: 'right' });
    doc.text(`Date: ${today}`, 190, 25, { align: 'right' });

    // GP Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const splitAddress = doc.splitTextToSize(gpDetails.address, 80);
    doc.text(`To: Dr. ${gpDetails.name}`, 20, 40);
    doc.setFont('helvetica', 'normal');
    doc.text(splitAddress, 20, 47);
    
    let y = 70;

    // Subject
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`RE: Endometriosis Symptom Assessment Results`, 105, y, { align: 'center' });
    y += 15;

    // Body
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Dear Dr. ${gpDetails.name},`, 20, y);
    y += 10;
    
    const introText = `I am writing to share the results of a self-administered endometriosis symptom assessment I recently completed. The tool, based on the ENDOPAIN-4D framework, provides a structured overview of my symptoms to facilitate our discussion.`;
    const splitIntro = doc.splitTextToSize(introText, 170);
    doc.text(splitIntro, 20, y);
    y += (splitIntro.length * 5) + 5;

    doc.setFont('helvetica', 'bold');
    doc.text('Summary of Assessment:', 20, y);
    y += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`• Risk Probability:`, 25, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${assessment.riskScore}% (${assessment.riskCategory} Risk)`, 75, y);
    y += 7;
    
    const keySymptoms: string[] = [];
    if (assessment.endopainBreakdown.painDisability.pelvicPainSeverity > 5) keySymptoms.push(`Severe pelvic pain (${assessment.endopainBreakdown.painDisability.pelvicPainSeverity}/10)`);
    if (assessment.endopainBreakdown.painDisability.dysmenorrheaIntensity > 5) keySymptoms.push(`Severe menstrual pain (${assessment.endopainBreakdown.painDisability.dysmenorrheaIntensity}/10)`);
    if (assessment.endopainBreakdown.bowelSymptoms.dyscheziaSeverity > 5) keySymptoms.push(`Painful bowel movements (${assessment.endopainBreakdown.bowelSymptoms.dyscheziaSeverity}/10)`);
    if (assessment.endopainBreakdown.dyspareunia.deepDyspareunia > 5) keySymptoms.push(`Deep dyspareunia (${assessment.endopainBreakdown.dyspareunia.deepDyspareunia}/10)`);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`• Key Reported Symptoms:`, 25, y);
    let symptomY = y;
    if(keySymptoms.length > 0) {
        keySymptoms.slice(0, 3).forEach(symptom => {
            symptomY += 6;
            doc.text(`- ${symptom}`, 30, symptomY);
        });
        y = symptomY;
    } else {
         y+=6;
         doc.text(`- Multiple symptoms reported across pain, bowel, and urinary domains.`, 30, y);
    }
    y += 7;
    
    if (assessment.redFlags.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.text(`• Red Flags Identified:`, 25, y);
        let flagY = y;
        assessment.redFlags.forEach(flag => {
            flagY += 6;
            const splitFlag = doc.splitTextToSize(`- ${flag}`, 150);
            doc.text(splitFlag, 30, flagY);
            flagY += (splitFlag.length - 1) * 5;
        });
        y = flagY;
        y += 7;
    }

    const conclusionText = `A more detailed breakdown from the full report can be provided upon request. I would be grateful to discuss these findings with you at your earliest convenience to determine appropriate next steps for investigation and management.`;
    const splitConclusion = doc.splitTextToSize(conclusionText, 170);
    y += 5;
    doc.text(splitConclusion, 20, y);
    y += (splitConclusion.length * 5) + 15;

    doc.text('Thank you for your time and consideration.', 20, y);
    y += 10;
    doc.text('Sincerely,', 20, y);
    y += 7;
    doc.text(patientIdentifier, 20, y);
    
    // Disclaimer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    const disclaimer = 'This letter and the associated assessment are patient-reported tools and are not a substitute for a formal medical diagnosis. They are intended to aid communication between patient and provider.';
    const splitDisclaimer = doc.splitTextToSize(disclaimer, 170);
    doc.text(splitDisclaimer, 20, 280);

    doc.save(`GP_Referral_Letter_${assessment.patientId}.pdf`);
  }
}

export const assessmentService = {
    calculator: new EndometriosisProbabilityCalculator(),
    reportGenerator: new MedicalReportGenerator(),
};