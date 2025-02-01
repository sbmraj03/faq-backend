const FAQ = require('../models/FAQ');
const redisClient = require('../config/redis');
const { translateText } = require('../services/translationService');

// function to generate a cache key based on language
const getCacheKey = (lang) => `faqs_${lang || 'en'}`;

// GET: Retrieve FAQs 
exports.getFAQs = async (req, res) => {
  const lang = req.query.lang || 'en';
  const cacheKey = getCacheKey(lang);

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Returning cached FAQs');
      return res.json(JSON.parse(cachedData));
    }

    // Retrieve FAQs from MongoDB
    const faqs = await FAQ.find().lean();
    const translatedFaqs = faqs.map(faq => {
      if (lang !== 'en') {
        const translation = faq.translations && faq.translations[lang];
        return {
          ...faq,
          question: (translation && translation.question) || faq.question,
          answer: (translation && translation.answer) || faq.answer,
        };
      }
      return faq;
    });

    // Cache the result with an expiration time
    await redisClient.set(cacheKey, JSON.stringify(translatedFaqs), { EX: 3600 });
    res.json(translatedFaqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createFAQ = async (req, res) => {
  const { question, answer } = req.body;
  try {
    // Translate the question and answer into Hindi and Bengali
    const translated_hi_question = await translateText(question, 'hi');
    const translated_hi_answer = await translateText(answer, 'hi');
    const translated_bn_question = await translateText(question, 'bn');
    const translated_bn_answer = await translateText(answer, 'bn');

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

    // Invalidate caches for all supported languages
    await redisClient.del(getCacheKey('en'));
    await redisClient.del(getCacheKey('hi'));
    await redisClient.del(getCacheKey('bn'));

    res.status(201).json(savedFAQ);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
