const FAQ = require('../models/FAQ');
const redisClient = require('../config/redis');
const { translateText } = require('../services/translationService');

// Function to generate a cache key based on language
const getCacheKey = (lang) => `faqs_${lang || 'en'}`;

// Function to check if text is written in English
const isEnglish = (text) => /^[A-Za-z0-9.,'"\s!?()-]+$/.test(text);

// GET: Retrieve FAQs (English by default, translated if available)
exports.getFAQs = async (req, res) => {
  const lang = req.query.lang || 'en';
  const cacheKey = getCacheKey(lang);
  // console.log(lang);
  try {
    // Check Redis cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`Returning cached FAQs for language: ${lang}`);
      return res.json(JSON.parse(cachedData));
    }

    // Retrieve FAQs from MongoDB
    let faqs = await FAQ.find({}, { _id: 1, question: 1, answer: 1, translations: 1 }).lean();

    if (lang === 'en') {
      // Return only FAQs where the original question is in English
      faqs = faqs.filter(faq => isEnglish(faq.question)).map(faq => ({
        _id: faq._id,
        question: faq.question,
        answer: faq.answer
      }));
    } else {
      // Try to return the requested language if available
      let translatedFaqs = faqs
        .map(faq => {
          const translation = faq.translations?.[lang];
          if (translation) {
            return {
              _id: faq._id,
              question: translation.question,
              answer: translation.answer
            };
          }
          return null; // Mark for filtering if translation is missing
        })
        .filter(faq => faq !== null); // Remove null values

      if (translatedFaqs.length === 0) {
        // If no translations exist, return only FAQs originally written in English
        translatedFaqs = faqs.filter(faq => isEnglish(faq.question)).map(faq => ({
          _id: faq._id,
          question: faq.question,
          answer: faq.answer
        }));
      }

      faqs = translatedFaqs;
    }

    // Cache the response for 1 hour
    await redisClient.set(cacheKey, JSON.stringify(faqs), { EX: 3600 });

    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// POST: Create a new FAQ with translations
exports.createFAQ = async (req, res) => {
  const { question, answer } = req.body;
  try {
    // Translate text in parallel for efficiency
    const [translated_hi_question, translated_hi_answer, translated_bn_question, translated_bn_answer] =
      await Promise.all([
        translateText(question, 'hi'),
        translateText(answer, 'hi'),
        translateText(question, 'bn'),
        translateText(answer, 'bn')
      ]);

    const newFAQ = new FAQ({
      question,
      answer,
      translations: {
        hi: {
          question: translated_hi_question,
          answer: translated_hi_answer,
        },
        bn: {
          question: translated_bn_question,
          answer: translated_bn_answer,
        },
      }
    });

    const savedFAQ = await newFAQ.save();

    // Invalidate caches for all languages
    const languages = ['en', 'hi', 'bn'];
    await Promise.all(languages.map(lang => redisClient.del(getCacheKey(lang))));

    res.status(201).json({
      _id: savedFAQ._id,
      question: savedFAQ.question,
      answer: savedFAQ.answer
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



