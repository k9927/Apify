import React, { useState, useEffect } from 'react';
import apiyService from '../services/apiyService';

const ActorSelector = ({ apiKey, onActorSelect }) => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        console.log('Initiating actors fetch...'); // Debug
        apiyService.setApiKey(apiKey);
        const data = await apiyService.getActors();
        
        console.log('Received actors data:', data); // Debug
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }
        
        setActors(data);
        setError(null);
      } catch (err) {
        console.error('Full error details:', {
          error: err,
          response: err.response?.data
        });
        setError(`Error: ${err.response?.status || 'Network'} - ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (apiKey?.trim()) {
      fetchActors();
    } else {
      setError('Missing API key');
      setLoading(false);
    }
  }, [apiKey]);

  if (loading) {
    return (
      <div className="py-4 text-center">
        <div className="inline-block px-4 py-2 text-blue-600 rounded-lg bg-blue-50">
          Loading actors...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md p-4 mx-auto rounded-lg bg-red-50">
        <h3 className="font-medium text-red-700">Connection Error</h3>
        <p className="text-red-600">{error}</p>
        <div className="p-2 mt-3 bg-red-100 rounded">
          <p className="text-xs text-red-800">
            Debug info: Check browser console (F12) for details
          </p>
        </div>
        <a
          href="https://console.apify.com/account#/integrations"
          className="inline-block mt-2 text-sm text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Verify API Token
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Select an Actor</h2>
      
      {/* Debug overlay (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-2 mb-4 text-xs text-gray-600 rounded bg-yellow-50">
          <strong>Debug:</strong> Showing {actors.length} actors
        </div>
      )}

      {actors.length > 0 ? (
        <div className="space-y-2">
          {actors.map(actor => (
            <button
              key={actor.fullId}  // Using fullId as unique key
              onClick={() => {
                console.log('Selected actor:', actor); // Debug
                onActorSelect(actor.fullId);
              }}
              className="w-full p-3 text-left transition-colors border rounded-lg hover:bg-gray-50"
              aria-label={`Select ${actor.title}`}
            >
              <h3 className="font-medium">{actor.title}</h3>
              <div className="flex justify-between text-sm text-gray-500">
                <span>@{actor.username}</span>
                <span>{new Date(actor.createdAt).toLocaleDateString()}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          <p className="mb-2">No actors found in your account.</p>
          <a
            href="https://console.apify.com/actors"
            className="text-sm text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Create your first actor
          </a>
        </div>
      )}
    </div>
  );
};

export default ActorSelector;
