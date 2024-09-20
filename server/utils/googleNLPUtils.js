// utils/googleNLPUtils.js
const axios = require('axios');
const config = require('../config');

// Function to analyze text using Google Cloud Natural Language API
async function analyzeTextWithNaturalLanguageAPI(text) {
  try {
    // Analyze entities using Natural Language API to generate title
    const response = await axios.post(
      `https://language.googleapis.com/v1/documents:analyzeEntities?key=${config.GOOGLE_API_KEY}`,
      {
        document: {
          type: 'PLAIN_TEXT',
          content: text,
        },
        encodingType: 'UTF8',
      }
    );

    const entities = response.data.entities;
    const title = entities.length > 0 ? entities[0].name : 'Untitled';

    // Classify text using Natural Language API to generate category
    const categoryResponse = await axios.post(
      `https://language.googleapis.com/v1/documents:classifyText?key=${config.GOOGLE_API_KEY}`,
      {
        document: {
          type: 'PLAIN_TEXT',
          content: text,
        },
      }
    );

    const categories = categoryResponse.data.categories;
    const category = categories.length > 0 ? categories[0].name : 'Uncategorized';

    // Generate a description by summarizing the key points
    const description = text.length > 200 ? text.slice(0, 200) + '...' : text;

    return { title, category, description };
  } catch (error) {
    console.error('Error analyzing text with Google Natural Language API:', error);
    throw error;
  }
}

module.exports = {
  analyzeTextWithNaturalLanguageAPI,
};
