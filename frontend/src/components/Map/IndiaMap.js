import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Polygon, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Define service availability and state polygons with coordinates
const serviceAvailability = {
  maharashtra: {
    name: "Maharashtra",
    available: true,
    cities: ["Mumbai", "Pune", "Nagpur", "Thane"],
    coordinates: [
      [19.7515, 75.7139],
      [19.896, 75.2],
      [19.8, 76.2],
    ],
    cityCoordinates: [
      [19.076, 72.8777], // Mumbai
      [18.5204, 73.8567], // Pune
      [21.1458, 79.0882], // Nagpur
      [19.2183, 72.9781], // Thane
    ],
  },
  delhi: {
    name: "Delhi",
    available: true,
    cities: ["New Delhi", "South Delhi", "North Delhi"],
    coordinates: [
      [28.7041, 77.1025],
      [28.52, 77.15],
      [28.7, 77.1],
    ],
    cityCoordinates: [
      [28.6139, 77.209], // New Delhi
    ],
  },
  // Add more states as needed
};

// Custom icons for markers
const availableIcon = new L.Icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
  shadowSize: [41, 41],
});

const unavailableIcon = new L.Icon({
  iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
  shadowSize: [41, 41],
});

// Legend Component
const Legend = () => (
  <div className="absolute top-4 left-4 bg-white p-4 rounded shadow-lg">
    <h3 className="font-bold mb-2">Service Availability</h3>
    <div className="flex items-center">
      <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
      <span>Available</span>
    </div>
    <div className="flex items-center mt-2">
      <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
      <span>Coming Soon</span>
    </div>
  </div>
);

const IndiaMap = () => {
  const [showAvailable, setShowAvailable] = useState(true);
  const mapRef = useRef();

  // Helper function to validate coordinates
  const isValidCoordinates = (coords) => {
    return (
      Array.isArray(coords) &&
      coords.length === 2 &&
      !isNaN(coords[0]) &&
      !isNaN(coords[1])
    );
  };

  return (
    <div>
      {/* Filter Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAvailable(!showAvailable)}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Toggle Available States
        </button>
      </div>

      {/* Map */}
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: "500px", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Legend />

        {/* Render polygons for states */}
        {Object.keys(serviceAvailability).map((stateKey) => {
          const state = serviceAvailability[stateKey];
          const validCoordinates = state.coordinates.every(isValidCoordinates); // Ensure all coordinates are valid

          if (!validCoordinates) return null; // Skip rendering if coordinates are invalid

          return (
            (showAvailable ? state.available : !state.available) && (
              <Polygon
                key={stateKey}
                positions={state.coordinates}
                pathOptions={{
                  fillColor: state.available ? "green" : "gray",
                  color: "green",
                  fillOpacity: 0.5,
                }}
              >
                <Popup>
                  <strong>{state.name}</strong>
                  <p>
                    Service Status:{" "}
                    {state.available ? "Available" : "Coming Soon"}
                  </p>
                </Popup>
              </Polygon>
            )
          );
        })}

        {/* Render markers for cities */}
        {Object.keys(serviceAvailability).map((stateKey) => {
          const state = serviceAvailability[stateKey];
          return state.cities.map((city, idx) => {
            const cityCoord = state.cityCoordinates[idx];
            if (!isValidCoordinates(cityCoord)) return null; // Skip invalid coordinates

            return (
              <Marker
                key={city}
                position={cityCoord}
                icon={state.available ? availableIcon : unavailableIcon}
              >
                <Popup>
                  <strong>{city}</strong>
                  <br />
                  Status:{" "}
                  {state.available ? "Service Available" : "Coming Soon"}
                </Popup>
              </Marker>
            );
          });
        })}
      </MapContainer>
    </div>
  );
};

export default IndiaMap;
