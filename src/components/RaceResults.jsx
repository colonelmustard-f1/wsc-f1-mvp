import React, { useState } from 'react';

function RaceResults() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testUrl = 'https://www.formula1.com/en/results/2023/races/1141/abu-dhabi/race-result.html';

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching from:', `/api/scrape?url=${encodeURIComponent(testUrl)}`);
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(testUrl)}`);
      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      setError('Failed to fetch results');
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <button 
        onClick={fetchResults}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Loading...' : 'Test Scraper'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Race Results:</h2>
          <ul className="mt-2">
            {results.map((result, index) => (
              <li key={index} className="mb-1">
                P{result.position}: {result.driver} ({result.status})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RaceResults;
