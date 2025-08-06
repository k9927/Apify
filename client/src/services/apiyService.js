import axios from 'axios';

const API_BASE_URL = '/api';

const apifyService = {
  setApiKey: (apiKey) => {
    axios.defaults.baseURL = '/api';
    axios.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
  },

  getActors: async () => {
    try {
      const response = await axios.get(`/acts`, {
        params: { limit: 100, desc: true }
      });

      if (!response.data?.data?.items) {
        console.warn('API response missing items array, returning empty list');
        return [];
      }

      return response.data.data.items.map(item => ({
        id: item.id,
        fullId: `${item.username}/${item.name}`,
        name: item.name,
        title: item.title || item.name,
        username: item.username
      }));

    } catch (error) {
      console.error('API Error Details:', {
        config: error.config,
        response: error.response?.data
      });
      throw error;
    }
  },

getActorSchema: async (actorId) => {
  try {
    const response = await axios.get(`/acts/${encodeURIComponent(actorId)}`);
    
    // Get schema from the correct field
    const inputSchema = response.data?.input || null;
    
    return {
      ...response.data,
      inputSchema: inputSchema ? {
        // Standardize schema format
        inputs: Object.entries(inputSchema).map(([name, config]) => ({
          name,
          type: config.type || 'text',
          required: config.required || false,
          description: config.help,
          defaultValue: config.default
        }))
      } : null
    };
  } catch (error) {
    console.error('Schema fetch error:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to fetch actor details');
  }
},

  executeActor: async (actorId, inputs) => {
    try {
      const encodedId = encodeURIComponent(actorId);
      const response = await axios.post(`/acts/${encodedId}/runs`, {
        inputs,
        waitForFinish: 60
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to execute actor');
    }
  }
};

export default apifyService;
