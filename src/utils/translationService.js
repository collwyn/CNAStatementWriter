const LIBRE_TRANSLATE_API = "https://libretranslate.com/translate";

export const translateText = async (text, sourceLang, targetLang) => {
  try {
    const response = await fetch(LIBRE_TRANSLATE_API, {
      method: "POST",
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang
      }),
      headers: { "Content-Type": "application/json" }
    });
    
    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Return original text if translation fails
  }
};

// Function to translate form data to English
export const translateFormToEnglish = async (formData, sourceLang) => {
  if (sourceLang === 'en') return formData; // No translation needed

  let translatedData = { ...formData };
  
  // Translate main fields
  for (const key of ['incidentDescription', 'assistingPerson']) {
    if (formData[key]) {
      translatedData[key] = await translateText(formData[key], sourceLang, 'en');
    }
  }
  
  // Translate nested fields based on incident type
  if (formData.incidentType === 'fall') {
    for (const key of ['location', 'cause', 'injuries']) {
      if (formData.fallDetails[key]) {
        translatedData.fallDetails[key] = await translateText(
          formData.fallDetails[key], 
          sourceLang, 
          'en'
        );
      }
    }
  } else if (formData.incidentType === 'medicalEmergency') {
    for (const key of ['symptoms', 'vitalSigns', 'actionTaken']) {
      if (formData.medicalEmergencyDetails[key]) {
        translatedData.medicalEmergencyDetails[key] = await translateText(
          formData.medicalEmergencyDetails[key], 
          sourceLang, 
          'en'
        );
      }
    }
  }
  
  return translatedData;
};

// Function to get available languages
export const getAvailableLanguages = async () => {
  try {
    const response = await fetch("https://libretranslate.com/languages");
    const languages = await response.json();
    return languages.map(lang => ({
      code: lang.code,
      name: lang.name
    }));
  } catch (error) {
    console.error("Error fetching languages:", error);
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'ht', name: 'Haitian Creole' }
    ];
  }
};