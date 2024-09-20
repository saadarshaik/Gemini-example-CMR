const axios = require('axios');
const config = require('../config');

// Function to extract text using Gemini OCR
async function extractTextFromImage(imagePath) {
  try {
    const response = await axios.post(config.GEMINI_OCR_API, {
      image: imagePath,  // Gemini OCR API request format
    });
    return response.data.text;
  } catch (err) {
    throw new Error('Error extracting text from image');
  }
}

// Function to translate text using Gemini Translation
async function translateText(text) {
  try {
    const response = await axios.post(config.GEMINI_TRANSLATION_API, {
      text,
      targetLanguage: 'en',  // Target translation to English
    });
    return response.data.translation;
  } catch (err) {
    throw new Error('Error translating text');
  }
}

module.exports = {
  extractTextFromImage,
  translateText,
};
