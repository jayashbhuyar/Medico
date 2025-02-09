import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const API_URL = "http://localhost:5000/api/nutrition";

const FoodDetails = () => {
  const { upc } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/item`, { params: { upc } });
        setDetails(response.data);
      } catch (error) {
        setError('Failed to fetch food details. Please try again.');
        console.error('Details error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (upc) {
      fetchFoodDetails();
    }
  }, [upc]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Food Details</h1>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          {loading && (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin text-pink-500 text-3xl" />
            </div>
          )}

          {error && <p className="text-red-500">{error}</p>}

          {details && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{details.name}</h2>
              <p className="text-gray-600 mt-2">UPC: {details.upc}</p>
              <div className="mt-4">
                <p className="text-gray-800">Calories: {details.calories}</p>
                <p className="text-gray-800">Protein: {details.protein}g</p>
                <p className="text-gray-800">Carbs: {details.carbs}g</p>
                <p className="text-gray-800">Fat: {details.fat}g</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;