const axios = require("axios");
require("dotenv").config();

const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_API_KEY;

const baseURL = "https://trackapi.nutritionix.com/v2";
const headers = {
    "x-app-id": NUTRITIONIX_APP_ID,
    "x-app-key": NUTRITIONIX_API_KEY,
    "Content-Type": "application/json"
};

// Get instant food search results
exports.searchInstant = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }

        const response = await axios.get(`${baseURL}/search/instant`, {
            params: { query },
            headers
        });

        res.json({
            common: response.data.common || [],
            branded: response.data.branded || [],
            message: "Search results retrieved successfully"
        });
    } catch (error) {
        console.error("Instant search error:", error);
        res.status(500).json({
            error: "Failed to fetch food suggestions",
            details: error.response?.data || error.message
        });
    }
};

// Get detailed nutrition information
exports.getNutritionInfo = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: "Food query is required" });
        }

        const response = await axios.post(
            `${baseURL}/natural/nutrients`,
            { query },
            { headers }
        );

        res.json({
            foods: response.data.foods,
            message: "Nutrition information retrieved successfully"
        });
    } catch (error) {
        console.error("Nutrition info error:", error);
        res.status(500).json({
            error: "Failed to fetch nutrition information",
            details: error.response?.data || error.message
        });
    }
};

// Get exercise calories
exports.getExerciseCalories = async (req, res) => {
    try {
        const { query, gender, weight_kg, height_cm, age } = req.body;
        if (!query) {
            return res.status(400).json({ error: "Exercise description is required" });
        }

        const response = await axios.post(
            `${baseURL}/natural/exercise`,
            {
                query,
                gender,
                weight_kg,
                height_cm,
                age
            },
            { headers }
        );

        res.json({
            exercises: response.data.exercises,
            message: "Exercise calories calculated successfully"
        });
    } catch (error) {
        console.error("Exercise calories error:", error);
        res.status(500).json({
            error: "Failed to calculate exercise calories",
            details: error.response?.data || error.message
        });
    }
};

// Calculate daily calorie needs
exports.calculateDailyCalories = async (req, res) => {
    try {
      // console.log("Request body:", req.body);
      const { gender, age, height_cm, weight_kg, activity_level } = req.body;

      // Basic validation
      if (!gender || !age || !height_cm || !weight_kg || !activity_level) {
        return res.status(400).json({
          error:
            "All fields (gender, age, height, weight, activity_level) are required",
        });
      }

      // Calculate BMR using Mifflin-St Jeor Equation
      let bmr;
      if (gender.toLowerCase() === "male") {
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
      } else {
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
      }

      // Activity multipliers
      const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
      };

      const dailyCalories = Math.round(
        bmr * activityMultipliers[activity_level]
      );

      res.json({
        daily_calories: dailyCalories,
        bmr: Math.round(bmr),
        activity_level: activity_level,
        message: "Daily calorie needs calculated successfully",
      });
      // console.log("Daily calories:", dailyCalories);
    } catch (error) {
        console.error("Daily calories calculation error:", error);
        res.status(500).json({
            error: "Failed to calculate daily calorie needs",
            details: error.message
        });
    }
};

// Get food item by UPC
exports.getFoodByUPC = async (req, res) => {
    try {
        const { upc } = req.query;
        if (!upc) {
            return res.status(400).json({ error: "UPC code is required" });
        }

        const response = await axios.get(`${baseURL}/search/item`, {
            params: { upc },
            headers
        });

        res.json({
            food: response.data.foods[0],
            message: "Food item retrieved successfully"
        });
    } catch (error) {
        console.error("UPC search error:", error);
        res.status(500).json({
            error: "Failed to fetch food item",
            details: error.response?.data || error.message
        });
    }
};