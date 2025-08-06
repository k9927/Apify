import React, { useState, useEffect } from 'react';
import apiyService from '../services/apiyService';

const ActorForm = ({ actorId, apiKey, onExecute }) => {
  const [actorDetails, setActorDetails] = useState(null);
  const [inputs, setInputs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchSchema = async () => {
      if (!actorId || !apiKey) return;
      
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching schema for ${actorId}`);
        
        apiyService.setApiKey(apiKey);
        const data = await apiyService.getActorSchema(actorId);
        
        console.log('Received actor details:', data);
        
        // Transform Apify's input format to our expected structure
        const transformedInputs = data.inputSchema?.inputs?.map(input => ({
          name: input.name,
          type: input.type || 'text',
          label: input.label || input.name,
          required: input.required || false,
          description: input.description || input.help,
          defaultValue: input.defaultValue || input.default || ''
        })) || [];
        
        setActorDetails(data);
        setInputs(transformedInputs);
        
        // Initialize form data
        const initialData = {};
        transformedInputs.forEach(input => {
          initialData[input.name] = input.defaultValue;
        });
        setFormData(initialData);
        
      } catch (err) {
        console.error('Fetch error:', {
          actorId,
          error: err.response?.data || err.message
        });
        setError(err.response?.data?.message || 
          `Failed to load actor configuration: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSchema();
  }, [actorId, apiKey]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting:', { actorId, formData });
    onExecute(actorId, formData);
  };

  if (loading) {
    return (
      <div className="py-4 text-center">
        <div className="inline-block px-4 py-2 text-blue-600 rounded-lg bg-blue-50">
          Loading actor configuration...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md p-4 mx-auto mb-4 rounded-lg bg-red-50">
        <h3 className="font-medium text-red-700">Configuration Error</h3>
        <p className="text-red-600">{error}</p>
        <details className="mt-2 text-xs">
          <summary className="cursor-pointer">Debug info</summary>
          <div className="p-2 mt-1 bg-gray-100 rounded">
            <p><strong>Actor ID:</strong> {actorId}</p>
            <p><strong>API Key:</strong> {apiKey ? '••••' + apiKey.slice(-4) : 'Not set'}</p>
          </div>
        </details>
      </div>
    );
  }

  if (!actorDetails) {
    return null;
  }

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {actorDetails.name || 'Untitled Actor'}
        </h2>
        {actorDetails.username && (
          <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded">
            @{actorDetails.username}
          </span>
        )}
      </div>

      {inputs.length > 0 ? (
        <form onSubmit={handleSubmit}>
          {inputs.map(input => (
            <div key={input.name} className="mb-4">
              <label htmlFor={input.name} className="block mb-1 text-sm font-medium text-gray-700">
                {input.label}
                {input.required && <span className="ml-1 text-red-500">*</span>}
              </label>
              
              {input.type === 'textarea' ? (
                <textarea
                  id={input.name}
                  name={input.name}
                  value={formData[input.name] || ''}
                  onChange={handleChange}
                  required={input.required}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  aria-describedby={`${input.name}-help`}
                />
              ) : (
                <input
                  type={input.type}
                  id={input.name}
                  name={input.name}
                  value={formData[input.name] || ''}
                  onChange={handleChange}
                  required={input.required}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-describedby={`${input.name}-help`}
                />
              )}

              {input.description && (
                <p id={`${input.name}-help`} className="mt-1 text-xs text-gray-500">
                  {input.description}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Execute Actor'}
          </button>
        </form>
      ) : (
        <div className="p-4 text-center text-gray-500 rounded-lg bg-gray-50">
          <p>This actor doesn't require any input parameters.</p>
          <button
            onClick={() => onExecute(actorId, {})}
            className="px-4 py-2 mt-3 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Run Without Parameters
          </button>
        </div>
      )}
    </div>
  );
};

export default ActorForm;