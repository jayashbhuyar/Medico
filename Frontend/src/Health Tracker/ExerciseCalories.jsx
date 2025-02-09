import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaSpinner } from 'react-icons/fa';

const API_URL = "http://localhost:8000/api/health/v2/exercise/calories";

const ExerciseCalories = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateExerciseCalories = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(API_URL, { query });
      setResult(response.data);
    } catch (error) {
      setError('Failed to calculate exercise calories. Please try again.');
      console.error('Exercise calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Calculate Exercise Calories</h1>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <form onSubmit={calculateExerciseCalories} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter exercise details..."
              className="flex-1 rounded-lg border-gray-200 focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600
                       disabled:bg-gray-300 flex items-center gap-2"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
              Calculate
            </button>
          </form>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {result && (
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-gray-800">Calories Burned:</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {result.calories} kcal
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseCalories;