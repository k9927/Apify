import React, { useState } from 'react';
import ApiKeyInput from './components/ApiKeyInput';
import ActorSelector from './components/ActorSelector';
import ActorForm from './components/ActorForm';
import ResultDisplay from './components/ResultDisplay';
import ErrorAlert from './components/ErrorAlert';
import apiyService from './services/apiyService';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [selectedActor, setSelectedActor] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAuthenticate = (key) => {
    setApiKey(key);
    setSelectedActor(null);
    setExecutionResult(null);
    setError(null);
    apiyService.setApiKey(key);
  };

  const handleActorSelect = (actorId) => {
    setSelectedActor(actorId);
    setExecutionResult(null);
    setError(null);
  };

  const handleExecute = (actorId, inputs) => {
    setExecutionResult(null);
    setError(null);
    
    apiyService.executeActor(actorId, inputs)
      .then(result => {
        setExecutionResult(result);
      })
      .catch(err => {
        setError(err.message);
      });
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen py-8 bg-gray-100">
      <div className="container px-4 mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-center">Apiy Integration Demo</h1>
        
        <div className="space-y-6">
          {!apiKey ? (
            <ApiKeyInput onAuthenticate={handleAuthenticate} />
          ) : !selectedActor ? (
            <ActorSelector apiKey={apiKey} onActorSelect={handleActorSelect} />
          ) : (
            <>
              <button
                onClick={() => setSelectedActor(null)}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to actor selection
              </button>
              <ActorForm actorId={selectedActor} apiKey={apiKey} onExecute={handleExecute} />
              <ResultDisplay result={executionResult} error={error} />
            </>
          )}
        </div>
      </div>
      
      <ErrorAlert message={error} onClose={clearError} />
    </div>
  );
}

export default App;