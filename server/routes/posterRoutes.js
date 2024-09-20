const express = require('express');
const multer = require('multer');
const { extractTextFromImage, translateText } = require('../utils/geminiUtils');
const Poster = require('../models/Poster');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });  // Store images in 'uploads/' directory

// POST route for uploading a poster
router.post('/', upload.single('poster'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const description = req.body.description;

    // Use Gemini API to extract text and translate it
    const extractedText = await extractTextFromImage(imagePath);
    const translation = await translateText(extractedText);

    // Save the poster details in MongoDB
    const newPoster = new Poster({
      imageUrl: `http://localhost:5000/uploads/${req.file.filename}`,
      title: extractedText.split('\n')[0],  // Assume the first line is the title
      description,
      translation,
    });

    await newPoster.save();
    res.json(newPoster);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload and process poster' });
  }
});

// GET route to fetch all posters
router.get('/', async (req, res) => {
  try {
    const posters = await Poster.find().sort({ uploadedAt: -1 });
    res.json(posters);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posters' });
  }
});

module.exports = router;
