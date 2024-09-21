const express = require('express');
const Poster = require('../models/Poster');  // Ensure Poster model is imported

const router = express.Router();

// POST route to upload and process a poster
router.post('/', async (req, res) => {
  try {
    console.log('File received:', req.file);

    // Assuming the file was uploaded correctly and processed (you can add Multer or other middleware)
    // This part should process the image, extract text, etc.
    const newPoster = new Poster({
      imageUrl: `http://localhost:5000/uploads/${req.file.filename}`,
      title: 'Sample Title',  // You should replace this with actual logic for title
      description: 'Sample Description',  // Replace this with the actual logic for description
      category: 'Sample Category'  // Replace this with logic to generate category
    });

    await newPoster.save();  // Save the poster to MongoDB
    console.log('Poster saved to database:', newPoster);

    // Return success response
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
    res.status(200).json(posters);  // Send posters in JSON format
  } catch (err) {
    console.error('Error fetching posters:', err);
    res.status(500).json({ error: 'Failed to fetch posters' });
  }
});

module.exports = router;
