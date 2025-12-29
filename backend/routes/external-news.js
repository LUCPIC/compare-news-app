const express = require('express');
const router = express.Router();

const NEWS_API_ENDPOINT = 'https://newsapi.org/v2/top-headlines';

router.get('/', async (req, res) => {
  const apiKey = process.env.NEWS_API_KEY;
  const category = req.query.category || 'general'; // Default to 'general'

  if (!apiKey) {
    return res.status(500).json({ message: 'News API key is not configured on the server.' });
  }

  try {
    // Note: You can't mix `sources` with the `category` and `country` parameters.
    const url = `${NEWS_API_ENDPOINT}?country=us&category=${category}&apiKey=${apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      // Forward the error from the News API
      const errorData = await response.json();
      console.error('Error from News API:', errorData);
      return res.status(response.status).json(errorData);
    }
    
    const data = await response.json();
    res.json(data.articles);
  } catch (error) {
    console.error('Failed to fetch from external source:', error);
    res.status(500).json({ message: 'Failed to fetch news from external source.', error: error.message });
  }
});

module.exports = router;
