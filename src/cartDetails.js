import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DeviceIcon from './gps.png';
import PinLocationIcon from './pin.png';

import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const CartDetails = forwardRef(({ getTotalPrice, useWallet, walletAmount, getFinalAmount, usersSavedAddresses}, ref) => {
  const [cart, setCart] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAddressFormModal, setShowAddressFormModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [location, setLocation] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    const storedAddresses = localStorage.getItem('savedAddresses');
    if (storedAddresses) {
      setSavedAddresses(JSON.parse(storedAddresses));
    }
  }, []);


  useImperativeHandle(ref, () => ({
    getDetails: () => ({
      name,
      phone,
      address,
      location,
    })
  }));


  // Save cart data to localStorage whenever cart state changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);


  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const updatedCart = await Promise.all(
          cart.map(async (item) => {
            // Fetch product details using productId from the cart
            const response = await axios.get(`https://recycle-backend-apao.onrender.com/api/products/${item.productId}`);
            const productDetails = response.data;
    
            // Return updated item with fetched product details
            return {
              ...item,
              name: productDetails.name,
              price: productDetails.price,
              images: productDetails.images[0],
              greenpoints: productDetails.greenpoints,
              ecoFriendly: productDetails.ecoFriendly,
              discount: productDetails.discount,         
            };
          })
        );
        setCart(updatedCart);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    
    if (cart.length > 0) {
      fetchProductDetails(); // Call the function to fetch product details
    }
  }, [cart]);
  



  const handleSelectAddress = (addr) => {
    // Combine the address fields into a complete address string
    const fullAddress = `${addr.addressLine1}, ${addr.addressLine2 ? addr.addressLine2 + ', ' : ''}${addr.city}, ${addr.state}, ${addr.postalCode}, ${addr.postOffice}, ${addr.country}`;
  
    // Update state with selected address details
    setAddress(fullAddress);  // Combine all address parts into a single address string
    setName(addr.name);  // Set name from the selected address
    setPhone(addr.phone);  // Assuming phone number is part of the addr object
    setLocation(addr.location);  // Set the latitude and longitude from the location field
    setShowAddressModal(false);  // Close the address modal
  
    // Store selected address details in local storage
    localStorage.setItem('selectedAddress', JSON.stringify(addr));
  };
  

  const styles = {
    section: {
      margin: '2vh', // was 20px
      padding: '2vh', // was 20px
      borderWidth: '0.1vh', // separated border shorthand
      borderStyle: 'solid',
      borderColor: '#ddd',
      borderRadius: '0.8vw', // was 8px
      marginBottom: '2vh', // was 20px
      backgroundColor: 'white',
    },
    cartItem: {
      display: 'flex',
      alignItems: 'center', // Align image and text vertically
      justifyContent: 'space-between',
      padding: '1vh 0', // was 10px 0
      borderBottomWidth: '0.1vh', // separated border shorthand
      borderBottomStyle: 'solid',
      borderBottomColor: '#eee',
    },
    itemImageContainer: {
      marginRight: '1vw', // Add some margin between image and text
    },
    itemImage: {
      width: '7vw', // Small image size
      height: '7vh',
      objectFit: 'cover',
      borderRadius: '0.5vw', // was 5px
    },
    cartItemName: {
      flex: '2',
    },
    cartItemPrice: {
      flex: '1',
      textAlign: 'right',
    },
    cartItemQuantity: {
      flex: '1',
      textAlign: 'right',
    },
    billingInfo: {
      marginTop: '2vh', // was 20px
    },
    billingRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.5vh 0', // was 5px 0
    },
    billingLabel: {
      fontWeight: 'bold',
    },
    centerMarker: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -100%)',
      zIndex: '1000',
      pointerEvents: 'none',
    },
    formGroup: {
      marginBottom: '1.5vh', // was 15px
    },
    formControl: {
      width: '100%',
      padding: '1vh', // was 10px
      borderRadius: '0.5vw', // was 5px
      borderWidth: '0.1vh', // separated border shorthand
      borderStyle: 'solid',
      borderColor: '#ccc',
    },
    billingAmount: {
      fontWeight: 'bold',
    },
    addressContainer: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '1vh', // was 10px
      borderWidth: '0.1vh', // separated border shorthand
      borderStyle: 'solid',
      borderColor: '#ddd',
      borderRadius: '0.5vw', // was 5px
      marginBottom: '2vh', // was 20px
    },
    locationIcon: {
      fontSize: '1.7vh', // was 24px
      marginRight: '1vw', // was 10px
    },
    addressText: {
      fontSize: '0.9rem', // was 16px
    },
    savedAddressList: {
      display: 'flex',
      flexDirection: 'column',
    },
    savedAddressCard: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1vh', // was 10px
      borderWidth: '0.1vh', // separated border shorthand
      borderStyle: 'solid',
      borderColor: '#ddd',
      borderRadius: '0.5vw', // was 5px
      marginBottom: '1vh', // was 10px
      cursor: 'pointer',
    },
    addNewAddressCard: {
      padding: '1vh', // was 10px
      borderWidth: '0.1vh', // separated border shorthand
      borderStyle: 'solid',
      borderColor: '#ddd',
      borderRadius: '0.5vw', // was 5px
      textAlign: 'center',
      cursor: 'pointer',
      backgroundColor: '#f9f9f9',
    },
    trashIcon: {
      color: 'red',
      cursor: 'pointer',
    },
    strikeThrough: {
      textDecoration: 'line-through',
      color: 'grey',
      marginRight: '0.8vw',
    },
    discountedPrice: {
      color: 'green',
      fontWeight: 'bold',
    },
  };
  

  return (
    <section style={styles.section}>
      <h3>Cart Details</h3>
      {Array.isArray(cart) && cart.length > 0 ? (
            cart.map((item, index) => {
              const discountedPrice = item.discount ? item.price - (item.price * (item.discount / 100)) : item.price;

              return (
                <div key={index} style={styles.cartItem}>
                  <div style={styles.itemImageContainer}>
                    <img src={item.images} alt={item.name} style={styles.itemImage} />
                  </div>
                  <span style={styles.cartItemName}>{item.name}</span>
                  <span style={styles.cartItemPrice}>
                    {item.discount ? (
                      <>
                        <span style={styles.strikeThrough}>₹{item.price}</span>{' '}
                        <span style={styles.discountedPrice}>₹{discountedPrice.toFixed(2)}</span>
                      </>
                    ) : (
                      <>₹{item.price}</>
                    )}
                  </span>
                  <span style={styles.cartItemQuantity}>x{item.quantity}</span>
                </div>
              );
            })
          ) : (
            <p>Your cart is empty</p>
          )}
      <div style={styles.billingInfo}>
        <div style={styles.billingRow}>
          <span>Total:</span>
          <span>₹{getTotalPrice()}</span>
        </div>
        {useWallet && (
          <div style={styles.billingRow}>
            <span>Wallet Amount Used:</span>
            <span>₹{walletAmount}</span>
          </div>
        )}
        <div style={styles.billingRow}>
          <span style={styles.billingLabel}>Final Amount to Pay:</span>
          <span style={styles.billingLabel}>₹{getFinalAmount()}</span>
        </div>
      </div>

      <div
        style={styles.addressContainer}
        onClick={() => setShowAddressModal(true)}
      >
        <div style={styles.locationIcon}>📍</div>
        <div style={styles.addressText}>
          Deliver to: {address || 'Select an address'}
        </div>
      </div>

      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Choose Your Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={styles.savedAddressList}>
            {Array.isArray(usersSavedAddresses) && usersSavedAddresses.length > 0 ? (
                  usersSavedAddresses.map((addr, index) => (
                    <div
                      key={index}
                      style={styles.savedAddressCard}
                      onClick={() => handleSelectAddress(addr)}
                    >
                      <div>
                        <p>{addr.name}</p> 
                        <p>{`${addr.addressLine1}, ${addr.addressLine2}, ${addr.city}, ${addr.state}, ${addr.postalCode}, ${addr.postOffice}, ${addr.country}`}</p>
                        <p>{addr.addressType}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No saved addresses</p>
                )}

                  <div
                        style={styles.addNewAddressCard}
                        onClick={() => navigate('/location-picker')}
                      >
                        + Edit saved Addresses
                  </div>
          </div>
        </Modal.Body>
      </Modal>

    </section>
  );
});

export default CartDetails;
