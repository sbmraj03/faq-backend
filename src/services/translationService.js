const translate = require('google-translate-open-api').default;

// Function to translate a given text to a target language
async function translateText(text, targetLang) {
  try {
    const result = await translate(text, { tld: "com", to: targetLang });
    return result.data[0];
  } catch (error) {
    console.error(`Translation error for language "${targetLang}":`, error);
    // Fallback to the original text if translation fails
    return text;
  }
}

module.exports = { translateText };
