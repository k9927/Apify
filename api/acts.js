const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const API_BASE_URL = 'https://api.apify.com/v2';

// Get actors list
app.get('/acts', async (req, res) => {
  try {
    const apiKey = req.headers.authorization;
    if (!apiKey) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }
    
    const response = await axios.get(`${API_BASE_URL}/acts`, {
      headers: { Authorization: apiKey },
      params: req.query,
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ 
      error: error.message 
    });
  }
});

// Get actor schema
app.get('/acts/:actorId', async (req, res) => {
  try {
    const apiKey = req.headers.authorization;
    if (!apiKey) return res.status(401).json({ error: 'Unauthorized' });
    
    const response = await axios.get(
      `${API_BASE_URL}/acts/${req.params.actorId}`, 
      { headers: { Authorization: apiKey } }
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.message || 'Failed to fetch actor'
    });
  }
});

// Execute actor
app.post('/acts/:actorId/runs', async (req, res) => {
  try {
    const apiKey = req.headers.authorization;
    if (!apiKey) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }
    
    const { actorId } = req.params;
    const response = await axios.post(
      `${API_BASE_URL}/acts/${actorId}/runs`, 
      req.body,
      { headers: { Authorization: apiKey } }
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ 
      error: error.message 
    });
  }
});

module.exports = app;
