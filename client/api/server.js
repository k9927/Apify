const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Debug middleware to log Authorization header
app.use((req, res, next) => {
  console.log('Incoming Authorization header:', req.headers.authorization);
  next();
});

const API_BASE_URL = 'https://api.apify.com/v2';

// Proxy endpoint to get actors list
app.get('/api/acts', async (req, res) => {
  try {
    let apiKey = req.headers.authorization;
    if (!apiKey) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }
    // Remove 'Bearer ' prefix if present
    if (apiKey.toLowerCase().startsWith('bearer ')) {
      apiKey = apiKey.slice(7);
    }
    // Forward the token with 'Bearer ' prefix to test
    console.log('Forwarding headers to Apify:', { Authorization: `Bearer ${apiKey}` });
    const response = await axios.get(`${API_BASE_URL}/acts`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      params: req.query,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error in /api/acts:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Proxy endpoint to get actor schema
app.get('/api/acts/:actorId(*)', async (req, res) => {
  try {
    let apiKey = req.headers.authorization;
    if (!apiKey) return res.status(401).json({ error: 'Unauthorized' });
    if (apiKey.toLowerCase().startsWith('bearer ')) {
      apiKey = apiKey.slice(7);
    }
    const actorId = decodeURIComponent(req.params.actorId);
    // Forward the token with 'Bearer ' prefix to test
    console.log('Forwarding headers to Apify:', { Authorization: `Bearer ${apiKey}` });
    const encodedActorId = encodeURIComponent(actorId);
    const response = await axios.get(`${API_BASE_URL}/acts/${encodedActorId}`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error in /api/acts/:actorId:', error.stack || error.message || error);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.message || 'Failed to fetch actor'
    });
  }
});

// Proxy endpoint to execute actor
app.post('/api/acts/:actorId/runs', async (req, res) => {
  try {
    let apiKey = req.headers.authorization;
    if (!apiKey) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }
    if (apiKey.toLowerCase().startsWith('bearer ')) {
      apiKey = apiKey.slice(7);
    }
    const actorId = decodeURIComponent(req.params.actorId);
    // Forward the token with 'Bearer ' prefix to test
    console.log('Forwarding headers to Apify:', { Authorization: `Bearer ${apiKey}` });
    const encodedActorId = encodeURIComponent(actorId);
    const response = await axios.post(`${API_BASE_URL}/acts/${encodedActorId}/runs`, req.body, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error in /api/acts/:actorId/runs:', error.stack || error.message || error);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Export for Vercel
module.exports = app;
