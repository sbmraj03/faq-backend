const request = require('supertest');
const express = require('express');
const faqRoutes = require('../src/routes/faqRoutes');
const mongoose = require('mongoose');
const redisClient = require('../src/config/redis');


afterAll(async () => {
    await mongoose.connection.close();  // Close MongoDB connection
    await redisClient.quit();           // Close Redis connection
  });


const app = express();
app.use(express.json());
app.use('/api/faqs', faqRoutes);

describe('FAQ API Endpoints', () => {
  it('should return an array of FAQs for GET /api/faqs', async () => {
    const res = await request(app).get('/api/faqs');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  }, 5000); // timeout of 5 seconds
});


