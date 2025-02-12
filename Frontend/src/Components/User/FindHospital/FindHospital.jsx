import React, { useState, useEffect } from "react";
import axios from "axios";
import HospitalCard from "./HospitalCard";
import HospitalDetails from "./HospitalDetails";

const FindHospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [mapQuery, setMapQuery] = useState(null);
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  const fetchLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const fetchNearbyHospitals = async (latitude, longitude) => {
    try {
      const response = await axios.get("http://localhost:8000/api/search/v1/hospital/nearby", {
        params: {
          latitude,
          longitude,
        },
      });
      setHospitals(response.data.results || []);
    } catch (error) {
      console.error("Error fetching nearby hospitals:", error);
      setLocationError("Failed to fetch nearby hospitals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLocationAndFetchHospitals = async () => {
      setLoading(true);
      setLocationError("");

      try {
        const position = await fetchLocation();
        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });
        await fetchNearbyHospitals(latitude, longitude);
      } catch (error) {
        console.error("Error getting location:", error);
        setLocationError(
          "Unable to get your location. Please enable location services."
        );
        setLoading(false);
      }
    };

    getLocationAndFetchHospitals();
  }, []);

  const handleHospitalClick = (hospital) => {
    setSelectedHospital(hospital);
    setMapQuery(
      `${hospital.poi.name}, ${hospital.address.municipality}, ${hospital.address.countrySecondarySubdivision}, ${hospital.address.postalCode}`
    );
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-cover bg-repeat-y bg-[url('https://i.ibb.co/tJkCLrK/16404766-v870-tang-37.png')]">
      <div className="min-h-screen">
        <div className="overflow-hidden mt-11">
          <div className="bg-green-900 h-[150px] max-h-[150px] bg-opacity-75 text-white flex justify-center items-center">
            <div className="max-w-5xl mx-auto text-center px-4 md:px-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Find Hospitals Near You
              </h1>
              <p className="text-lg md:text-xl">
                Explore Healthcare Facilities in Your Area
              </p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="w-[90%] m-auto mt-8">
          <div className="max-w-4xl mx-auto">
            <div className="mt-8">
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : hospitals.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {hospitals.map((hospital) => (
                    <div
                      key={hospital.id}
                      onClick={() => handleHospitalClick(hospital)}
                      className="p-10 transition-transform transform hover:scale-105 hover:cursor-pointer hover:shadow-lg hover:bg-gray-300 bg-white bg-opacity-80 rounded mb-4 shadow-md"
                    >
                      <h2 className="text-4xl text-center font-bold mb-8">
                        {hospital.poi.name}
                      </h2>
                      <p className="text-gray-600 text-center font-bold">
                        {hospital.address.freeformAddress}
                      </p>
                      <div className="transition-all flex items-center mt-2 justify-center py-[4px]">
                        <img src="https://i.ibb.co/hfPjc91/image.png" alt="" />
                        <div className="transition-all ml-2 text-[15px] font-sans font-semibold text-[#3a3a3a]">
                          {`${(hospital.dist / 1000).toFixed(2)} km away`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">No hospitals found</div>
              )}
            </div>

            {/* Map Section */}
            {mapQuery && (
              <div className="flex justify-center items-center pb-10 mt-8">
                <iframe
                  className="border border-black rounded-md shadow-lg"
                  width="600"
                  height="450"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=${
                    process.env.REACT_APP_GOOGLE_MAPS_API_KEY
                  }&q=${mapQuery.replace(/[^a-z0-9]/gi, "")}`}
                  title="Hospital Location"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindHospital;
