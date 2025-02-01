const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');

// Route to get all FAQs (supports ?lang= query parameter)
router.get('/', faqController.getFAQs);

// Route to create a new FAQ
router.post('/', faqController.createFAQ);

// Future routes for updating or deleting FAQs can be added here

module.exports = router;
