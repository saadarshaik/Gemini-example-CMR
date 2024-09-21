const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Import cors middleware
const posterRoutes = require('./routes/posterRoutes');
const config = require('./config');

const app = express();

// Use CORS middleware to allow requests from frontend (e.g., http://localhost:3000)
app.use(cors());

// Enable JSON parsing in request body
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use poster routes
app.use('/api/posters', posterRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
