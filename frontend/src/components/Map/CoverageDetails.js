import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, MapPin, Check, X, ArrowLeft } from "lucide-react";
import IndiaMap from "../Map/IndiaMap";
import { Alert, AlertDescription, AlertTitle } from "../ui/Alert";

// List of Indian states
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "UP",
  "Uttarakhand",
  "West Bengal",
];

const serviceTypes = [
  {
    id: 1,
    name: "Utility Management",
    description: "Smart tracking and optimization of utilities",
  },
  {
    id: 2,
    name: "Maintenance Services",
    description: "Regular maintenance and emergency repairs",
  },
  {
    id: 3,
    name: "Security Systems",
    description: "Advanced security monitoring",
  },
  {
    id: 4,
    name: "Community Management",
    description: "Digital solutions for community engagement",
  },
];

const CoverageDetails = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showServiceList, setShowServiceList] = useState(false);

  // Sample data structure for location coverage
  const locationDatabase = {
    maharashtra: {
      available: true,
      pinCodes: ["400001", "400002", "400003"],
      servicesAvailable: [1, 2, 3, 4],
    },
    delhi: {
      available: true,
      pinCodes: ["110001", "110002", "110003"],
      servicesAvailable: [1, 2, 3],
    },
    karnataka: {
      available: true,
      pinCodes: ["560001", "560002", "560003"],
      servicesAvailable: [1, 2],
    },
    "tamil nadu": {
      available: false,
      comingSoon: true,
      expectedLaunch: "2024 Q4",
    },
    bihar: {
      available: true,
      pinCodes: ["843301", "843302", "843303"],
      servicesAvailable: [1, 2, 3, 4],
    },
    up: {
      available: true,
      pinCodes: ["231218", "224436", "231225"],
      servicesAvailable: [1, 2, 3, 4],
    },
    assam: {
      available: true,
      pinCodes: ["72882", "728828", "726221"],
      servicesAvailable: [1, 2, 3, 4],
    },
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const locationInfo = locationDatabase[selectedState.toLowerCase()];

    if (locationInfo) {
      setSelectedLocation({ state: selectedState, ...locationInfo });
      setShowServiceList(true);
    } else {
      setSelectedLocation({
        state: selectedState,
        available: false,
        comingSoon: false,
      });
      setShowServiceList(false);
    }
  };

  const ServiceAvailabilityCard = ({ service, isAvailable }) => (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-md mb-4">
      <div
        className={`p-2 rounded-full ${
          isAvailable ? "bg-green-100" : "bg-gray-100"
        } mr-4`}
      >
        {isAvailable ? (
          <Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
        ) : (
          <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-base sm:text-lg">{service.name}</h3>
        <p className="text-gray-600 text-sm sm:text-base">
          {service.description}
        </p>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/home")}
              className="text-white flex items-center hover:text-blue-200"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="text-sm sm:text-base">Back to Home</span>
            </button>
          </div>
          <h1 className="text-white text-2xl sm:text-3xl font-bold mt-4">
            Check Service Availability
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* State Dropdown Section */}
        <div className="max-w-3xl mx-auto mb-6 sm:mb-8">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
          >
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <MapPin className="h-5 w-5" />
              </div>
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="w-full pl-10 pr-10 py-2 sm:py-3 text-base sm:text-lg border-2 border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out appearance-none"
              >
                <option value="">Select a state</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown className="h-5 w-5" />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg rounded-lg hover:bg-blue-700 flex items-center justify-center transition duration-200 ease-in-out whitespace-nowrap"
            >
              Check Availability
            </button>
          </form>
        </div>

        {/* Results Section */}
        {selectedLocation && (
          <div className="max-w-3xl mx-auto">
            {selectedLocation.available ? (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <Check className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-800 text-base sm:text-lg">
                  Services Available in {selectedLocation.state}
                </AlertTitle>
                <AlertDescription className="text-green-700 text-sm sm:text-base">
                  We offer our services in {selectedLocation.state}. Servicing
                  pin codes: {selectedLocation.pinCodes.join(", ")}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert
                className={`mb-6 ${
                  selectedLocation.comingSoon
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <AlertTitle className="text-base sm:text-lg">
                  {selectedLocation.comingSoon
                    ? `Coming Soon to ${selectedLocation.state}`
                    : `Services Not Available in ${selectedLocation.state}`}
                </AlertTitle>
                <AlertDescription className="text-sm sm:text-base">
                  {selectedLocation.comingSoon
                    ? `We're planning to launch our services in ${selectedLocation.state} by ${selectedLocation.expectedLaunch}. Stay tuned!`
                    : "We haven't reached this location yet. We're continuously expanding our coverage."}
                </AlertDescription>
              </Alert>
            )}

            {showServiceList && (
              <div className="mt-6 sm:mt-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                  Available Services
                </h2>
                {serviceTypes.map((service) => (
                  <ServiceAvailabilityCard
                    key={service.id}
                    service={service}
                    isAvailable={selectedLocation.servicesAvailable?.includes(
                      service.id
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Map Section */}
        <div className="mt-6 sm:mt-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
            Coverage Map
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-2 sm:p-4">
            <div className="h-[300px] sm:h-[500px]">
              <IndiaMap />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoverageDetails;
