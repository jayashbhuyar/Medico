import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaSpinner } from 'react-icons/fa';

const API_URL = "http://localhost:5000/v2/natural/nutrients";

const FoodSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(API_URL, { query });
      setResults(response.data.foods);
    } catch (error) {
      setError('Failed to search foods. Please try again.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Search Foods</h1>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for any food..."
              className="flex-1 rounded-lg border-gray-200 focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600
                       disabled:bg-gray-300 flex items-center gap-2"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
              Search
            </button>
          </form>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          <div className="mt-8 space-y-4">
            {results.map((food, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-800">{food.food_name}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Calories: {food.nf_calories} | Protein: {food.nf_protein}g
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodSearch;