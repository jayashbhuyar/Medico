import React, { useState } from "react";
import axios from "axios";
import HospitalCard from "./HospitalCard";
import HospitalDetails from "./HospitalDetails";

const FindHospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchParams, setSearchParams] = useState({
    type: "name",
    query: "",
  });
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v2/hospitals/search`,
        {
          params: searchParams,
        }
      );
      setHospitals(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleNearMe = async () => {
    setLoading(true);
    setLocationError("");

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      const response = await axios.get(`http://localhost:8000/api/v2/hospitals/nearby`, {
        params: {
          lat: latitude,
          lng: longitude,
          radius: 10, // 10km radius
        },
      });

      setHospitals(response.data);
    } catch (error) {
      setLocationError(
        "Unable to get your location. Please enable location services."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Find Hospitals
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Search for hospitals by name, location or find nearby hospitals
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            onClick={handleNearMe}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {loading ? (
              "Searching..."
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Find Hospitals Near Me
              </>
            )}
          </button>

          {locationError && (
            <p className="text-red-600 text-sm">{locationError}</p>
          )}

          <div className="w-full max-w-4xl">
            <div className="text-center mb-4">
              <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm">
                OR
              </span>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <select
                value={searchParams.type}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, type: e.target.value })
                }
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:w-48"
              >
                <option value="name">Search by Name</option>
                <option value="location">Search by Location</option>
                <option value="pincode">Search by Pincode</option>
              </select>

              <input
                type="text"
                value={searchParams.query}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, query: e.target.value })
                }
                className="flex-1 max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter search term..."
              />

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12">
          {selectedHospital ? (
            <HospitalDetails
              hospital={selectedHospital}
              onBack={() => setSelectedHospital(null)}
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hospitals.map((hospital) => (
                <HospitalCard
                  key={hospital._sr_no}
                  hospital={hospital}
                  onClick={() => setSelectedHospital(hospital)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindHospital;
