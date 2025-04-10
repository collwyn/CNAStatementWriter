import React, { useState } from 'react';
import { ChevronDown, Globe, Languages, ArrowLeft, ArrowRight } from 'lucide-react';

export default function CNAStatementApp() {
  const [inputLanguage, setInputLanguage] = useState('en');
  const [outputLanguage, setOutputLanguage] = useState('en');
  const [currentStep, setCurrentStep] = useState(1);
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
      pricingInfo: '$1.99 per use - No data stored',
      inputLanguage: 'Input Language',
      outputLanguage: 'Output Language',
      fallLocation: 'Fall Location',
      fallCause: 'Cause of Fall',
      fallInjuries: 'Injuries Sustained',
      medicalEmergencySymptoms: 'Observed Symptoms',
      medicalEmergencyVitalSigns: 'Vital Signs',
      medicalEmergencyActionTaken: 'Action Taken',
      next: 'Next',
      previous: 'Previous',
      step: 'Step',
      of: 'of',
    },
    es: {
      // ... (Spanish translations would go here)
    }
  };

  const t = translations[inputLanguage];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const renderStep1 = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t.cnaName}</label>
        <input
          type="text"
          name="cnaName"
          value={formData.cnaName}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      {/* ... (other fields for step 1) ... */}
    </>
  );

  const renderStep2 = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t.incidentType}</label>
        <div className="mt-1 relative">
          <select
            name="incidentType"
            value={formData.incidentType}
            onChange={handleInputChange}
            className="block appearance-none w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2"
          >
            <option value="">{inputLanguage === 'en' ? 'Select incident type' : 'Seleccionar tipo de incidente'}</option>
            <option value="fall">{inputLanguage === 'en' ? 'Fall' : 'Caída'}</option>
            <option value="medicalEmergency">{inputLanguage === 'en' ? 'Medical Emergency' : 'Emergencia Médica'}</option>
            <option value="other">{inputLanguage === 'en' ? 'Other' : 'Otro'}</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown size={20} />
          </div>
        </div>
      </div>
    </>
  );

  const renderStep3 = () => {
    switch (formData.incidentType) {
      case 'fall':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.fallLocation}</label>
              <input
                type="text"
                name="fallDetails.location"
                value={formData.fallDetails.location}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            {/* ... (other fields for fall) ... */}
          </>
        );
      case 'medicalEmergency':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.medicalEmergencySymptoms}</label>
              <input
                type="text"
                name="medicalEmergencyDetails.symptoms"
                value={formData.medicalEmergencyDetails.symptoms}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            {/* ... (other fields for medical emergency) ... */}
          </>
        );
      default:
        return null;
    }
  };

  const renderStep4 = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t.incidentDescription}</label>
        <textarea
          name="incidentDescription"
          value={formData.incidentDescription}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          rows="4"
        ></textarea>
      </div>
      {/* ... (other fields for step 4) ... */}
    </>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  const handleNext = () => {
    setCurrentStep(prevStep => Math.min(prevStep + 1, 4));
  };

  const handlePrevious = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 1));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <div className="relative">
          <select 
            className="appearance-none bg-white border border-gray-300 rounded-md pl-8 pr-4 py-2"
            value={inputLanguage}
            onChange={(e) => setInputLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
          <Globe className="absolute left-2 top-1/2 transform -translate-y-1/2" size={20} />
        </div>
      </header>
      
      <main className="flex-grow overflow-auto">
        <div className="mb-4 text-center">
          <span className="text-sm font-medium text-gray-500">
            {t.step} {currentStep} {t.of} 4
          </span>
        </div>
        <form className="space-y-4">
          {renderCurrentStep()}
        </form>
      </main>
      
      <footer className="mt-4 space-y-2">
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
              currentStep === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <ArrowLeft className="mr-2" size={16} />
            {t.previous}
          </button>
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              {t.next}
              <ArrowRight className="ml-2" size={16} />
            </button>
          ) : (
            <button 
              onClick={() => console.log('Generate statement')} 
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              {t.generateStatement}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}