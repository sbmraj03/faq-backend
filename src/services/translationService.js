const { Translate } = require('@google-cloud/translate').v2;
const path = require('path');

// Path to your Google Cloud service account JSON key file
const CREDENTIALS_PATH = path.join(__dirname, '../../google-credentials.json'); 
// Initialize Google Cloud Translation API client
const translate = new Translate({
  keyFilename: CREDENTIALS_PATH,
});

// Function to translate text
async function translateText(text, targetLang) {
  try {
    const [translatedText] = await translate.translate(text, targetLang);
    return translatedText;
  } catch (error) {
    console.error(`Translation error for language "${targetLang}":`, error.message);
    return text; // Fallback to original text if translation fails
  }
}

module.exports = { translateText };
