import React, { useState } from 'react';

const ApiKeyInput = ({ onAuthenticate }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuthenticate(apiKey);
  };

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Enter Your Apiy API Key</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="apiKey" className="block mb-1 text-sm font-medium text-gray-700">
            API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Authenticate
        </button>
      </form>
    </div>
  );
};

export default ApiKeyInput;