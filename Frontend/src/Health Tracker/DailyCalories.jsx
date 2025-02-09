import React, { useState } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:8000/api/health/v2/calculate/dailycalories";

const DailyCalories = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activity: 'sedentary'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateCalories = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(API_URL, formData);
      setResult(response.data);
    } catch (error) {
      setError('Failed to calculate calories. Please try again.');
      console.error('Calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Calculate Daily Calories</h1>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <form onSubmit={calculateCalories} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Level
                </label>
                <select
                  value={formData.activity}
                  onChange={(e) => setFormData({...formData, activity: e.target.value})}
                  className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light Activity</option>
                  <option value="moderate">Moderate Activity</option>
                  <option value="active">Active</option>
                  <option value="very active">Very Active</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Calculate
            </button>
          </form>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {result && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-800">Your Daily Calories:</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {result.calories} kcal
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyCalories;