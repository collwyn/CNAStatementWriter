import React, { useState, useEffect } from "react";
import { generateStatement } from "./StatementGenerator";
import FormField from "./FormField";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import {
  ChevronDown,
  Globe,
  ArrowLeft,
  ArrowRight,
  Loader,
} from "lucide-react";
import {
  getAvailableLanguages,
  translateText,
} from "../utils/translationService";

interface Language {
  code: string;
  name: string;
}

interface Translation {
  title: string;
  cnaName: string;
  shift: string;
  patientName: string;
  roomNumber: string;
  floor: string;
  incidentDate: string;
  incidentTime: string;
  incidentDescription: string;
  generateStatement: string;
  next: string;
  previous: string;
  step: string;
  of: string;
  fallLocation: string;
  fallCause: string;
  fallInjuries: string;
  selectShift: string;
  dayShift: string;
  eveningShift: string;
  nightShift: string;
  patientStatement: string;
  patientStatementPlaceholder: string;
  patientInjuries: string;
}

interface Translations {
  en: Translation;
  es: Translation;
  ht: Translation;
}

interface FormData {
  cnaName: string;
  shift: string;
  patientName: string;
  roomNumber: string;
  floor: string;
  incidentDate: string;
  incidentTime: string;
  incidentType: string;
  incidentDescription: string;
  patientInjuries: string; // Add this new field
  patientStatement?: string; // Optional field for patient's description
  fallDetails: {
    location: string;
    cause: string;
    injuries: string;
  };
}

interface FormErrors {
  [key: string]: string;
  translation?: string;
}

interface StatementGeneratorProps {
  formData: FormData;
}

interface TranslationService {
  getAvailableLanguages: () => Promise<Language[]>;
  translateText: (
    text: string,
    fromLang: string,
    toLang: string
  ) => Promise<string>;
}

const defaultTranslations: Translations = {
  en: {
    title: "CNA Statement Writer",
    cnaName: "CNA Name",
    shift: "Shift",
    patientName: "Patient Name",
    roomNumber: "Room Number",
    floor: "Floor",
    incidentDate: "Incident Date",
    incidentTime: "Incident Time",
    incidentDescription: "Incident Description",
    generateStatement: "Generate Statement",
    next: "Next",
    previous: "Previous",
    step: "Step",
    of: "of",
    fallLocation: "Fall Location",
    fallCause: "Cause of Fall",
    fallInjuries: "Injuries Sustained",
    selectShift: "Select shift",
    dayShift: "Day",
    eveningShift: "Evening",
    nightShift: "Night",
    patientInjuries: "Observed Patient Injuries",
    patientStatement: "Patient's Statement",
    patientStatementPlaceholder: "Did the patient state how the fall happened? If yes, enter their statement here. If no, leave blank."
  },
  es: {
    title: "Escritor de Declaración CNA",
    cnaName: "Nombre del CNA",
    shift: "Turno",
    patientName: "Nombre del Paciente",
    roomNumber: "Número de Habitación",
    floor: "Piso",
    incidentDate: "Fecha del Incidente",
    incidentTime: "Hora del Incidente",
    incidentDescription: "Descripción del Incidente",
    generateStatement: "Generar Declaración",
    next: "Siguiente",
    previous: "Anterior",
    step: "Paso",
    of: "de",
    fallLocation: "Lugar de la Caída",
    fallCause: "Causa de la Caída",
    fallInjuries: "Lesiones Sufridas",
    selectShift: "Seleccionar turno",
    dayShift: "Día",
    eveningShift: "Tarde",
    nightShift: "Noche",
    patientInjuries: "Lesiones Observadas del Paciente",
    patientStatement: "Declaración del Paciente",
    patientStatementPlaceholder: "¿El paciente declaró cómo ocurrió la caída? Si es así, ingrese su declaración aquí. Si no, déjelo en blanco."
  },
  ht: {
    title: "Redaktè Deklarasyon CNA",
    cnaName: "Non CNA",
    shift: "Peryòd Travay",
    patientName: "Non Pasyan",
    roomNumber: "Nimewo Chanm",
    floor: "Etaj",
    incidentDate: "Dat Ensidan",
    incidentTime: "Lè Ensidan",
    incidentDescription: "Deskripsyon Ensidan",
    generateStatement: "Jenere Deklarasyon",
    next: "Pwochen",
    previous: "Anvan",
    step: "Etap",
    of: "nan",
    fallLocation: "Kote Chit la",
    fallCause: "Kòz Chit la",
    fallInjuries: "Blesi yo",
    selectShift: "Chwazi peryòd",
    dayShift: "Jounen",
    eveningShift: "Aswè",
    nightShift: "Nwit",
    patientInjuries: "Blesi ki Obsève sou Pasyan an",
    patientStatement: "Deklarasyon Pasyan an",
    patientStatementPlaceholder: "Èske pasyan an di kijan li te tonbe? Si wi, antre deklarasyon yo isit la. Si non, kite li vid."
  },
};

function CNAStatementApp() {
  const [inputLanguage, setInputLanguage] = useState<keyof Translations>("en");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "ht", name: "Kreyòl Ayisyen" },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [finalStatement, setFinalStatement] = useState<null | FormData>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    cnaName: "",
    shift: "",
    patientName: "",
    roomNumber: "",
    floor: "",
    incidentDate: "",
    incidentTime: "",
    incidentType: "fall", // Default to fall since it's the only option
    incidentDescription: "",
    patientInjuries: "", // Add this new field
    patientStatement: "", // Add this
    fallDetails: {
      location: "",
      cause: "",
      injuries: "",
    },
  });
  const [translations, setTranslations] =
    useState<Translations>(defaultTranslations);
  const t = translations[inputLanguage] || translations.en;

  // Validation functions for each step
  const validateStep1 = () => {
    const stepErrors: FormErrors = {};
    if (!formData.cnaName?.trim()) {
      stepErrors.cnaName = "CNA Name is required";
    }
    if (!formData.shift?.trim()) {
      stepErrors.shift = "Shift is required";
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = () => {
    const stepErrors: FormErrors = {};
    if (!formData.patientName?.trim()) {
      stepErrors.patientName = "Patient Name is required";
    }
    if (!formData.roomNumber?.trim()) {
      stepErrors.roomNumber = "Room Number is required";
    }
    if (!formData.floor?.trim()) {
      stepErrors.floor = "Floor is required";
    }
    if (!formData.incidentDate) {
      stepErrors.incidentDate = "Incident Date is required";
    }
    if (!formData.incidentTime) {
      stepErrors.incidentTime = "Incident Time is required";
    }
    if (!formData.patientInjuries?.trim()) {
      stepErrors.patientInjuries = "Patient injuries information is required";
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep3 = () => {
    const stepErrors: FormErrors = {};
    if (!formData.fallDetails?.location?.trim()) {
      stepErrors["fallDetails.location"] = "Fall Location is required";
    }
    if (!formData.fallDetails?.cause?.trim()) {
      stepErrors["fallDetails.cause"] = "Cause of Fall is required";
    }
    if (!formData.fallDetails?.injuries?.trim()) {
      stepErrors["fallDetails.injuries"] = "Injuries information is required";
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep4 = () => {
    const stepErrors: FormErrors = {};
    if (!formData.incidentDescription?.trim()) {
      stepErrors.incidentDescription = "Incident Description is required";
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const apiLanguages = await getAvailableLanguages();
        const requiredLanguages = [
          { code: "en", name: "English" },
          { code: "es", name: "Español" },
          { code: "ht", name: "Kreyòl Ayisyen" },
        ];

        const existingLanguageCodes = new Set(
          apiLanguages.map((lang) => lang.code)
        );

        const mergedLanguages = [...apiLanguages];
        requiredLanguages.forEach((lang) => {
          if (!existingLanguageCodes.has(lang.code)) {
            mergedLanguages.push(lang);
          }
        });

        setAvailableLanguages(mergedLanguages);
      } catch (error) {
        console.error("Error fetching languages:", error);
        setAvailableLanguages([
          { code: "en", name: "English" },
          { code: "es", name: "Español" },
          { code: "ht", name: "Kreyòl Ayisyen" },
        ]);
      }
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    console.log("Current language:", inputLanguage);
    console.log("Current translations:", translations);
  }, [inputLanguage, translations]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as keyof Translations;
    setInputLanguage(newLanguage);
    if (defaultTranslations[newLanguage]) {
      setTranslations((prevTranslations) => ({
        ...prevTranslations,
        [newLanguage]: defaultTranslations[newLanguage],
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev: FormData) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof FormData],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev: FormData) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleGenerateStatement = async () => {
    if (!validateStep4()) {
      console.log("Step 4 validation failed");
      return;
    }
  
    setIsLoading(true);
    try {
      console.log("Generating statement with data:", formData);
      if (inputLanguage !== "en") {
        const translatedData = {
          ...formData,
          incidentDescription: await translateText(
            formData.incidentDescription,
            inputLanguage,
            "en"
          ),
          patientInjuries: await translateText(
            formData.patientInjuries,
            inputLanguage,
            "en"
          ),
          patientStatement: formData.patientStatement ? await translateText(
            formData.patientStatement,
            inputLanguage,
            "en"
          ) : "",
          fallDetails: {
            location: await translateText(
              formData.fallDetails.location,
              inputLanguage,
              "en"
            ),
            cause: await translateText(
              formData.fallDetails.cause,
              inputLanguage,
              "en"
            ),
            injuries: await translateText(
              formData.fallDetails.injuries,
              inputLanguage,
              "en"
            ),
          },
        };
        console.log("Translated data:", translatedData);
        setFinalStatement(translatedData);
      } else {
        console.log("Setting final statement with original data");
        setFinalStatement(formData);
      }
    } catch (error) {
      console.error("Translation error:", error);
      setErrors({
        translation: "Error translating statement. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <FormField label={t.cnaName} name="cnaName" error={errors.cnaName}>
        <input
          type="text"
          name="cnaName"
          value={formData.cnaName || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
        />
      </FormField>
      <FormField label={t.shift} name="shift" error={errors.shift}>
        <select
          name="shift"
          value={formData.shift || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="">{t.selectShift}</option>
          <option value="day">{t.dayShift}</option>
          <option value="evening">{t.eveningShift}</option>
          <option value="night">{t.nightShift}</option>
        </select>
      </FormField>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <FormField
        label={t.patientName}
        name="patientName"
        error={errors.patientName}
      >
        <input
          type="text"
          name="patientName"
          value={formData.patientName || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
        />
      </FormField>
      <FormField
        label={t.roomNumber}
        name="roomNumber"
        error={errors.roomNumber}
      >
        <input
          type="text"
          name="roomNumber"
          value={formData.roomNumber || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
        />
      </FormField>
      <FormField label={t.floor} name="floor" error={errors.floor}>
        <input
          type="text"
          name="floor"
          value={formData.floor || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
        />
      </FormField>
      <FormField
        label={t.incidentDate}
        name="incidentDate"
        error={errors.incidentDate}
      >
        <input
          type="date"
          name="incidentDate"
          value={formData.incidentDate || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
        />
      </FormField>
      <FormField
        label={t.incidentTime}
        name="incidentTime"
        error={errors.incidentTime}
      >
        <input
          type="time"
          name="incidentTime"
          value={formData.incidentTime || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
        />
      </FormField>
      {/* New Patient Injuries Field */}
      <FormField
        label={t.patientInjuries}
        name="patientInjuries"
        error={errors.patientInjuries}
      >
        <textarea
          name="patientInjuries"
          value={formData.patientInjuries || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
          rows={3}
          placeholder="Describe any visible injuries or complaints of pain"
        />
      </FormField>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <FormField
        label={t.fallLocation}
        name="fallDetails.location"
        error={errors["fallDetails.location"]}
      >
        <input
          type="text"
          name="fallDetails.location"
          value={formData.fallDetails?.location || ""}
          onChange={handleInputChange}
          placeholder="e.g., on the floor next to the bed"
          className="w-full p-2 border rounded-md"
        />
      </FormField>
      <FormField
        label={t.fallCause}
        name="fallDetails.cause"
        error={errors["fallDetails.cause"]}
      >
        <input
          type="text"
          name="fallDetails.cause"
          value={formData.fallDetails?.cause || ""}
          onChange={handleInputChange}
          placeholder="e.g., patient stated they were trying to reach the bathroom"
          className="w-full p-2 border rounded-md"
        />
      </FormField>
      <FormField
        label={t.fallInjuries}
        name="fallDetails.injuries"
        error={errors["fallDetails.injuries"]}
      >
        <input
          type="text"
          name="fallDetails.injuries"
          value={formData.fallDetails?.injuries || ""}
          onChange={handleInputChange}
          placeholder="e.g., no visible injuries noted"
          className="w-full p-2 border rounded-md"
        />
      </FormField>
      {/* New Patient Statement Field */}
      <FormField
        label={t.patientStatement}
        name="patientStatement"
        error={errors.patientStatement}
      >
        <textarea
          name="patientStatement"
          value={formData.patientStatement || ""}
          onChange={handleInputChange}
          placeholder={t.patientStatementPlaceholder}
          className="w-full p-2 border rounded-md"
          rows={3}
        />
      </FormField>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <FormField
        label={t.incidentDescription}
        name="incidentDescription"
        error={errors.incidentDescription}
      >
        <textarea
          name="incidentDescription"
          value={formData.incidentDescription || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
          rows={4}
          placeholder="Provide any additional details about the incident"
        />
      </FormField>
    </div>
  );

  const renderFinalStatement = () => {
    console.log("Rendering final statement:", finalStatement);
    if (!finalStatement) {
      console.log("No final statement available");
      return null;
    }
  
    const generatedStatement = generateStatement(finalStatement);
    console.log("Generated statement:", generatedStatement);
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Generated Statement</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {generatedStatement}
            </p>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setFinalStatement(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderActionButton = () => (
    <button
      onClick={currentStep === 4 ? handleGenerateStatement : handleNext}
      disabled={isLoading}
      className="px-4 py-2 rounded-md flex items-center bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
    >
      {isLoading && <Loader className="animate-spin mr-2 h-4 w-4" />}
      {currentStep === 4
        ? isLoading
          ? "Translating..."
          : t.generateStatement
        : t.next}
      {!isLoading && currentStep !== 4 && (
        <ArrowRight className="ml-2 h-4 w-4" />
      )}
    </button>
  );

  const handleNext = () => {
    let isValid = false;
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      setErrors({}); // Clear errors when moving to next step
    }
  };

  const handlePrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {console.log("Rendering component, finalStatement:", finalStatement)}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        <select
          className="p-2 border rounded-md"
          value={inputLanguage}
          onChange={handleLanguageChange}
        >
          {availableLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </header>

      <main className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-6 text-center">
          <span className="text-sm font-medium text-gray-500">
            {t.step} {currentStep} {t.of} 4
          </span>
        </div>

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-md flex items-center ${
              currentStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
            }`}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.previous}
          </button>

          {renderActionButton()}
        </div>

        {errors.translation && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{errors.translation}</AlertDescription>
          </Alert>
        )}
      </main>
      {finalStatement && renderFinalStatement()}
    </div>
  );
}

export default CNAStatementApp;
