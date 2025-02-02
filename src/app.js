require('dotenv').config();
const express = require('express');
/* eslint-disable no-unused-vars */
const mongoose = require('./config/db'); // Connect to MongoDB
const redisClient = require('./config/redis'); // Connect to Redis
/* eslint-enable no-unused-vars */
const morgan = require('morgan');
const cors = require('cors');
const faqRoutes = require('./routes/faqRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// API Routes
app.use('/api/faqs', faqRoutes);
// Serve static files for the admin panel
app.use('/admin', express.static(path.join('admin')));


// Serve admin.html as the default file for /admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'admin.html'));
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('FAQ Backend Service is Running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
