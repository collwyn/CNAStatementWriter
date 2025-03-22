import React, { useState } from 'react';
import { ChevronDown, Globe, ArrowLeft, ArrowRight } from 'lucide-react';
import { getAvailableLanguages, translateFormToEnglish } from '../utils/translationService';


export default function CNAStatementApp() {
    const [inputLanguage, setInputLanguage] = useState('en');
    const [currentStep, setCurrentStep] = useState(1);
    const [availableLanguages, setAvailableLanguages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
      cnaName: '',
      shift: '',
      patientName: '',
      roomNumber: '',
      floor: '',
      incidentDate: '',
      incidentTime: '',
      incidentType: '',
      incidentDescription: '',
      assistingPerson: '',
      fallDetails: {
        location: '',
        cause: '',
        injuries: '',
      },
      medicalEmergencyDetails: {
        symptoms: '',
        vitalSigns: '',
        actionTaken: '',
      },
    });

    useEffect(() => {
        // Fetch available languages when component mounts
        const fetchLanguages = async () => {
          const languages = await getAvailableLanguages();
          setAvailableLanguages(languages);
        };
        fetchLanguages();
      }, []);

      const handleGenerateStatement = async () => {
        setIsLoading(true);
        try {
          // Translate form data to English if not already in English
          const translatedData = await translateFormToEnglish(formData, inputLanguage);
          console.log('Translated form data:', translatedData);
          // Here you would handle the translated data (e.g., send to backend, display, etc.)
        } catch (error) {
          console.error('Error generating statement:', error);
        } finally {
          setIsLoading(false);
        }
      };

       // Update the language selector in your render method:
  const renderLanguageSelector = () => (
    <select 
      className="p-2 border rounded-md"
      value={inputLanguage}
      onChange={(e) => setInputLanguage(e.target.value)}
    >
      {availableLanguages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );

  // Update the generate button to show loading state
  const renderGenerateButton = () => (
    <button
      onClick={handleGenerateStatement}
      disabled={isLoading}
      className="px-4 py-2 rounded-md flex items-center bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
    >
      {isLoading ? 'Translating...' : t.generateStatement}
    </button>
  );

    const translations = {
        en: {
          title: 'CNA Statement Writer',
          cnaName: 'CNA Name',
          shift: 'Shift',
          patientName: 'Patient Name',
          roomNumber: 'Room Number',
          floor: 'Floor',
          incidentDate: 'Incident Date',
          incidentTime: 'Incident Time',
          incidentType: 'Incident Type',
          incidentDescription: 'Incident Description',
          assistingPerson: 'Assisting Person',
          generateStatement: 'Generate Statement',
          next: 'Next',
          previous: 'Previous',
          step: 'Step',
          of: 'of',
          fallLocation: 'Fall Location',
          fallCause: 'Cause of Fall',
          fallInjuries: 'Injuries Sustained',
          medicalEmergencySymptoms: 'Symptoms',
          medicalEmergencyVitalSigns: 'Vital Signs',
          medicalEmergencyActionTaken: 'Action Taken'
        }
      };
    
      const t = translations[inputLanguage];

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
          // Handle nested objects (like fallDetails.location)
          const [parent, child] = name.split('.');
          setFormData(prev => ({
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: value
            }
          }));
        } else {
          // Handle top-level fields
          setFormData(prev => ({
            ...prev,
            [name]: value
          }));
        }
      };

      const renderStep1 = () => (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.cnaName}
            </label>
            <input
              type="text"
              name="cnaName"
              value={formData.cnaName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.shift}
            </label>
            <select
              name="shift"
              value={formData.shift}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select shift</option>
              <option value="day">Day</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </div>
        </div>
      );

      const renderStep2 = () => (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.patientName}
            </label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.incidentType}
            </label>
            <select
              name="incidentType"
              value={formData.incidentType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select type</option>
              <option value="fall">Fall</option>
              <option value="medicalEmergency">Medical Emergency</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      );

      const renderStep3 = () => {
        switch (formData.incidentType) {
          case 'fall':
            return (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.fallLocation}
                  </label>
                  <input
                    type="text"
                    name="fallDetails.location"
                    value={formData.fallDetails.location}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.fallCause}
                  </label>
                  <input
                    type="text"
                    name="fallDetails.cause"
                    value={formData.fallDetails.cause}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            );
          case 'medicalEmergency':
            return (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.medicalEmergencySymptoms}
                  </label>
                  <input
                    type="text"
                    name="medicalEmergencyDetails.symptoms"
                    value={formData.medicalEmergencyDetails.symptoms}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.medicalEmergencyVitalSigns}
                  </label>
                  <input
                    type="text"
                    name="medicalEmergencyDetails.vitalSigns"
                    value={formData.medicalEmergencyDetails.vitalSigns}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            );
          default:
            return null;
        }
      };

      const renderStep4 = () => (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t.incidentDescription}
            </label>
            <textarea
              name="incidentDescription"
              value={formData.incidentDescription}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              rows="4"
            />
          </div>
        </div>
      );

      const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const handlePrevious = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        <select 
          className="p-2 border rounded-md"
          value={inputLanguage}
          onChange={(e) => setInputLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
        {/* Step Indicator */}
        <div className="mb-6 text-center">
          <span className="text-sm font-medium text-gray-500">
            {t.step} {currentStep} {t.of} 4
          </span>
        </div>

        {/* Form Steps */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-md flex items-center ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.previous}
          </button>
          
          {/* Next/Generate Button */}
          <button
            onClick={currentStep === 4 ? () => console.log('Generate') : handleNext}
            className="px-4 py-2 rounded-md flex items-center bg-blue-600 text-white hover:bg-blue-700"
          >
            {currentStep === 4 ? t.generateStatement : t.next}
            {currentStep !== 4 && <ArrowRight className="ml-2 h-4 w-4" />}
          </button>
        </div>
      </main>
    </div>
  );
}