const express = require('express');
const multer = require('multer');
const { extractTextFromImage, translateText } = require('../utils/googleApiUtils');
const Poster = require('../models/Poster');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });  // Image upload destination

// POST route to upload and process poster
router.post('/', upload.single('poster'), async (req, res) => {
  try {
    // Log incoming file and description (if necessary)
    console.log('File received:', req.file);

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

    // Step 3: Process title and description from the translated text
    const title = translatedText.split('.')[0].substring(0, 100) || 'Untitled';  // First sentence, max 100 characters
    const description = translatedText.split('.').slice(1).join('.').trim() || 'No description';  // Rest of the text as description

    // Save the poster data to MongoDB
    const newPoster = new Poster({
      imageUrl: `http://localhost:5000/uploads/${req.file.filename}`,
      title: title,
      description: description,
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

module.exports = router;
