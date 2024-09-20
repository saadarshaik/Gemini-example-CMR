const express = require('express');
const mongoose = require('mongoose');
const posterRoutes = require('./routes/posterRoutes');
const config = require('./config');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/posters', posterRoutes);

// Serve uploaded images statically
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
