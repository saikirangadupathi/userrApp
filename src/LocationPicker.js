import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Input, Button, List, message, Select, Radio, Card, Modal } from 'antd'; // Add List to the import statement

import { AimOutlined, SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useGeolocated } from 'react-geolocated';
import { useNavigate } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';

import { DeleteOutlined } from '@ant-design/icons';


import axios from 'axios'; // Axios import for API requests

mapboxgl.accessToken = 'pk.eyJ1IjoiZ3NhaXRlamEwMDEiLCJhIjoiY2x5a3MyeXViMDl3NjJqcjc2OHQ3NTVoNiJ9.b5q6xpWN2yqeaKTaySgcBQ'; // Replace with your Mapbox token

const LocationPicker = ({ onConfirmLocation }) => {
  const [location, setLocation] = useState(null);
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [address, setAddress] = useState('');

  const [addresses, setAddresses] = useState([]); // State to store addresses

  const [selectedAddressId, setSelectedAddressId] = useState(null); // State for selected address

  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setRegion] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [district, setDistrict] = useState('');

  const [suggestions, setSuggestions] = useState([]); // State to hold location suggestions

  const [marker, setMarker] = useState(null); // Add this here

  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');


  const [name, setName] = useState(''); // Add state for name
  const [postOffices, setPostOffices] = useState([]); // State to hold post office list
  const [selectedPostOffice, setSelectedPostOffice] = useState(''); // State to store selected post office
  const [addressType, setAddressType] = useState('home'); // State for address type (home, office, etc.)


  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [addressToDelete, setAddressToDelete] = useState(null); // Track which address to delete


  const [isFormVisible, setIsFormVisible] = useState(false); // Track if the form is visible


  


  // Inside your component, ensure you have this line to manage the user's addresses state:
  const [userAddresses, setUserAddresses] = useState([]); // Define the state for user's addresses


  const [errors, setErrors] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    selectedPostOffice: '',
    location: ''
  });
  



  const mapRef = useRef(null);
  const mapInstance = useRef(null); 
  const navigate = useNavigate();

  // Use the updated configuration for getting the precise location
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true, // Enforces high accuracy (best possible GPS data)
      timeout: 30000, // Allow up to 30 seconds to get the location for higher accuracy
      maximumAge: 0, // Ensure the most up-to-date location data (no cached data)
    },
    watchPosition: true, // Continuously watch the position to update if the user moves
    userDecisionTimeout: 10000, // Give the user 10 seconds to allow location access
  });


  // Inside your fetchProfile function:
const fetchProfile = async () => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  if (!token) {
    message.error('Authentication token not found');
    return;
  }

  try {
    const response = await fetch('https://recycle-backend-apao.onrender.com/api/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Add token to the Authorization header
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUserId(data.id); // Store profile data in state
      setUserName(data.name); // Set the name from the profile
      setUserAddresses(data.addresses || []);  // Store fetched addresses to userAddresses
      message.success('Profile data fetched successfully!');
    } else {
      const errorData = await response.json();
      message.error(`Error fetching profile: ${errorData.error}`);
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    message.error('An error occurred while fetching the profile');
  }
};


  
  // Initialize the map
  useEffect(() => {
    fetchProfile();
    if (mapInstance.current) {
      mapInstance.current.remove(); // Clean up previous map instance if any
    }

    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: location ? [location.lng, location.lat] : [78.476, 17.366], // Default coordinates
      zoom: 18,
    });

    const handleMoveEnd = () => {
      // Get the center of the map in geographic coordinates (lat/lng)
      const mapCenter = mapInstance.current.getCenter();
    
      // Convert the map center (geographic coordinates) to pixel coordinates
      const mapCenterPixel = mapInstance.current.project(mapCenter);
    
      // Calculate the pixel position of the marker's bottom tip
      const markerHeight = 41; // Height of the marker in pixels (based on your marker image)
      const markerOffset = {
        x: mapRef.current.clientWidth / 2, // X position: middle of the map horizontally
        y: (mapRef.current.clientHeight * 0.35) + (markerHeight / 2), // Y position + offset for bottom tip of marker
      };
    
      // Adjust the markerOffset based on the map center pixel position
      const adjustedMarkerPixel = {
        x: mapCenterPixel.x + (markerOffset.x - mapRef.current.clientWidth / 2),
        y: mapCenterPixel.y + (markerOffset.y - mapRef.current.clientHeight / 2),
      };
    
      // Convert the adjusted marker's pixel position back to geographic coordinates (lat/lng)
      const offsetLngLat = mapInstance.current.unproject([adjustedMarkerPixel.x, adjustedMarkerPixel.y]);
    
      // Log the precise latitude and longitude of the marker's bottom tip
      console.log('Precise Lat/Lng of bottom tip:', offsetLngLat);
    
      // Update the location based on the new offset
      if (!location || (offsetLngLat.lat !== location.lat || offsetLngLat.lng !== location.lng)) {
        setLocation({ lat: offsetLngLat.lat, lng: offsetLngLat.lng });
      }
    };
    
    
  
    // Listen to the map's moveend event
    mapInstance.current.on('moveend', handleMoveEnd);


    // Add marker for device location
    if (deviceLocation) {
      const el = document.createElement('div');
      el.innerHTML = `<iframe src="https://lottie.host/embed/297c174f-47af-434f-9b12-fcbdfaa4fe2f/mqEBrQNLKQ.json" style="width: 50px; height: 50px; border: none;"></iframe>`;
      new mapboxgl.Marker(el)
        .setLngLat([deviceLocation.lng, deviceLocation.lat])
        .addTo(mapInstance.current);
    }


    // Clean up on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.off('moveend', handleMoveEnd); // Properly remove the event listener
        mapInstance.current.remove(); // Remove the map instance
        mapInstance.current = null; // Clear the reference
      }
    };
  }, [deviceLocation]); // Only run effect when deviceLocation changes


  // Set the device location when coordinates are available
  useEffect(() => {
    if (coords && (!deviceLocation || coords.latitude !== deviceLocation.lat || coords.longitude !== deviceLocation.lng)) {
      const newLocation = { lat: coords.latitude, lng: coords.longitude };
      setDeviceLocation(newLocation);
      mapInstance.current.flyTo({ center: [newLocation.lng, newLocation.lat], zoom: 15 });
    }
  }, [coords, deviceLocation]);
  


  

  const handleSearch = async (value) => {
    setAddress(value);
    if (value.length > 2) { // Fetch suggestions only if the input length is greater than 2 characters
      try {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?access_token=${mapboxgl.accessToken}&limit=5`);
        const data = await response.json();
        
        // Set the fetched suggestions
        setSuggestions(data.features);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
      }
    } else {
      // Clear suggestions if input is too short
      setSuggestions([]);
    }
  };
  

  const handleSuggestionClick = (item) => {
    const [lng, lat] = item.geometry.coordinates;
    setLocation({ lng, lat });
    mapInstance.current.setCenter([lng, lat]);
  
    // Remove previous marker if it exists
    if (marker) {
      marker.remove();
    }
  
    // Create a new marker at the selected location
    const newMarker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(mapInstance.current);
  
    // Save the new marker to the state
    setMarker(newMarker);
  
    setSuggestions([]); // Clear suggestions after selecting
  };
  

  
  const handleCurrentLocation = () => {
    if (coords) {
      const newLocation = { lat: coords.latitude, lng: coords.longitude };
      setLocation(newLocation); // Save the device's lat/lng
      setDeviceLocation(newLocation);
      console.log('Location..', location);
      console.log('DeviceLocation..', deviceLocation);

      // Remove previous marker if it exists
      if (marker) {
        marker.remove();
      }
  
      // Create a new marker at the device's current location
      const newMarker = new mapboxgl.Marker()
        .setLngLat([newLocation.lng, newLocation.lat])
        .addTo(mapInstance.current);
  
      // Save the new marker to the state
      setMarker(newMarker);
  
      // Calculate the offset to account for the `centerMarker` being above the center
      const markerHeight = 41; // Height of the center marker in pixels
      const mapHeight = mapRef.current.clientHeight;
      const offsetY = (mapHeight * 0.35) + (markerHeight / 2); // Adjust for the center marker position
  
      // Adjust the center to account for the marker offset
      const centerWithOffset = mapInstance.current.project([newLocation.lng, newLocation.lat]);
      centerWithOffset.y += offsetY;
  
      const newCenter = mapInstance.current.unproject(centerWithOffset);
      console.log('newCenter..',newCenter);
      // Fly the map to the new center (with offset)
      mapInstance.current.flyTo({
        center: [newCenter.lng, newCenter.lat], // Adjusted center position
        zoom: 18,
        essential: true,
      });
    }
  };
  
  
  

  const handlePostalCodeChange = async (e) => {
    const pincode = e.target.value;
    setPostalCode(pincode);
  
    // Clear the state values and hide Select dropdown if the pincode is not valid
    if (pincode.length < 6) {
      setPostOffices([]); // Clear post offices to hide the Select dropdown
      setRegion('');
      setState('');
      setCountry('');
      return;
    }
  
    // If pincode length is exactly 6, fetch post office data
    if (pincode.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
  
        if (data[0].Status === 'Success') {
          const postOfficesData = data[0].PostOffice.map((office) => ({
            name: office.Name,
            region: office.Region,
            district: office.District,
            state: office.State,
            country: office.Country,
            District: office.District
          }));
          setPostOffices(postOfficesData); // Populate post offices
          setRegion(postOfficesData[0].region); // Set city from the first post office
          setState(postOfficesData[0].state); // Set state from the first post office
          setCountry(postOfficesData[0].country); // Set country from the first post office
          setDistrict(postOfficesData[0].District);
        } else {
          message.error('Invalid pincode');
          setPostOffices([]); // Clear post offices to hide the Select dropdown
          setRegion('');
          setState('');
          setCountry('');
          setDistrict('');
        }
      } catch (error) {
        message.error('Error fetching pincode details');
        setPostOffices([]); // Clear post offices to hide the Select dropdown
        setRegion('');
        setState('');
        setCountry('');
        setDistrict('');
      }
    }
  };

  const handleConfirmLocation = async () => {
    // Reset previous errors
    setErrors({
      name: '',
      addressLine1: '',
      postalCode: '',
      selectedPostOffice: '',
      location: ''
    });
  
    let hasError = false;
  
    // Check for empty fields and set errors accordingly
    if (!name) {
      setErrors(prevErrors => ({ ...prevErrors, name: 'Name is required' }));
      hasError = true;
    }
  
    if (!addressLine1) {
      setErrors(prevErrors => ({ ...prevErrors, addressLine1: 'Address Line 1 is required' }));
      hasError = true;
    }
  
    if (!postalCode) {
      setErrors(prevErrors => ({ ...prevErrors, postalCode: 'Postal Code is required' }));
      hasError = true;
    }
  
    if (!selectedPostOffice) {
      setErrors(prevErrors => ({ ...prevErrors, selectedPostOffice: 'Post Office is required' }));
      hasError = true;
    }
  
    if (!location) {
      setErrors(prevErrors => ({ ...prevErrors, location: 'Location must be selected on the map' }));
      hasError = true;
    }
  
    // If any error exists, stop form submission
    if (hasError) {
      return;
    }
  
    // Proceed if all fields are valid
    const token = localStorage.getItem('token'); // Get token from local storage (if using authentication)
  
    if (!userId || !token) {
      message.error('User ID or token is missing');
      return;
    }
  
    const addressData = {
      userId,
      selectedAddressId,
      name,
      addressLine1,
      addressLine2,
      city, // Region field
      state,
      postalCode,
      country,
      postOffice: selectedPostOffice,
      isPrimary: false,
      addressType,
      location: {
        latitude: location.lat,
        longitude: location.lng,
      },
    };
  
    try {
      const response = await fetch('https://recycle-backend-apao.onrender.com/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });
  
      if (response.ok) {
        const result = await response.json();
        message.success('Address added successfully!');
        window.location.reload();
      } else {
        const errorData = await response.json();
        message.error(`Failed to add address: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error adding address:', error);
      message.error('An error occurred while adding the address');
    }
  };
  


  const handleDeleteClick = (addressId) => {
    setAddressToDelete(addressId);
    setDeleteModalVisible(true); // Show the modal to confirm deletion
    console.log('opened',deleteModalVisible);
  };


  const confirmDeleteAddress = async () => {
    try {
      // Make API call to delete the address, passing userId in the request body
      const response = await axios.delete(`https://recycle-backend-apao.onrender.com/api/addresses/${addressToDelete}`, {
        data: { userId }, // Sending the userId in the request body
      });
  
      if (response.status === 200) {
        message.success('Address deleted successfully!');
        // Refresh the page after successful deletion
        window.location.reload(); 
        
        // Update the list of addresses after deletion
        setUserAddresses((prevAddresses) => {
          const updatedAddresses = prevAddresses.filter((addr) => addr.addressId !== addressToDelete);
          renderAddressCards(updatedAddresses); 
          return updatedAddresses;
        });
  
        setDeleteModalVisible(false); // Close the modal
      } else {
        message.error('Failed to delete the address.');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      message.error('An error occurred while deleting the address.');
    }
  };


  const handleAddressSelect = (address) => {
    setSelectedAddressId(address.addressId); // Set the selected address ID
    const { latitude, longitude } = address.location; // Get lat/lng from the address
  
    // Center the map on the selected address location
    mapInstance.current.flyTo({ center: [longitude, latitude], zoom: 18 });
  
    // Remove the previous marker if it exists
    if (marker) {
      marker.remove();
    }
  
    // Create a new marker with Lottie animation at the selected address location
    const el = document.createElement('div');
    el.innerHTML = `<iframe src="https://lottie.host/embed/25d3eb87-e995-4dec-8a25-221ab004a6bf/AkNlvbr5bz.json" style="width: 50px; height: 50px; border: none;"></iframe>`;
    const newMarker = new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(mapInstance.current);
  
    // Save the new marker to the state
    setMarker(newMarker);
  };


  // Clear the marker when isFormVisible is true
useEffect(() => {
  if (isFormVisible && marker) {
    marker.remove(); // Remove the marker if form is visible
    setMarker(null); // Clear the marker from state
  }
}, [isFormVisible, marker]);
  

  


  const handleEditAddress = (address) => {
    // Prefill the input fields with the address data for editing
    setAddressLine1(address.addressLine1);
    setAddressLine2(address.addressLine2);
    setRegion(address.city);
    setState(address.state);
    setPostalCode(address.postalCode);
    setCountry(address.country);
    setName(address.name);
    setSelectedPostOffice(address.postOffice);
    setAddressType(address.addressType);
    
    setIsFormVisible(true); // Show the form inputs
  };
  
  const handleAddNewAddress = () => {
    // Clear the input fields for adding a new address
    setSelectedAddressId(null);
    setAddressLine1('');
    setAddressLine2('');
    setRegion('');
    setState('');
    setPostalCode('');
    setCountry('');
    setName('');
    setSelectedPostOffice('');
    setAddressType('home');
    
    setIsFormVisible(true); // Show the form inputs
  };


  const handleCancel = () => {
    // Clear the input fields
    setAddressLine1('');
    setAddressLine2('');
    setRegion('');
    setState('');
    setPostalCode('');
    setCountry('');
    setName('');
    setSelectedPostOffice('');
    setAddressType('home');
    
    setIsFormVisible(false); // Hide the form inputs
  };
  
  




  // Function to render address cards with selection functionality
const renderAddressCards = () => (
  <List
    grid={{ gutter: 16, column: 1 }} // Single-column layout for addresses
    dataSource={userAddresses}  // Use userAddresses as the source of data
    renderItem={(addr) => (
      <List.Item>
        <Card
          key={addr.addressId}
          style={
            selectedAddressId === addr.addressId
              ? { ...styles.addressCard, ...styles.selectedCard }  // Apply selected styles if the card is selected
              : styles.addressCard
          }
          onClick={() => handleAddressSelect(addr)}  // Trigger handleAddressSelect when a card is clicked
          hoverable
        >
          <div style={styles.cardHeader}>
            <div style={styles.deleteIconContainer}>
              {selectedAddressId === addr.addressId && (
                <DeleteOutlined
                  onClick={() => handleDeleteClick(addr.addressId)} // Keep using handleDeleteClick
                  style={styles.deleteIcon}
                />
              )}
            </div>
          </div>
          <div style={styles.cardContent}>
            <Radio
                checked={selectedAddressId === addr.addressId}
                style={styles.radio}
              />
            <div style={styles.addressInfo}>
              <p style={styles.addressName}><strong>{addr.name}</strong></p>
              <p style={{marginBottom:'0vw'}}>{addr.addressLine1}, {addr.addressLine2}, {addr.city}, {addr.state}, {addr.country} - {addr.postalCode}</p>
              <p style={{marginBottom:'0vw'}}><strong>Type:</strong> {addr.addressType}</p>
            </div>
          </div>

          {selectedAddressId === addr.addressId && (
            <Button
              type="primary"
              onClick={() => handleEditAddress(addr)} // Use handleEditAddress instead of handleEditClick
              style={styles.editButton}
            >
              Edit
            </Button>
          )}
          {/* Modal for confirming delete action */}
        <Modal
            title="Confirm Deletion"
            open={deleteModalVisible} // Use deleteModalVisible here
            onOk={confirmDeleteAddress}
            onCancel={() => setDeleteModalVisible(false)} // Close the modal on cancel
            okText="Yes"
            cancelText="No"
            >
            <p>Are you sure you want to delete this address?</p>
        </Modal>
        </Card>
      </List.Item>
    )}
  />
);
        

  const pulseStyle = {
    width: '20px',
    height: '20px',
    border: '5px solid rgba(0, 150, 0, 0.5)',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 150, 0, 0.5)',
    position: 'absolute',
    top: 'calc(50% - 15px)', 
    left: 'calc(50% - 15px)', 
    animation: 'pulse 1.5s infinite',
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
        <div style={styles.searchContainer}>
          <Input
            placeholder="Search for area, street name"
            prefix={<SearchOutlined />}
            value={address}
            onChange={(e) => handleSearch(e.target.value)}
            style={styles.searchInput}
          />

          {/* Display suggestions as a list */}
          {suggestions.length > 0 && (
            <div style={styles.suggestionsContainer}>
              <List
                bordered
                dataSource={suggestions}
                renderItem={item => (
                  <List.Item onClick={() => handleSuggestionClick(item)}>
                    {item.place_name}
                  </List.Item>
                )}
              />
            </div>
          )}
        </div>

      <div id="map" ref={mapRef} style={styles.mapContainer}></div>

            {isFormVisible && (
              <div style={styles.centerMarker}>
                <img
                  id="marker-img" // Add an ID to target this element for animations
                  src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png"
                  alt="center marker"
                  style={{ width: '25px', height: '41px' }}
                />
              </div>
            )}


      <div style={styles.deviceLocationMarker}>
        <iframe
          src="https://lottie.host/embed/297c174f-47af-434f-9b12-fcbdfaa4fe2f/mqEBrQNLKQ.json"
          title="Device Location"
          style={{ width: '50px', height: '50px', border: 'none' }} // Adjust size as needed
        ></iframe>
      </div>



      <Button
          type="primary"
          icon={<AimOutlined />}
          onClick={handleCurrentLocation}
          disabled={!isGeolocationAvailable || !isGeolocationEnabled}
          style={{
            position: 'absolute',
            top: 'calc(100vh - 46vh)', // Position above the form div
            right: '2vw',
            zIndex: 1000,
            borderRadius: '10%', // Circular button
            width: '35vw',
            height: '8vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          Current Location
      </Button>

        {/* Form container (placed above the map) */}
        <div style={styles.formContainer}>
            {/* Conditionally render the address cards only when form is not visible */}
            {!isFormVisible && (
                <div style={styles.addressCardContainer}>
                  {renderAddressCards()}
                  <div style={styles.buttonContainer}>
                    <Button
                      type="primary"
                      onClick={handleAddNewAddress}
                      style={styles.confirmButton}
                    >
                      Add New Address
                    </Button>
                    <Button
                      onClick={() => navigate('/profile')} // Navigate to './profile'
                      style={styles.closeButton} // Use a simple style for the close button
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}


            {isFormVisible && ( // Only show the form inputs when form is visible
              <>
                <Input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => {setName(e.target.value); setErrors(prevErrors => ({ ...prevErrors, name: '' }));}}
                  style={styles.input}
                />
                {errors.name && <p style={styles.errorMessage}>{errors.name}</p>}
                <Input
                  placeholder="Address Line 1"
                  value={addressLine1}
                  onChange={(e) => {
                    setAddressLine1(e.target.value);
                    setErrors(prevErrors => ({ ...prevErrors, addressLine1: '' })); // Clear the addressLine1 error
                  }}
                  style={styles.input}
                />
                {errors.addressLine1 && <p style={styles.errorMessage}>{errors.addressLine1}</p>}
                <Input
                  placeholder="Address Line 2"
                  value={addressLine2}
                  onChange={(e) => {
                    setAddressLine2(e.target.value);
                    setErrors(prevErrors => ({ ...prevErrors, addressLine2: '' })); // Clear the addressLine1 error
                  }}
                  style={styles.input}
                />
                {errors.addressLine2 && <p style={styles.errorMessage}>{errors.addressLine2}</p>}
                <Input
                  placeholder="Pincode"
                  value={postalCode}
                  onChange={(e) => {
                    handlePostalCodeChange(e);
                    setErrors(prevErrors => ({ ...prevErrors, postalCode: '' }));
                  }}
                  style={styles.input}
                />
                {errors.postalCode && <p style={styles.errorMessage}>{errors.postalCode}</p>}
                {postOffices.length > 0 && (
                  <Select
                    placeholder="Select Post Office"
                    value={selectedPostOffice}
                    onChange={(value) => {
                      setSelectedPostOffice(value);
                      setErrors(prevErrors => ({ ...prevErrors, selectedPostOffice: '' }));
                    }}
                    style={styles.selectInput}
                  >
                    {errors.selectedPostOffice && <p style={styles.errorMessage}>{errors.selectedPostOffice}</p>}
                    {postOffices.map((office, index) => (
                      <Select.Option key={index} value={office.name}>
                        {office.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
                <div style={styles.inlineInputs}>
                  <Input
                    placeholder="Region"
                    value={city}
                    readOnly
                    style={{ ...styles.input, flex: 1 }}
                  />
                  <Input
                    placeholder="State"
                    value={state}
                    readOnly
                    style={{ ...styles.input, flex: 1 }}
                  />
                  <Input
                    placeholder="Country"
                    value={country}
                    readOnly
                    style={{ ...styles.input, flex: 1 }}
                  />
                </div>
                <Radio.Group
                  onChange={(e) => setAddressType(e.target.value)}
                  value={addressType}
                  style={styles.radioGroup}
                >
                  <Radio.Button value="home">Home</Radio.Button>
                  <Radio.Button value="office">Office</Radio.Button>
                  <Radio.Button value="shop">Shop</Radio.Button>
                  <Radio.Button value="friends">Friends</Radio.Button>
                  <Radio.Button value="others">Others</Radio.Button>
                </Radio.Group>
                <Button
                  type="primary"
                  onClick={handleConfirmLocation}
                  style={styles.confirmButton}
                  disabled={!location}
                >
                  Save Address
                </Button>
                <Button
                  type="default"
                  onClick={handleCancel}
                  style={{ ...styles.confirmButton, marginLeft: '10px' }}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>


  </div>
  );
};

const styles = {
  mapContainer: {
    width: '100%',
    height: '100vh', // Full height
    position: 'absolute', // Positioned behind form
    zIndex: 1, // Behind the form
  },

   // Form container, positioned at the bottom of the screen
  formContainer: {
    margin: '2vw',
    padding: '4vw',
    backgroundColor: '#f9f9f9', // Light gray background
    borderRadius: '15px 15px 0 0', // Rounded corners only at the top
    boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
    height: '40vh', // Takes 35% of the viewport height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around', // Evenly space out inputs
    overflowY: 'auto', // Scroll if content overflows
    gap: '10px', // Spacing between child elements
    position: 'absolute', // Positioned at the bottom of the screen
    bottom: 0, // Anchored to the bottom of the screen
    left: 0,
    right: 0,
    zIndex: 10, // Positioned above the map
  },


  input: {
    padding: '1.5vw',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)', // Inner shadow for depth
    transition: 'border-color 0.3s ease', // Smooth border color change on focus
    width: '100%',
    marginBottom: '1vw'
  },

  // Confirm location button (inside the form)
  confirmButton: {
    alignSelf: 'center',
    width: '80%',
  },

  inlineInputs: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px', // Space between the inputs
  },

  searchContainer: {
    position: 'absolute',
    top: '30px',
    width: 'calc(100% - 40px)',
    left: '20px',
    right: '20px',
    zIndex: 1000,
  },
  searchInput: {
    width: '85%',
    padding: '10px',
    borderRadius: '50px',
    border: '1px solid #ccc',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  centerMarker: {
    position: 'absolute',
    top: '40vh',
    left: '50vw',
    pointerEvents: 'none',
    zIndex: 1000,
    transition: 'transform 0.3s ease-out', // Add smooth transition for lifting/pinning effect
    transformOrigin: 'center bottom', // Ensure it pivots around the bottom
  },
  // Add keyframes for lifting and pinning animation
  '@keyframes liftMarker': {
    from: { transform: 'translateY(0px)' },
    to: { transform: 'translateY(-20px)' },
  },
  '@keyframes pinMarker': {
    from: { transform: 'translateY(-20px)' },
    to: { transform: 'translateY(0px)' },
  },

  radioGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },


  addressCard: {
    width: '100%',
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '1vw',
    display: 'flex',
    flexDirection: 'row', // Horizontal alignment
    alignItems: 'center',
    boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    justifyContent: 'flex-start', // Align items to the left
    gap: '2vw' // Add some space between radio and content
  },
  selectedCard: {
    border: '2px solid #4caf50', // Green border for the selected card
    boxShadow: '0 8px 16px rgba(0, 150, 0, 0.2)', // Extra shadow when selected
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    marginRight: '1vw', // Slight spacing between radio button and content
    color: '#4caf50', // Green color for selected radio
    flexShrink: 0, // Prevent shrinking of radio button
  },
  addressInfo: {
    display: 'flex',
    flexDirection: 'column', // Vertical alignment for address details
    textAlign: 'left', // Align the text to the left
  },
  addressName: {
    fontSize: '2vh',
    marginBottom: '2vw',
    fontWeight: 'bold', // Make the name stand out
  },
  deleteIcon: {
    position: 'absolute',
    top: '2vh',
    right: '2vh',
    zIndex: 1, // Ensures the icon is on top
    color: 'red',
  },

  errorMessage: {
    color: 'red',
    fontSize: '3vw',
    marginTop: '0.5vw',
  },


  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between', // Space out the buttons
    marginTop: '10px', // Add space between buttons and cards
  },

  closeButton: {
    backgroundColor: 'transparent', // Transparent background
    border: 'none', // No border for a minimal look
    color: '#555', // Dark gray text color
    cursor: 'pointer', // Pointer cursor for better UX
    fontSize: '1rem',
  },

  confirmButton: {
    alignSelf: 'center',
    width: '80%',
    marginRight: '10px', // Add space between the buttons
  },

  suggestionsContainer: {
    position: 'absolute',
    top: '55px',
    width: 'calc(100% - 40px)',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    zIndex: 1000,
    maxHeight: '200px',
    overflowY: 'auto',
  },
 
};

export default LocationPicker;
