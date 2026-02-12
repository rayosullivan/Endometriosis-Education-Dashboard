import React, { useState, useCallback, useEffect } from 'react';
import type { EndoPainScoring, Demographics, MedicalReport } from './types';
import { Step } from './types';
import { assessmentService } from './services/assessmentService';
import { Chatbot } from './components/Chatbot';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { MicrophoneIcon, VolumeUpIcon } from './components/icons';
import { translations } from './translations';


const initialScores: EndoPainScoring = {
  painDisability: { pelvicPainSeverity: 0, dysmenorrheaIntensity: 0, dailyActivityInterference: 0, workAbsenceDays: 0, sleepDisruption: 0 },
  bowelSymptoms: { dyscheziaSeverity: 0, cyclicalBowelPain: 0, menstrualBowelChanges: false, rectalBleeding: false, bloatingCramping: 0 },
  dyspareunia: { deepDyspareunia: 0, superficialDyspareunia: 0, postCoitalPain: 0, relationshipImpact: 0, avoidanceBehavior: false },
  urinarySymptoms: { dysuriaSeverity: 0, urgencyFrequency: 0, cyclicalUrinarySymptoms: false, menstrualHematuria: false, bladderPressure: 0 },
};

const initialDemographics: Demographics = { age: null, yearsWithSymptoms: null, email: null };

// Reusable Components defined outside the main App component
const SliderInput: React.FC<{ label: string; value: number; max?: number; onChange: (value: number) => void; helpText: string; onSpeak: () => void; readAloudTitle: string; }> = ({ label, value, max = 10, onChange, helpText, onSpeak, readAloudTitle }) => (
    <div className="mb-6">
        <label className="block text-md font-medium text-gray-700 mb-2 flex items-center justify-between">
            {label}
            <button onClick={onSpeak} className="text-fuchsia-500 hover:text-fuchsia-700" aria-label={readAloudTitle}><VolumeUpIcon className="w-5 h-5"/></button>
        </label>
        <input
            type="range"
            min="0"
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer vibrant-slider"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>0</span>
            <span className="font-semibold text-purple-700 text-lg">{value}</span>
            <span>{max}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">{helpText}</p>
    </div>
);

const BooleanInput: React.FC<{ label: string; value: boolean; onChange: (value: boolean) => void; helpText: string; onSpeak: () => void; yesLabel: string; noLabel: string; readAloudTitle: string; }> = ({ label, value, onChange, helpText, onSpeak, yesLabel, noLabel, readAloudTitle }) => (
    <div className="mb-6">
        <label className="block text-md font-medium text-gray-700 mb-2 flex items-center justify-between">
            {label}
             <button onClick={onSpeak} className="text-fuchsia-500 hover:text-fuchsia-700" aria-label={readAloudTitle}><VolumeUpIcon className="w-5 h-5"/></button>
        </label>
        <div className="flex space-x-4">
            <button onClick={() => onChange(true)} className={`px-6 py-2 rounded-md text-sm font-medium ${value ? 'btn-gradient text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{yesLabel}</button>
            <button onClick={() => onChange(false)} className={`px-6 py-2 rounded-md text-sm font-medium ${!value ? 'btn-gradient text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{noLabel}</button>
        </div>
        <p className="text-xs text-gray-500 mt-2">{helpText}</p>
    </div>
);

const NumberInput: React.FC<{ label: string; value: number | null; onChange: (value: number | null) => void; helpText: string; onSpeak: () => void; placeholder: string; readAloudTitle: string; }> = ({ label, value, onChange, helpText, onSpeak, placeholder, readAloudTitle }) => (
    <div className="mb-6">
        <label className="block text-md font-medium text-gray-700 mb-2 flex items-center justify-between">
            {label}
            <button onClick={onSpeak} className="text-fuchsia-500 hover:text-fuchsia-700" aria-label={readAloudTitle}><VolumeUpIcon className="w-5 h-5"/></button>
        </label>
        <input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value === '' ? null : parseInt(e.target.value, 10))}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500"
        />
        <p className="text-xs text-gray-500 mt-1">{helpText}</p>
    </div>
);

const TextInput: React.FC<{ label: string; value: string; onChange: (value: string) => void; helpText: string; onSpeak: () => void; placeholder: string; readAloudTitle: string; type?: string; }> = ({ label, value, onChange, helpText, onSpeak, placeholder, readAloudTitle, type = 'text' }) => (
    <div className="mb-6">
        <label className="block text-md font-medium text-gray-700 mb-2 flex items-center justify-between">
            {label}
            <button onClick={onSpeak} className="text-fuchsia-500 hover:text-fuchsia-700" aria-label={readAloudTitle}><VolumeUpIcon className="w-5 h-5"/></button>
        </label>
        <input
            type={type}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500"
        />
        <p className="text-xs text-gray-500 mt-1">{helpText}</p>
    </div>
);


const ProgressBar: React.FC<{ currentStep: number, totalSteps: number }> = ({ currentStep, totalSteps }) => {
    const progress = (currentStep / totalSteps) * 100;
    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
            <div className="progress-gradient h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
    );
}

// Main App Component
const App: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<Step>(Step.Welcome);
    const [scores, setScores] = useState<EndoPainScoring>(initialScores);
    const [demographics, setDemographics] = useState<Demographics>(initialDemographics);
    const [riskScore, setRiskScore] = useState<number>(0);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [language, setLanguage] = useState('en-US');
    const [gpDetails, setGpDetails] = useState({ name: '', address: '' });

    const t = translations[language as keyof typeof translations];

    useEffect(() => {
        document.body.dir = language === 'ar-SA' ? 'rtl' : 'ltr';
    }, [language]);
    
    const handleTranscriptChange = useCallback((transcript: string) => {
        console.log("Live transcript:", transcript);
        // Here you could parse the transcript and fill a form field, e.g. for a text input.
    }, []);

    const { isListening, transcript, startListening, stopListening, hasRecognitionSupport, error } = useSpeechRecognition(handleTranscriptChange, language);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setUploadedFile(event.target.files[0]);
        }
    };

    const speak = (text: string) => {
        speechSynthesis.cancel(); // Cancel any previous speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
    };

    const updateScores = <K extends keyof EndoPainScoring>(category: K, field: keyof EndoPainScoring[K], value: any) => {
        setScores(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };
    
    const updateDemographics = (field: keyof Demographics, value: any) => {
        setDemographics(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, Step.Results));
    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, Step.Welcome));

    const calculateResults = useCallback(() => {
        const score = assessmentService.calculator.calculateRisk(scores, demographics);
        setRiskScore(score);
        setCurrentStep(Step.Results);
    }, [scores, demographics]);

    const getReportData = (): MedicalReport => {
        const riskCategory = riskScore > 75 ? 'Very High' : riskScore > 50 ? 'High' : riskScore > 25 ? 'Moderate' : 'Low';
        const redFlags: string[] = [];
        if (scores.bowelSymptoms.rectalBleeding) redFlags.push("Cyclical rectal bleeding during menstruation.");
        if (scores.urinarySymptoms.menstrualHematuria) redFlags.push("Cyclical blood in urine during menstruation (hematuria).");
        if (scores.painDisability.pelvicPainSeverity > 8 || scores.painDisability.dysmenorrheaIntensity > 8) redFlags.push("Severe, debilitating pelvic pain (rated >8/10).")

        return {
            patientId: `USER-${Date.now()}`,
            assessmentDate: new Date(),
            riskScore,
            riskCategory,
            endopainBreakdown: scores,
            demographics,
            redFlags,
            suggestedInvestigations: [
                "Transvaginal ultrasound (TVUS) with bowel preparation.",
                "Pelvic MRI if deep infiltrating endometriosis is suspected.",
                "Consultation with a gynecology specialist with expertise in endometriosis."
            ],
            clinicalRecommendations: [
                "Discuss pain management options (NSAIDs, hormonal therapy).",
                "Consider pelvic floor physical therapy.",
                "Keep a detailed symptom diary to track patterns."
            ]
        };
    };
    
    const handleGenerateReport = () => {
        const reportData = getReportData();
        assessmentService.reportGenerator.generatePDF(reportData);
    };

    const handleGenerateReferralLetter = () => {
        if (!gpDetails.name.trim() || !gpDetails.address.trim()) {
            alert('Please enter your GP details before generating the letter.');
            return;
        }
        const reportData = getReportData();
        assessmentService.reportGenerator.generateReferralLetter(reportData, gpDetails);
    };

    const resetAssessment = () => {
        setScores(initialScores);
        setDemographics(initialDemographics);
        setRiskScore(0);
        setCurrentStep(Step.Welcome);
        setUploadedFile(null);
        setGpDetails({ name: '', address: '' });
    }

    const getSpeechErrorText = (error: string | null): string => {
        if (!error) return '';
        const welcomeTranslations = t.welcome as any;
        switch (error) {
            case 'network':
                return welcomeTranslations.voiceErrorNetwork;
            case 'not-allowed':
            case 'service-not-allowed':
                return welcomeTranslations.voiceErrorNotAllowed;
            case 'no-speech':
                return welcomeTranslations.voiceErrorNoSpeech;
            default:
                return welcomeTranslations.voiceErrorGeneric;
        }
    }
    
    const renderStep = () => {
        switch (currentStep) {
            case Step.Welcome:
                return (
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4 header-gradient">{t.welcome.title}</h1>
                        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">{t.welcome.description}</p>
                        <div className="p-4 mb-6 bg-rose-100 border-l-4 border-rose-500 text-rose-800 text-left">
                           <p className="font-bold">{t.welcome.disclaimerTitle}</p>
                           <p>{t.welcome.disclaimerText}</p>
                        </div>

                        <div className="max-w-md mx-auto my-4 text-left">
                            <label htmlFor="language-select" className="block text-md font-medium text-gray-700 mb-2">{t.welcome.selectLanguage}</label>
                            <select 
                                id="language-select" 
                                value={language} 
                                onChange={(e) => setLanguage(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500"
                            >
                                <option value="en-US">English</option>
                                <option value="es-ES">Español (Spanish)</option>
                                <option value="pt-BR">Português (Portuguese)</option>
                                <option value="uk-UA">Українська (Ukrainian)</option>
                                <option value="ar-SA">العربية (Arabic)</option>
                            </select>
                        </div>
                        
                        <div className="max-w-md mx-auto my-4 text-left">
                            <label htmlFor="file-upload" className="block text-md font-medium text-gray-700 mb-2">{t.welcome.uploadLabel}</label>
                            <input id="file-upload" type="file" onChange={handleFileUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-50 file:text-fuchsia-700 hover:file:bg-fuchsia-100"/>
                            {uploadedFile && <p className="text-sm text-green-600 mt-2">{t.welcome.fileLoaded}: {uploadedFile.name}</p>}
                        </div>

                         {hasRecognitionSupport && (
                             <div className="max-w-md mx-auto my-6 p-4 border rounded-lg">
                                 <h3 className="font-semibold mb-2">{t.welcome.voiceTitle}</h3>
                                 <p className="text-sm text-gray-500 mb-3">{t.welcome.voiceDescription}</p>
                                 <button onClick={isListening ? stopListening : startListening} className={`px-4 py-2 rounded-full flex items-center justify-center mx-auto transition-colors text-white ${isListening ? 'bg-red-500' : 'btn-gradient'}`}>
                                     <MicrophoneIcon className="w-5 h-5 mr-2"/>
                                     {isListening ? t.buttons.stopListening : t.buttons.startListening}
                                 </button>
                                 {transcript && <p className="mt-3 text-gray-600 italic">"{transcript}"</p>}
                                 {error && (
                                    <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm text-left" role="alert">
                                        <p className="font-bold">{t.welcome.voiceErrorTitle}</p>
                                        <p>{getSpeechErrorText(error)}</p>
                                    </div>
                                 )}
                             </div>
                         )}
                        <button onClick={handleNext} className="mt-4 px-8 py-3 btn-gradient text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">{t.buttons.begin}</button>
                    </div>
                );
            case Step.Demographics:
                return <Questionnaire title={t.demographics.title} onNext={handleNext} onBack={handleBack} backLabel={t.buttons.back} nextLabel={t.buttons.next}>
                    <NumberInput label={t.demographics.ageLabel} value={demographics.age} onChange={(v) => updateDemographics('age', v)} helpText={t.demographics.ageHelp} onSpeak={() => speak(t.demographics.ageLabel)} placeholder="e.g., 32" readAloudTitle={t.shared.readAloud}/>
                    <NumberInput label={t.demographics.yearsLabel} value={demographics.yearsWithSymptoms} onChange={(v) => updateDemographics('yearsWithSymptoms', v)} helpText={t.demographics.yearsHelp} onSpeak={() => speak(t.demographics.yearsLabel)} placeholder="e.g., 5" readAloudTitle={t.shared.readAloud}/>
                    <TextInput label={t.demographics.emailLabel} value={demographics.email || ''} onChange={(v) => updateDemographics('email', v)} helpText={t.demographics.emailHelp} onSpeak={() => speak(t.demographics.emailLabel)} placeholder="your.email@example.com" readAloudTitle={t.shared.readAloud} type="email" />
                </Questionnaire>
            case Step.PainDisability:
                return <Questionnaire title={t.pain.title} onNext={handleNext} onBack={handleBack} backLabel={t.buttons.back} nextLabel={t.buttons.next}>
                    <SliderInput label={t.pain.pelvicPainSeverity} value={scores.painDisability.pelvicPainSeverity} onChange={(v) => updateScores('painDisability', 'pelvicPainSeverity', v)} helpText={t.pain.pelvicPainSeverityHelp} onSpeak={() => speak(t.pain.pelvicPainSeverity)} readAloudTitle={t.shared.readAloud}/>
                    <SliderInput label={t.pain.dysmenorrheaIntensity} value={scores.painDisability.dysmenorrheaIntensity} onChange={(v) => updateScores('painDisability', 'dysmenorrheaIntensity', v)} helpText={t.pain.dysmenorrheaIntensityHelp} onSpeak={() => speak(t.pain.dysmenorrheaIntensity)} readAloudTitle={t.shared.readAloud}/>
                    <SliderInput label={t.pain.dailyActivityInterference} value={scores.painDisability.dailyActivityInterference} max={5} onChange={(v) => updateScores('painDisability', 'dailyActivityInterference', v)} helpText={t.pain.dailyActivityInterferenceHelp} onSpeak={() => speak(t.pain.dailyActivityInterference)} readAloudTitle={t.shared.readAloud}/>
                    <SliderInput label={t.pain.workAbsenceDays} value={scores.painDisability.workAbsenceDays} max={30} onChange={(v) => updateScores('painDisability', 'workAbsenceDays', v)} helpText={t.pain.workAbsenceDaysHelp} onSpeak={() => speak(t.pain.workAbsenceDays)} readAloudTitle={t.shared.readAloud}/>
                    <SliderInput label={t.pain.sleepDisruption} value={scores.painDisability.sleepDisruption} onChange={(v) => updateScores('painDisability', 'sleepDisruption', v)} helpText={t.pain.sleepDisruptionHelp} onSpeak={() => speak(t.pain.sleepDisruption)} readAloudTitle={t.shared.readAloud}/>
                </Questionnaire>
            case Step.BowelSymptoms:
                 return <Questionnaire title={t.bowel.title} onNext={handleNext} onBack={handleBack} backLabel={t.buttons.back} nextLabel={t.buttons.next}>
                    <SliderInput label={t.bowel.dyscheziaSeverity} value={scores.bowelSymptoms.dyscheziaSeverity} onChange={(v) => updateScores('bowelSymptoms', 'dyscheziaSeverity', v)} helpText={t.bowel.dyscheziaSeverityHelp} onSpeak={() => speak(t.bowel.dyscheziaSeverity)} readAloudTitle={t.shared.readAloud}/>
                    <SliderInput label={t.bowel.cyclicalBowelPain} value={scores.bowelSymptoms.cyclicalBowelPain} onChange={(v) => updateScores('bowelSymptoms', 'cyclicalBowelPain', v)} helpText={t.bowel.cyclicalBowelPainHelp} onSpeak={() => speak(t.bowel.cyclicalBowelPain)} readAloudTitle={t.shared.readAloud}/>
                    <BooleanInput label={t.bowel.menstrualBowelChanges} value={scores.bowelSymptoms.menstrualBowelChanges} onChange={(v) => updateScores('bowelSymptoms', 'menstrualBowelChanges', v)} helpText={t.bowel.menstrualBowelChangesHelp} onSpeak={() => speak(t.bowel.menstrualBowelChanges)} yesLabel={t.buttons.yes} noLabel={t.buttons.no} readAloudTitle={t.shared.readAloud}/>
                    <BooleanInput label={t.bowel.rectalBleeding} value={scores.bowelSymptoms.rectalBleeding} onChange={(v) => updateScores('bowelSymptoms', 'rectalBleeding', v)} helpText={t.bowel.rectalBleedingHelp} onSpeak={() => speak(t.bowel.rectalBleeding)} yesLabel={t.buttons.yes} noLabel={t.buttons.no} readAloudTitle={t.shared.readAloud}/>
                    <SliderInput label={t.bowel.bloatingCramping} value={scores.bowelSymptoms.bloatingCramping} onChange={(v) => updateScores('bowelSymptoms', 'bloatingCramping', v)} helpText={t.bowel.bloatingCrampingHelp} onSpeak={() => speak(t.bowel.bloatingCramping)} readAloudTitle={t.shared.readAloud}/>
                </Questionnaire>
            case Step.Dyspareunia:
                return <Questionnaire title={t.dyspareunia.title} onNext={handleNext} onBack={handleBack} backLabel={t.buttons.back} nextLabel={t.buttons.next}>
                    <p className="text-sm text-gray-500 bg-gray-100 p-3 rounded-md mb-4">{t.dyspareunia.notice}</p>
                    <SliderInput label={t.dyspareunia.deepDyspareunia} value={scores.dyspareunia.deepDyspareunia} onChange={(v) => updateScores('dyspareunia', 'deepDyspareunia', v)} helpText={t.dyspareunia.deepDyspareuniaHelp} onSpeak={() => speak(t.dyspareunia.deepDyspareunia)} readAloudTitle={t.shared.readAloud}/>
                    <SliderInput label={t.dyspareunia.superficialDyspareunia} value={scores.dyspareunia.superficialDyspareunia} onChange={(v) => updateScores('dyspareunia', 'superficialDyspareunia', v)} helpText={t.dyspareunia.superficialDyspareuniaHelp} onSpeak={() => speak(t.dyspareunia.superficialDyspareunia)} readAloudTitle={t.shared.readAloud}/>
                    <SliderInput label={t.dyspareunia.postCoitalPain} value={scores.dyspareunia.postCoitalPain} onChange={(v) => updateScores('dyspareunia', 'postCoitalPain', v)} helpText={t.dyspareunia.postCoitalPainHelp} onSpeak={() => speak(t.dyspareunia.postCoitalPain)} readAloudTitle={t.shared.readAloud}/>
                    <SliderInput label={t.dyspareunia.relationshipImpact} value={scores.dyspareunia.relationshipImpact} onChange={(v) => updateScores('dyspareunia', 'relationshipImpact', v)} helpText={t.dyspareunia.relationshipImpactHelp} onSpeak={() => speak(t.dyspareunia.relationshipImpact)} readAloudTitle={t.shared.readAloud}/>
                    <BooleanInput label={t.dyspareunia.avoidanceBehavior} value={scores.dyspareunia.avoidanceBehavior} onChange={(v) => updateScores('dyspareunia', 'avoidanceBehavior', v)} helpText={t.dyspareunia.avoidanceBehaviorHelp} onSpeak={() => speak(t.dyspareunia.avoidanceBehavior)} yesLabel={t.buttons.yes} noLabel={t.buttons.no} readAloudTitle={t.shared.readAloud}/>
                </Questionnaire>
            case Step.UrinarySymptoms:
                return <Questionnaire title={t.urinary.title} onNext={calculateResults} onBack={handleBack} backLabel={t.buttons.back} nextLabel={t.buttons.calculate}>
                    <SliderInput label={t.urinary.dysuriaSeverity} value={scores.urinarySymptoms.dysuriaSeverity} onChange={(v) => updateScores('urinarySymptoms', 'dysuriaSeverity', v)} helpText={t.urinary.dysuriaSeverityHelp} onSpeak={() => speak(t.urinary.dysuriaSeverity)} readAloudTitle={t.shared.readAloud}/>
                    <SliderInput label={t.urinary.urgencyFrequency} value={scores.urinarySymptoms.urgencyFrequency} onChange={(v) => updateScores('urinarySymptoms', 'urgencyFrequency', v)} helpText={t.urinary.urgencyFrequencyHelp} onSpeak={() => speak(t.urinary.urgencyFrequency)} readAloudTitle={t.shared.readAloud}/>
                    <BooleanInput label={t.urinary.cyclicalUrinarySymptoms} value={scores.urinarySymptoms.cyclicalUrinarySymptoms} onChange={(v) => updateScores('urinarySymptoms', 'cyclicalUrinarySymptoms', v)} helpText={t.urinary.cyclicalUrinarySymptomsHelp} onSpeak={() => speak(t.urinary.cyclicalUrinarySymptoms)} yesLabel={t.buttons.yes} noLabel={t.buttons.no} readAloudTitle={t.shared.readAloud}/>
                    <BooleanInput label={t.urinary.menstrualHematuria} value={scores.urinarySymptoms.menstrualHematuria} onChange={(v) => updateScores('urinarySymptoms', 'menstrualHematuria', v)} helpText={t.urinary.menstrualHematuriaHelp} onSpeak={() => speak(t.urinary.menstrualHematuria)} yesLabel={t.buttons.yes} noLabel={t.buttons.no} readAloudTitle={t.shared.readAloud}/>
                    <SliderInput label={t.urinary.bladderPressure} value={scores.urinarySymptoms.bladderPressure} onChange={(v) => updateScores('urinarySymptoms', 'bladderPressure', v)} helpText={t.urinary.bladderPressureHelp} onSpeak={() => speak(t.urinary.bladderPressure)} readAloudTitle={t.shared.readAloud}/>
                </Questionnaire>
            case Step.Results:
                 const riskColor = riskScore > 75 ? 'text-red-500' : riskScore > 50 ? 'text-orange-500' : riskScore > 25 ? 'text-amber-500' : 'text-teal-500';
                 const riskCategory = riskScore > 75 ? t.results.catVeryHigh : riskScore > 50 ? t.results.catHigh : riskScore > 25 ? t.results.catModerate : t.results.catLow;
                return (
                    <div>
                        <div className="text-center">
                            <h2 className="text-3xl font-bold header-gradient mb-2">{t.results.title}</h2>
                            <p className="text-lg text-gray-600 mb-6">{t.results.description}</p>
                            <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
                               <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                    <path className={`${riskColor.replace('text-', 'stroke-')}`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${riskScore}, 100`}></path>
                               </svg>
                               <div className="absolute flex flex-col items-center">
                                   <span className={`text-5xl font-bold ${riskColor}`}>{riskScore}%</span>
                                   <span className="text-sm text-gray-500">{t.results.probability}</span>
                               </div>
                            </div>
                            <p className="text-xl font-semibold mb-8">{t.results.riskCategory}: <span className={riskColor}>{riskCategory}</span></p>

                            <div className="p-4 mb-6 bg-sky-100 border-l-4 border-sky-500 text-sky-800 text-left">
                               <p className="font-bold">{t.results.nextStepsTitle}</p>
                               <p>{t.results.nextStepsDescription}</p>
                            </div>

                            <div className="flex justify-center space-x-4">
                               <button onClick={handleGenerateReport} className="px-6 py-3 btn-gradient text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">{t.buttons.downloadPdf}</button>
                               <button onClick={resetAssessment} className="px-6 py-3 bg-pink-100 text-pink-700 font-semibold rounded-lg hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2">{t.buttons.newAssessment}</button>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{t.results.generateReferralTitle}</h3>
                            <div className="space-y-4 max-w-lg mx-auto text-left">
                                <div>
                                     <label className="block text-sm font-medium text-gray-700 mb-1">{t.results.gpNameLabel}</label>
                                     <input
                                        type="text"
                                        value={gpDetails.name}
                                        onChange={(e) => setGpDetails(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g., Dr. Jane Smith"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.results.gpAddressLabel}</label>
                                    <textarea
                                        value={gpDetails.address}
                                        onChange={(e) => setGpDetails(prev => ({ ...prev, address: e.target.value }))}
                                        placeholder="123 Health St&#10;Medtown, MD 12345"
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                    />
                                </div>
                            </div>
                            <div className="text-center mt-4">
                                <button onClick={handleGenerateReferralLetter} className="px-6 py-3 btn-gradient text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">{t.buttons.generateReferral}</button>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    const totalQuestionSteps = 5; // Demographics to Urinary
    const currentQuestionStep = currentStep > 0 && currentStep <= totalQuestionSteps+1 ? currentStep-1 : 0;

    return (
        <div className="min-h-screen bg-transparent flex flex-col items-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-3xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">EndoAssess AI</h1>
                </header>
                <main className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-white/50">
                    {currentStep > Step.Welcome && currentStep < Step.Results && <ProgressBar currentStep={currentQuestionStep} totalSteps={totalQuestionSteps} />}
                    {renderStep()}
                </main>
                 <footer className="text-center mt-6 text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} EndoAssess AI. {t.shared.footer}</p>
                </footer>
            </div>
            <Chatbot language={language} t={t.chatbot} />
        </div>
    );
};

interface QuestionnaireProps {
    title: string;
    children: React.ReactNode;
    onNext: () => void;
    onBack: () => void;
    nextLabel?: string;
    backLabel?: string;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ title, children, onNext, onBack, nextLabel="Next", backLabel="Back" }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold header-gradient mb-6 text-center">{title}</h2>
            <div>{children}</div>
            <div className="flex justify-between mt-8">
                <button onClick={onBack} className="px-6 py-2 bg-pink-100 text-pink-700 font-semibold rounded-lg hover:bg-pink-200">{backLabel}</button>
                <button onClick={onNext} className="px-6 py-2 btn-gradient text-white font-semibold rounded-lg shadow-md">{nextLabel}</button>
            </div>
        </div>
    );
}

export default App;