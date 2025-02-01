require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db'); // Connect to MongoDB
const redisClient = require('./config/redis'); // Connect to Redis
const morgan = require('morgan');
const cors = require('cors');
const faqRoutes = require('./routes/faqRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// API Routes
app.use('/api/faqs', faqRoutes);

// Serve static files for the admin panel
app.use('/admin', express.static(__dirname + '/admin'));

// Root endpoint
app.get('/', (req, res) => {
  res.send('FAQ Backend Service is Running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
