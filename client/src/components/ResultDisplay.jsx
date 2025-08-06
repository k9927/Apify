import React from 'react';

const ResultDisplay = ({ result, error }) => {
  if (error) {
    return (
      <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-red-600">Execution Failed</h2>
        <div className="px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold text-green-600">Execution Result</h2>
      <div className="p-4 rounded bg-gray-50">
        <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ResultDisplay;