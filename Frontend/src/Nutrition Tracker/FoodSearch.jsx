import React, { useState } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { searchFood } from '../../api/nutrition';

const FoodSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await searchFood(query);
      setResults(data);
    } catch (error) {
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

          <div className="mt-8 space-y-4">
            {results.map((food) => (
              <div
                key={food.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-800">{food.name}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Calories: {food.calories} | Protein: {food.protein}g
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