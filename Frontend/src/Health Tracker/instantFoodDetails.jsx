import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { FaSearch, FaSpinner } from 'react-icons/fa';

const API_URL = "http://localhost:5000/v2/search/instant";

const InstantFoodDetails = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuggestions = debounce(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(API_URL, {
        params: { query: searchQuery }
      });
      setSuggestions(response.data);
    } catch (error) {
      setError('Failed to fetch suggestions. Please try again.');
      console.error('Autocomplete error:', error);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(query);
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Autocomplete Food Search</h1>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Start typing to search..."
              className="flex-1 rounded-lg border-gray-200 focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              disabled={loading}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600
                       disabled:bg-gray-300 flex items-center gap-2"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
              Search
            </button>
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          <div className="mt-8 space-y-4">
            {suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-800">{suggestion.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstantFoodDetails;