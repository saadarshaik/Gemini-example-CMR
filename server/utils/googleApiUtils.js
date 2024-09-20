const axios = require('axios');
const fs = require('fs');
const config = require('../config');

// Function to extract text using Google Vision API
async function extractTextFromImage(imagePath) {
  const image = fs.readFileSync(imagePath, 'base64');

  const requestBody = {
    requests: [
      {
        image: { content: image },
        features: [{ type: 'TEXT_DETECTION' }]
      }
    ]
  };

  try {
    const response = await axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${config.GOOGLE_API_KEY}`, requestBody);
    const extractedText = response.data.responses[0].textAnnotations[0].description;
    return extractedText;
  } catch (error) {
    console.error('Error with Google Vision OCR:', error);
    throw error;
  }
}

// Function to translate text using Google Translate API
async function translateText(text) {
  const requestBody = {
    q: text,
    target: 'en'  // Translate to English
  };

  try {
    const response = await axios.post(`https://translation.googleapis.com/language/translate/v2?key=${config.GOOGLE_API_KEY}`, requestBody);
    const translatedText = response.data.data.translations[0].translatedText;
    return translatedText;
  } catch (error) {
    console.error('Error with Google Translate API:', error);
    throw error;
  }
}

module.exports = {
  extractTextFromImage,
  translateText,
};
