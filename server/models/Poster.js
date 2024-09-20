const mongoose = require('mongoose');

const PosterSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'Uncategorized' },  // Add category field
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Poster', PosterSchema);
