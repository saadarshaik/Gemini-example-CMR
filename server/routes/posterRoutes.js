const express = require('express');
const multer = require('multer');
const { extractTextFromImage, translateText } = require('../utils/googleApiUtils');
const { analyzeTextWithNaturalLanguageAPI } = require('../utils/googleNLPUtils');
const Poster = require('../models/Poster');

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });  // Destination folder for uploaded files

const router = express.Router();

// POST route to upload and process a poster
router.post('/', upload.single('poster'), async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File received:', req.file);

    // Step 1: Extract text from the image using Google Vision API
    const extractedText = await extractTextFromImage(req.file.path);
    console.log('Extracted Text from Image:', extractedText);

    // Step 2: Translate the extracted text (if needed)
    const translatedText = await translateText(extractedText);
    console.log('Translated Text:', translatedText);

    // Step 3: Use Google Natural Language API to generate title, category, and description
    const { title, category, description } = await analyzeTextWithNaturalLanguageAPI(translatedText);
    console.log('Generated Title:', title);
    console.log('Generated Category:', category);
    console.log('Generated Description:', description);

    // Create a new poster with the generated title, description, and category
    const newPoster = new Poster({
      imageUrl: `http://localhost:5000/uploads/${req.file.filename}`,  // Use the uploaded file's filename
      title: title,  // Generated title
      description: description,  // Generated description
      category: category,  // Generated category
    });

    // Save the poster to the database
    await newPoster.save();
    console.log('Poster saved to database:', newPoster);

    // Return success response with the poster data
    res.status(200).json({ message: 'Poster uploaded successfully', data: newPoster });
  } catch (err) {
    console.error('Error processing poster:', err);
    res.status(500).json({ error: 'Failed to process poster' });
  }
});

// GET route to fetch all posters
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all posters...');
    const posters = await Poster.find();  // Fetch all posters from MongoDB
    res.status(200).json(posters);  // Send posters as JSON response
  } catch (err) {
    console.error('Error fetching posters:', err);
    res.status(500).json({ error: 'Failed to fetch posters' });
  }
});

module.exports = router;
