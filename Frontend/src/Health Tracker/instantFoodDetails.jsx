import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { FaSearch, FaSpinner, FaUtensils } from "react-icons/fa";

const API_URL = "http://localhost:8000/api/health/v2/food/search";

const InstantFoodDetails = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);

  const fetchSuggestions = debounce(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(API_URL, {
        params: { query: searchQuery },
      });
      // Extract the branded and common arrays from response
      const { common = [], branded = [] } = response.data;
      setSuggestions([...common, ...branded]);
    } catch (error) {
      setError("Failed to fetch suggestions. Please try again.");
      console.error("Autocomplete error:", error);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(query);
  }, [query]);

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Quick Food Search
        </h1>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Start typing to search foods..."
              className="flex-1 rounded-lg border-gray-200 focus:ring-2 focus:ring-purple-500 
                       py-2 px-4"
            />
            <button
              type="button"
              disabled={loading}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600
                       disabled:bg-gray-300 flex items-center gap-2 transition-colors"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
              Search
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mt-8 space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <FaSpinner className="animate-spin text-purple-500 text-2xl" />
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((food, idx) => (
                <div
                  key={idx}
                  onClick={() => handleFoodSelect(food)}
                  className="p-4 border rounded-lg hover:shadow-md transition-all
                           hover:bg-purple-50 cursor-pointer flex items-center gap-4"
                >
                  <div className="p-2 bg-purple-100 rounded-full">
                    <FaUtensils className="text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {food.food_name}
                    </h3>
                    {food.brand_name && (
                      <p className="text-sm text-gray-600">{food.brand_name}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              query &&
              !loading && (
                <div className="text-center py-8 text-gray-500">
                  No foods found matching your search
                </div>
              )
            )}
          </div>
        </div>

        {/* Selected Food Details */}
        {selectedFood && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedFood.food_name}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Serving Size</p>
                <p className="font-semibold">
                  {selectedFood.serving_qty} {selectedFood.serving_unit}
                </p>
              </div>
              {selectedFood.brand_name && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Brand</p>
                  <p className="font-semibold">{selectedFood.brand_name}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstantFoodDetails;