const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }, // store HTML from a WYSIWYG editor
  // Store translations for other languages in a nested object.
  translations: {
    hi: {
      question: { type: String },
      answer: { type: String }
    },
    bn: {
      question: { type: String },
      answer: { type: String }
    }
    // We can add more languages as needed.
  },
}, { timestamps: true });

// Instance method to retrieve translated text dynamically
FAQSchema.methods.getTranslatedText = function(lang) {
  if (lang && this.translations && this.translations[lang]) {
    return {
      question: this.translations[lang].question || this.question,
      answer: this.translations[lang].answer || this.answer,
    };
  }
  // Default to English if language is not available or not specified
  return { question: this.question, answer: this.answer };
};

module.exports = mongoose.model('FAQ', FAQSchema);
