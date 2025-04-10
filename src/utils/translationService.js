// src/utils/translationService.js
// Use an environment variable or fallback to a placeholder during development
const LIBRE_TRANSLATE_API = process.env.REACT_APP_TRANSLATE_API_URL || "https://example-translate-api.com/translate";

export const translateText = async (text, sourceLang, targetLang) => {
  try {
    // For testing without the actual API, return the original text
    if (LIBRE_TRANSLATE_API === "https://example-translate-api.com/translate") {
      console.log("Using placeholder translation service - returning original text");
      return text; // Return original text for testing
    }
    
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
    return data.translatedText || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Return original text if translation fails
  }
};

// Function to get available languages
export const getAvailableLanguages = async () => {
  try {
    // For testing without the API
    if (LIBRE_TRANSLATE_API === "https://example-translate-api.com/translate") {
      console.log("Using placeholder language service");
      return [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'ht', name: 'Haitian Creole' }
      ];
    }
    
    const response = await fetch(LIBRE_TRANSLATE_API.replace("/translate", "/languages"));
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