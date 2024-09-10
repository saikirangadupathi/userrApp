import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};

const center = {
  lat: 17.385044, // Replace with your center latitude
  lng: 78.486671, // Replace with your center longitude
};

const TrackingService = () => {
  const [response, setResponse] = useState(null);
  const origin = { lat: 17.385044, lng: 78.486671 }; // Replace with origin coordinates
  const destination = { lat: 17.426485, lng: 78.448288 }; // Replace with destination coordinates

  useEffect(() => {
    // Simulate real-time updates (this should be replaced with actual real-time tracking logic)
    const interval = setInterval(() => {
      // Fetch updated coordinates for the delivery partner here and update the state
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const directionsCallback = (response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setResponse(response);
      } else {
        console.log('response: ', response);
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={10} center={center}>
        <DirectionsService
          options={{
            destination: destination,
            origin: origin,
            travelMode: 'DRIVING',
          }}
          callback={directionsCallback}
        />
        {response !== null && (
          <DirectionsRenderer
            options={{
              directions: response,
            }}
          />
        )}
        <div style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          background: 'white',
          padding: '10px',
          textAlign: 'center',
          borderTop: '1px solid #ddd',
        }}>
          <h3>Arriving soon</h3>
          <p>Your PickUp is on the way<br />You can track our executive or call if needed</p>
          <p style={{ color: 'red' }}>Note: Please make sure materials were segregated properly</p>
        </div>
      </GoogleMap>
    </LoadScript>
  );
};

export default TrackingService;
