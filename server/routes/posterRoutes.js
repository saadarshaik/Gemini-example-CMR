const express = require('express');
const multer = require('multer');
const { extractTextFromImage, translateText } = require('../utils/googleApiUtils');
const Poster = require('../models/Poster');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });  // Image upload destination

// POST route to upload and process poster
router.post('/', upload.single('poster'), async (req, res) => {
  try {
    // Log incoming file and description
    console.log('File received:', req.file);
    console.log('Description received:', req.body.description);

    // Ensure file was received
    if (!req.file) {
      console.error('No file received');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = req.file.path;
    
    console.log('Processing image at:', imagePath);

    // Step 1: Extract text from the image using Google Vision API
    const extractedText = await extractTextFromImage(imagePath);
    console.log('Extracted Text from Image:', extractedText);

    // Step 2: Translate extracted text to English using Google Translate API
    const translatedText = await translateText(extractedText);
    console.log('Translated Text:', translatedText);

    // Step 3: Save the poster data to MongoDB
    const newPoster = new Poster({
      imageUrl: `http://localhost:5000/uploads/${req.file.filename}`,
      title: translatedText.split('\n')[0] || 'Untitled',  // First line as title
      description: translatedText.split('\n').slice(1).join(' ') || 'No description'  // Rest as description
    });

    await newPoster.save();
    console.log('Poster saved to database:', newPoster);

    // Send success response
    res.json({ message: 'Poster uploaded successfully', data: newPoster });
  } catch (err) {
    console.error('Error processing poster:', err);
    res.status(500).json({ error: 'Failed to process poster' });
  }
});

// GET route to fetch all posters
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all posters from database...');
    const posters = await Poster.find().sort({ uploadedAt: -1 });
    res.json(posters);
  } catch (err) {
    console.error('Error fetching posters:', err);
    res.status(500).json({ error: 'Failed to fetch posters' });
  }
});

module.exports = router;
