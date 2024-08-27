import React, { useState } from "react";

interface Location {
  latitude: number;
  longitude: number;
}

const App = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [panic, setPanic] = useState(false);
  const [address, setAddress] = useState("");
  const [shared, setShared] = useState(false);

  const handlePanic = () => {
    setPanic(true);
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&limit=1`
      )
        .then((response) => response.json())
        .then((data) => setAddress(data.display_name));
    });

    // Flash effect
    const button = document.getElementById("panicButton");
    if (button) {
      button.classList.add("flash");
      setTimeout(() => button.classList.remove("flash"), 500); // Remove flash effect after 500ms
    }
  };

  const handleReset = () => {
    setPanic(false);
    setLocation(null);
    setAddress("");
    setShared(false);
  };

  const handleShare = () => {
    if (location) {
      const message = `Neighbourhood Alert! I need help at ${address} (${location.latitude}, ${location.longitude})`;
      const phoneNumber = "27681725169"; // Replace with the actual phone number you want to send the message to
      const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
        message
      )}`;
      window.open(url, "_blank");
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {panic && location && (
        <iframe
          title="Live Location"
          src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&t=m&z=15&output=embed`}
          frameBorder="0"
          className="w-full h-64 mb-4"
        />
      )}
      <button
        id="panicButton"
        className={`rounded-full text-white font-bold py-4 px-8 text-xl ${
          panic ? "bg-red-700" : "bg-red-500"
        } hover:bg-red-700`}
        onClick={handlePanic}
      >
        Panic!
      </button>
      {panic && (
        <div className="mt-4">
          <p className="text-lg font-bold">Live Location:</p>
          <p className="text-lg">
            {location
              ? `Latitude: ${location.latitude}, Longitude: ${location.longitude}`
              : "Loading..."}
          </p>
          <p className="text-lg font-bold">Address:</p>
          <p className="text-lg">{address}</p>
          <div className="mt-4 flex flex-col items-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 ${
                shared ? "bg-green-700" : ""
              }`}
              onClick={handleShare}
            >
              Share on WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
