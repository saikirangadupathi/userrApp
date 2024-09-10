import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trash, Camera, Clipboard, CurrencyRupee, Person } from 'react-bootstrap-icons';
import { Button, Form as BootstrapForm, Modal, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';
import AutionBW from './auctionBW.jpg';
import AutionColor from './auctionColor.jpg';
import scrapPickup from './scrapPickup.jpg';
import scrapPickupBW from './scrapPickupBW.jpg'

import { Form } from 'react-bootstrap';

const PickupInfo = ({ addOrder, cart, updateCart }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');

  const [selectedAddress, setSelectedAddress] = useState('');

  const [schedulePickup, setSchedulePickup] = useState('');
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [ordersInfo, setOrdersInfo] = useState('');
  const [errors, setErrors] = useState({});
  const [showLottie, setShowLottie] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [selectedContainer, setSelectedContainer] = useState(null); // null means neither is selected

  const [errormessage, setErrormessage] = useState({}); // Add this state to manage errors

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState({});
  const [savedAddresses, setSavedAddresses] = useState([
    'Gaduparthi sai teja, phase 4,madhura nagarr,nizampet,hyderabad,telangana - 500090',
    'Leo , plot no 37& 52, nizampet,hyderabad,telangana - 500090'
  ]); // Example addresses

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfileData(response.data);
          if (response.data.addresses) {
            setSavedAddresses(response.data.addresses);
          }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } 
    };
    const timer = setTimeout(() => setLoading(false), 3000);
    fetchProfileData();
    const sumWeight = cart.reduce((total, item) => total + item.quantity * 1, 0);
    const sumPrice = cart.reduce((total, item) => total + item.quantity * item.price, 0);
    setTotalWeight(sumWeight);
    setTotalPrice(sumPrice);
  }, [cart]);

  // const handleAdd = (item) => {
  //   const updatedCart = cart.map(cartItem =>
  //     cartItem.name === item.name ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
  //   );
  //   updateCart(updatedCart);
  // };

  // const handleMinus = (item) => {
  //   const updatedCart = cart.map(cartItem =>
  //     cartItem.name === item.name ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
  //   ).filter(cartItem => cartItem.quantity > 0);
  //   updateCart(updatedCart);
  // };

  const handleAdd = (item) => {
    const updatedCart = cart.map(cartItem =>
      cartItem.name === item.name && cartItem.itemId === item.itemId 
        ? { ...cartItem, quantity: cartItem.quantity + 1 } 
        : cartItem
    );
  
    const itemExists = updatedCart.some(cartItem => cartItem.name === item.name && cartItem.itemId === item.itemId);
    if (!itemExists) {
      updatedCart.push({ ...item, quantity: 1 });
    }
  
    updateCart(updatedCart);
  
    // Clear totalPrice error if the threshold is met
    const newTotalPrice = updatedCart.reduce((total, item) => total + item.quantity * item.price, 0);
    if (newTotalPrice > 1000) {
      setErrormessage((prev) => ({ ...prev, totalPrice: '' }));
    }
  };
  
  const handleMinus = (item) => {
    const updatedCart = cart.map(cartItem =>
      cartItem.name === item.name && cartItem.itemId === item.itemId 
        ? { ...cartItem, quantity: cartItem.quantity - 1 } 
        : cartItem
    ).filter(cartItem => cartItem.quantity > 0);
  
    updateCart(updatedCart);
  
    // Clear totalPrice error if the threshold is met
    const newTotalPrice = updatedCart.reduce((total, item) => total + item.quantity * item.price, 0);
    if (newTotalPrice > 1000) {
      setErrormessage((prev) => ({ ...prev, totalPrice: '' }));
    }
  };
  
  

  const handleDeleteItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    updateCart(newCart);
  };

  const handlePickUpOrder = () => {
    const newErrors = {};
    if (!schedulePickup) newErrors.schedulePickup = 'Schedule PickUp is required';
    if (totalWeight === 0) newErrors.totalWeight = 'Package Est. wt is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const customerOrderInfo = { name, contact, address, schedulePickup, totalWeight, cart };

      placeOrder();
      addOrder(customerOrderInfo);
      setOrdersInfo({ customerOrderInfo });
      setErrors({});
      setShowLottie(true);
      setTimeout(() => {
        setShowLottie(false);
        navigate('/pickup-list', { state: { ordersInfo: customerOrderInfo } });
      }, 6000);
    }
  };


  const handleInputContainerClick = (event) => {
    event.stopPropagation(); // Prevents triggering the parent onClick event
  };

  const handleToggleSelect = (container) => {
    setSelectedContainer(container);
    console.log('selectedLocation..address..',address,selectedLocation);
    setErrormessage({}); // Reset errors when a new container is selected
  };

  const handleContinue = async () => {
    // Validation checks
    const errors = {};
  
    if (totalPrice < 1000) {
      errors.totalPrice = `Please add ₹${1000 - totalPrice} more to continue.`;
    }
  
    if (!schedulePickup) {
      errors.schedulePickup = 'Please select a schedule for pickup.';
    }
  
    if (!selectedAddress) {
      errors.address = 'Please select an address.';
    }
  
    if (Object.keys(uploadedImages).length === 0) {
      errors.uploadedImages = 'Please upload at least one image.';
    }
  
    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      setErrormessage(errors);
      return; // Prevent the continuation
    }
  
    // Proceed if no errors
    const Id = `pickId${new Date().getTime()}`;
    const form = { Id, selectedAddress, schedulePickup, totalWeight, cart };
  
    // Upload images first
    const imageUploadPromises = Object.values(uploadedImages).map(file => uploadImage(file));
    const imageUrls = await Promise.all(imageUploadPromises);
  
    form.images = imageUrls.filter(url => url !== null); // Filter out any failed uploads
  
    
    const { latitude, longitude } = selectedLocation;
    form.location = {
        latitude: latitude,
        longitude: longitude,
        address: selectedAddress,
    };
    form.status = 'scheduled';
    
    form.name = profileData.name;
    form.customerId = profileData.id;  // Fixed customerId field
    form.contact = profileData.contactNumber;
    console.log('customerinfoform..', form);
  
    // Now navigate to ScrapBuyersList and pass the form data
    navigate('/ScrapBuyersList', { state: { customerOrderInfo: form } });
  };
  
  
  



  const handleHomeClick = () => {
    const customerOrderInfo = { name, contact, selectedAddress, schedulePickup, totalWeight, cart };
    navigate('/market-price', { state: { ordersInfo: customerOrderInfo } });
  };

  async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post('http://localhost:8080/upload', formData);
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading the file', error);
      return null;
    }
  }

  async function placeOrder() {
    const Id = `pickId${new Date().getTime()}`;
    const form = { Id, address, schedulePickup, totalWeight, cart };

    // Upload images first
    const imageUploadPromises = Object.values(uploadedImages).map(file => uploadImage(file));
    const imageUrls = await Promise.all(imageUploadPromises);

    form.images = imageUrls.filter(url => url !== null); // Filter out any failed uploads


   
    form.location = {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        address: selectedAddress,
    }
    form.status = 'scheduled';
    
    form.Id = Id;
    form.name = profileData.name;
    form.customerId = profileData.id;  // Fixed customerId field
    form.contact = profileData.contactNumber;
    console.log('form..', form);
    try {
      if (form) {
        const res = await axios.post('http://localhost:8080/placeorder', form);
        if (res.status === 201) {
          // Update pickupHistory
          const pickupHistoryReq = {
            userId: form.customerId,
            pickupId: form.Id,
            items: form.cart.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
            pickupDate: form.schedulePickup,
            status: 'Scheduled',
        };
          await axios.post(`http://localhost:8080/pickupHistory/add`, pickupHistoryReq);
          console.log('Pickup history added successfully');

          const pickupHistoryData = { Id: form.Id, cart: form.cart };
          await axios.post('http://localhost:8080/api/updatePickupHistory', pickupHistoryData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  }

  const handleImageUpload = (item, event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImages(prevState => ({
        ...prevState,
        [item.name]: file,
      }));
      setErrormessage((prev) => ({ ...prev, uploadedImages: '' })); // Clear the uploadedImages error
    }
    console.log(`Uploading image for ${item.name}`, file);
  };
  

  const openCamera = (item) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.capture = 'camera';
    fileInput.onchange = (e) => handleImageUpload(item, e);
    fileInput.click();
  };

  const styles = {
    lottieFullScreen: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      zIndex: 9999,
    },
    iframePlayer: {
      width: '100%',
      height: '100%'
    }
  };

  return (
    <>
      {showLottie && (
        <div style={styles.lottieFullScreen}>
          <iframe 
            src="https://lottie.host/embed/53bb3da5-9633-4e4e-aa40-6bb8e175ad34/utGraX6uT3.json?loop=false&autoplay=true"
            style={styles.iframePlayer}
            title="Order Confirmation Animation"
          ></iframe>
        </div>
      )}
      {!showLottie && (
        <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>&lt;</BackButton>
        </Header>
        {cart.length > 0 ? (
              <ItemList>
                {cart.map((item, index) => (
                  <Item key={index} style={{ minWidth: '250px', flex: '1 0 200px', height: '300px', position: 'relative' }}>
                    <DeleteIcon onClick={() => handleDeleteItem(index)}>
                      <Trash size={20} />
                    </DeleteIcon>
                    <ItemImage src={item.imageUrl} alt={item.name} />
                    <ItemInfo>
                      <ItemCategory>{item.name}</ItemCategory>
                      <ItemWeight>{item.quantity} x ₹{item.price}/KG</ItemWeight>
                      <ButtonGroup>
                        <Button onClick={() => handleMinus(item)} style={{ backgroundColor: 'white', color: 'black', borderColor: '#f5f5f5' }}>-</Button>
                        <span>{item.quantity}</span>
                        <Button onClick={() => handleAdd(item)} style={{ backgroundColor: 'white', color: 'black', borderColor: '#f5f5f5' }}>+</Button>
                      </ButtonGroup>
                    </ItemInfo>
                    <UploadButtonGroup>
                      <Button onClick={() => openCamera(item)} style={{ backgroundColor: 'white', color: 'black', borderColor: '#f5f5f5' }}>
                        <Camera />
                      </Button>
                      <Button>
                        <label htmlFor={`upload-${index}`} style={{ cursor: 'pointer' }}>
                          Upload Image
                        </label>
                        <input id={`upload-${index}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(item, e)} />
                      </Button>
                    </UploadButtonGroup>
                  </Item>
                ))}
              </ItemList>
            ) : (
              <EmptyCartMessage>
                Your pickup cart is empty, <AddItemsText>add items for booking a pickup.</AddItemsText>
              </EmptyCartMessage>
            )}

        <AddMoreItemsButton onClick={() => navigate('/market-price')}>
          + Add More Items
        </AddMoreItemsButton>
        
        {cart.length > 0 && (
            <Billing>
              <BillingRow>
                <BillingLabel>Total Est. Weight:</BillingLabel>
                <BillingValue>{totalWeight} kg</BillingValue>
              </BillingRow>
              <BillingRow>
                <BillingLabel>Total Price:</BillingLabel>
                <BillingValue>₹{totalPrice}</BillingValue>
              </BillingRow>
            </Billing>
          )}

          <StyledForm>
              <Label><strong>Schedule PickUp</strong></Label>
              <Input
                  type="date"
                  value={schedulePickup}
                  onChange={(e) => {
                    setSchedulePickup(e.target.value);
                    setErrormessage((prev) => ({ ...prev, schedulePickup: '' }));
                  }}
                  min={new Date().toISOString().split('T')[0]} // Set the min attribute to today's date
                />
              {errormessage.schedulePickup && <Error>{errormessage.schedulePickup}</Error>}
            <AddressContainer onClick={() => setShowModal(true)}>
              <LocationIcon>📍</LocationIcon>
              <AddressText>To: {selectedAddress || "Select an address"}</AddressText>
            </AddressContainer>
            {errormessage.address && <Error>{errormessage.address}</Error>}
          </StyledForm>
        <>
            {selectedContainer === 'formCheck' && totalPrice < 1000 && (
                  <p style={{ color: 'red' }}>
                    Please add ₹{1000 - totalPrice} more to place the order.
                  </p>
                )}
            {errormessage.uploadedImages && <Error>{errormessage.uploadedImages}</Error>}
              <StyledFormCheck
                isSelected={selectedContainer === 'formCheck'}
                onClick={() => handleToggleSelect('formCheck')}
              >
                {selectedContainer === 'formCheck' && (
                  <InputContainer onClick={handleInputContainerClick}>
                    <StyledPara>Find Nearby Buyers</StyledPara>
                    <StyledInput type="text" placeholder="Enter Your Price: ₹" />
                      <StyledButton onClick={handleContinue}>Continue</StyledButton>
                  </InputContainer>
                )}
              </StyledFormCheck>

              {selectedContainer === 'pickUp' && totalPrice <= 150 && (
                  <p style={{ color: 'red' }}>
                    Please add ₹{150 - totalPrice} more to place the order.
                  </p>
                )}

              <StyledPickUpContainer
                isSelected={selectedContainer === 'pickUp'}
                onClick={() => handleToggleSelect('pickUp')}
              >
                {selectedContainer === 'pickUp' && (
                  <PickUpButton onClick={handlePickUpOrder} disabled={selectedContainer === 'formCheck'}>
                    Pick Up Order
                  </PickUpButton>
                )}
              </StyledPickUpContainer>
            </>
        <Row style={{ position: 'fixed', bottom: '0', width: '100%', backgroundColor: '#eaeaea', padding: '10px 0', margin: '0' }}>
          <Col style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div onClick={handleHomeClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#4caf50', cursor: 'pointer' }}>
              <CurrencyRupee size={30} />
              <span>Market Price</span>
            </div>
            <div onClick={() => navigate('/pickup-list')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#5e348b', cursor: 'pointer' }}>
              <Clipboard size={30} />
              <span>Pick up Status</span>
            </div>
            <div onClick={() => navigate('/account')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#5e348b', cursor: 'pointer' }}>
              <Person size={30} />
              <span>Profile</span>
            </div>
          </Col>
        </Row>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Choose Your Location</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <SavedAddressList>
                {savedAddresses.map((addr, index) => (
                  <SavedAddressCard
                    key={index}
                    onClick={() => {
                      setSelectedAddress(`${addr.name}, ${addr.addressLine1},${addr.addressLine2}, ${addr.city}, ${addr.state},${addr.country}, ${addr.postalCode}`);
                      setShowModal(false);
                      setSelectedLocation(addr.location);
                      setErrormessage((prev) => ({ ...prev, address: '' })); // Clear the address error
                    }}
                  >
                    <SavedAddressCardContent>
                      <strong>{addr.name}</strong><br />
                      {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}{addr.city}, {addr.state} - {addr.postalCode}, {addr.country}
                    </SavedAddressCardContent>
                  </SavedAddressCard>
                ))}
                <AddNewAddressCard onClick={() => navigate('/location-picker')}>
                  + Edit Your saved Addresses Info
                </AddNewAddressCard>
              </SavedAddressList>
              {errormessage.address && <Error>{errormessage.address}</Error>}
            </Modal.Body>
          </Modal>

      </Container>
      )}
    </>
  );
};

export default PickupInfo;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  min-height: 100vh;
  width: 100%;
  padding: 5%;
  box-sizing: border-box;
  position: relative;
  margin-bottom: 200px;
`;



const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
`;

const StyledFormCheck = styled.div`
  padding: 4vw;
  background-image: ${({ isSelected }) =>
    isSelected ? `url(${AutionColor})` : `url(${AutionBW})`};
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 10px;
  margin-bottom: 4vw;
  position: relative;
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center;    /* Center vertically */
  height: 20vh; /* You can adjust the height as needed */
  width: 100%;
  cursor: pointer;
  border: ${({ isSelected }) => (isSelected ? '5px solid #70d487' : 'none')}; /* Add solid border if selected */
  transition: border 0.3s ease, background-image 0.3s ease; /* Smooth transition for border and background */
`;

const StyledPickUpContainer = styled.div`
  padding: 20px;
  background-image: ${({ isSelected }) =>
    isSelected ? `url(${scrapPickup})` : `url(${scrapPickupBW})`};
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 10px;
  margin-bottom: 20px;
  position: relative;
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  height: 200px; /* Adjust the height as needed */
  width: 100%;
  cursor: pointer;
  border: ${({ isSelected }) => (isSelected ? '5px solid #70d487' : 'none')};
  transition: border 0.3s ease, background-image 0.3s ease;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
`;

const StyledInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 2px solid #ccc;
  width: 100%;
`;

const StyledButton = styled(Button)`
  padding: 10px 20px;
  border-radius: 15px;
  background-color: #28a745;
  border: none;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #159432;
  }
`;

const StyledPara = styled.p`
  background-color:  rgba(33, 136, 56, 0.8);
  color: white;
  border-radius: 8px;
  margin: 5% 0;
  width: 100%;
  font-size: 2vw;
  font-weight: bold;
`;


const EmptyCartMessage = styled.p`
  font-size: 0.9rem;
  text-align: center;
  margin: 20px 0;
  padding: 4vw;
  color: #555;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  font-weight: bold;
`;

const AddItemsText = styled.span`
  color: #4caf50;
  text-decoration: underline;
`;


const StyledForm = styled.div`
  padding: 5%;
  background-color: #ddd;
  border-radius: 8px;
  margin: 5% 0;
  width: 100%;
`;
const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem; /* Adjusted font size */
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem; /* Adjusted padding */
  margin-bottom: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 0.875rem; /* Adjusted font size */
`;

const DisplayWeight = styled.div`
  width: 100%;
  padding: 0.5rem; /* Adjusted padding */
  margin-bottom: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
  text-align: center;
  font-size: 0.875rem; /* Adjusted font size */
`;

const AddMoreItemsButton = styled.button`
  color: #3d85c6;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin: 0 0;
  position: absolute;
  right: 5%;
`;

const ItemList = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding: 5%;
  background-color: #ddd;
  border-radius: 8px;
  margin: 5% 0;
  width: 100%;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  background-color: #fff;
  flex: 1 0 200px; /* Makes the item flexible with a minimum width of 200px */
  height: 300px; /* Increased height */
  position: relative; /* For positioning the delete icon */
`;

const DeleteIcon = styled.div`
  color: red;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const ItemImage = styled.img`
  width: 150px;
  height: 100px;
  border-radius: 4px;
  object-fit: cover;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.5rem;
`;

const ItemCategory = styled.div`
  font-size: 1rem;
  font-weight: bold;
`;

const ItemWeight = styled.div`
  font-size: 1rem;
  margin-top: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`;

const UploadButtonGroup = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  gap: 10px; /* Add space between buttons */
`;

const Billing = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  font-size: 1.2rem;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const BillingRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.5rem;
`;

const BillingLabel = styled.div`
  color: #555;
  font-weight: 600;
`;

const BillingValue = styled.div`
  color: #333;
  font-weight: 700;
  text-align: right;
`;

const PickUpButton = styled(Button)`
  padding: 10px 20px;
  border-radius: 15px;
   background-color: rgba(33, 136, 56, 0.8);;
  border: 1px solid #70d487;
  color: white;
  cursor: pointer;

  &:hover {
    background-color:  rgba(112, 212, 135, 0.8);
    border: 1px solid #70d487;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
`;

const FooterButton = styled.button`
  background: none;
  border: none;
  color: #4b0082;
  font-size: 1.125rem;
  cursor: pointer;
`;

const Error = styled.div`
  color: red;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const LocationIcon = styled.div`
  margin-right: 10px;
  font-size: 1.5rem;
`;

const AddressText = styled.div`
  font-size: 1rem;
`;

const SavedAddressList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: auto;
  white-space: nowrap;
  padding: 10px;
  background-color: #ddd;
  border-radius: 8px;
  margin: 10px 0;
  min-height: 15vh;
`;

const SavedAddressCard = styled.div`
  display: flex;
  align-items: center;
  width: 70vw;
  justify-content: center;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-right: 10px;
  cursor: pointer;
  min-width: 60vw;
  height: 10vh; /* Adjust height as needed */
  overflow: hidden; /* Hide overflow text */
  text-overflow: ellipsis; /* Add ellipsis for overflow text */
  white-space: nowrap; /* Prevent text wrapping */
`;

const SavedAddressCardContent = styled.p`
  overflow: hidden; /* Hide overflow text */
  text-overflow: ellipsis; /* Add ellipsis for overflow text */
  white-space: nowrap; /* Prevent text wrapping */
  margin: 0; /* Remove default margin */
  padding: 0; /* Remove default padding */
  width: 90vw;
`;

const AddNewAddressCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-right: 10px;
  cursor: pointer;
  max-width: 70vw;
  color: green;
`;
