import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Clipboard, CurrencyRupee, Person } from 'react-bootstrap-icons';
import styled from 'styled-components';
import MapGL, { Marker, Popup, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import Map from './mapscrapBuyer';

// Import your custom marker icons
import scrapBuyer from './scrapBuyer.png';

// Replace with your own Mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ3NhaXRlamEwMDEiLCJhIjoiY2x5a3MyeXViMDl3NjJqcjc2OHQ3NTVoNiJ9.b5q6xpWN2yqeaKTaySgcBQ';

// Replace with your backend API endpoint
const BACKEND_MAPBOX_API = 'http://localhost:8080/api/mapbox';

const ScrapBuyersList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerOrderInfo } = location.state || {}; // Receive the passed customerOrderInfo

  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [scrapBuyers, setScrapBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  // Define the state for order info expansion
  const [isOrderInfoExpanded, setIsOrderInfoExpanded] = useState(false);

  // Define the state for controlling the step view
  const [currentStep, setCurrentStep] = useState(1);

  const [errors, setErrors] = useState({});

  

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    const fetchScrapBuyers = async () => {
      try {
        // Construct the URL using route parameters for latitude and longitude
        const { latitude, longitude } = customerOrderInfo?.location || {};
        if (!latitude || !longitude) {
          throw new Error("Latitude and longitude are required");
        }

        console.log("customerOrderInfo",customerOrderInfo.location.latitude,customerOrderInfo.location.longitude)
    
        const res = await axios.get(`http://localhost:8080/api/scrap-buyers/nearby/${customerOrderInfo.location.latitude}/${customerOrderInfo.location.longitude}`);
    
        // Set the fetched scrap buyers data to state
        setScrapBuyers(res.data);
        console.log('scrapBuyers..', res.data);
      } catch (error) {
        console.error('Error fetching scrap buyers:', error);
      }
    };
    

    fetchProfileData();
    fetchScrapBuyers();
    setTimeout(() => setLoading(false), 3000);
  }, [customerOrderInfo]);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handlePriceClick = () => {
    navigate('/market-price');
  };

  const handleOrderClick = (order) => {
    navigate('/pickup-order-status', { state: { ordersInfo: order } });
  };

  const toggleOrderInfo = () => {
    setIsOrderInfoExpanded(!isOrderInfoExpanded);
  };


   const handleNextClick = () => {
    setCurrentStep(2);
  };

  const handleConfirmPickup = async () => {
    const newErrors = {};
    

    if (!customerOrderInfo.schedulePickup) newErrors.schedulePickup = 'Schedule PickUp is required';
    if (customerOrderInfo.totalWeight === 0) newErrors.totalWeight = 'Package Est. wt is required';
    if (!selectedBuyer) newErrors.buyer = 'Please select a scrap buyer.';
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  

    const req = {
      Id: customerOrderInfo.Id,
      customerId: customerOrderInfo.customerId,
      name: customerOrderInfo.name,
      contact: customerOrderInfo.contact,
      schedulePickup: customerOrderInfo.schedulePickup,
      totalWeight: customerOrderInfo.totalWeight,
      cart: customerOrderInfo.cart,
      location: {
        latitude: customerOrderInfo.location.latitude,
        longitude: customerOrderInfo.location.longitude,
        address: customerOrderInfo.selectedAddress,
      },
      status: 'Pending',
      pickupAgentId: selectedBuyer.scrapBuyerId,
      images: customerOrderInfo.images || [],
    };
  
    console.log('Request payload for placing order:', req);
  
    try {
      const res = await axios.post('http://localhost:8080/placeorder', req);
      
      if (res.status === 201) {
        alert('Order placed successfully');
  

        const updateOrderReq = {
          orderId: req.Id,
          pickupDate: customerOrderInfo.schedulePickup,
          status: 'Pending',
        };
  
        await axios.post(`http://localhost:8080/scrapBuyer/${selectedBuyer.scrapBuyerId}/updateCurrentOrders`, updateOrderReq);
  
        const pickupHistoryReq = {
          userId: customerOrderInfo.customerId,
          pickupId: req.Id,
          items: customerOrderInfo.cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          pickupDate: customerOrderInfo.schedulePickup,
          status: 'Pending',
      };
          await axios.post(`http://localhost:8080/pickupHistory/add`, pickupHistoryReq);
          console.log('Pickup history added successfully');
  

        navigate('/pickup-list', { state: { ordersInfo: req } });
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
};

  
  

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Container>
      <Map
        customerOrderInfo={customerOrderInfo}
        scrapBuyers={scrapBuyers}
        selectedBuyer={selectedBuyer}
        setSelectedBuyer={setSelectedBuyer}
        scrapBuyerIcon={scrapBuyer}
        onOrderClick={handleOrderClick}
      />

        <OrderInfoContainer isExpanded={isExpanded}>
          <DragHandle onClick={toggleExpand} />
          <p onClick={toggleExpand}>click here</p>
          {currentStep === 1 ? (
            <>
              <OrderInfo>
                <Detail><strong>ID:</strong> {customerOrderInfo?.Id}</Detail>
                <Detail><strong>Contact:</strong> {customerOrderInfo?.contact}</Detail>
                <Detail><strong>Address:</strong> {customerOrderInfo?.selectedAddress}</Detail>
                <Detail><strong>Scheduled Pickup:</strong> {customerOrderInfo?.schedulePickup}</Detail>
                <Detail><strong>Total Weight:</strong> {customerOrderInfo?.totalWeight} kg</Detail>
                <Detail><strong>Total Price:</strong> ₹{customerOrderInfo?.cart.reduce((total, item) => total + item.quantity * item.price, 0)}</Detail>
                {customerOrderInfo?.images && customerOrderInfo.images.length > 0 && (
                  <Detail>
                    <strong>Images:</strong>
                    <ImageList>
                      {customerOrderInfo.images.map((url, index) => (
                        <ImageItem key={index}>
                          <img src={url} alt={`Uploaded ${index}`} width="100" height="100" />
                        </ImageItem>
                      ))}
                    </ImageList>
                  </Detail>
                )}
                <NextButton onClick={handleNextClick}>Next</NextButton>
              </OrderInfo>
            </>
          ) : (
            <ConfirmScrapBuyer>
              <h4>Select a Scrap Buyer:</h4>
              {scrapBuyers.slice(0, 3).map((buyer) => (
                <BuyerOption key={buyer.scrapBuyerId} selected={selectedBuyer?.scrapBuyerId === buyer.scrapBuyerId}>
                  <Label1 htmlFor={buyer.scrapBuyerId}>
                      <strong>{buyer.name}</strong> - {buyer.distance.toFixed(2)} km away
                    </Label1>
                  <RadioInput
                    type="radio"
                    id={buyer.scrapBuyerId}
                    name="scrapBuyer"
                    value={buyer.scrapBuyerId}
                    onChange={() => setSelectedBuyer(buyer)}
                    checked={selectedBuyer?.scrapBuyerId === buyer.scrapBuyerId}
                  />
                </BuyerOption>
              ))}
              <ButtonWrapper>
                <BackButton onClick={() => setCurrentStep(1)}>Back</BackButton>
                <ConfirmPickupButton onClick={handleConfirmPickup}>Confirm Pickup</ConfirmPickupButton>
              </ButtonWrapper>
            </ConfirmScrapBuyer>
          )}
        </OrderInfoContainer>
        <Footer>
          <Row style={{ width: '100%', padding: '10px 0', margin: '0' }}>
            <Col style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <div onClick={handlePriceClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#5e348b', cursor: 'pointer' }}>
                <CurrencyRupee size={30} />
                <span>Market Price</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#4caf50', cursor: 'pointer' }}>
                <Clipboard size={30} />
                <span>Pick up Status</span>
              </div>
              <div onClick={handleProfileClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#5e348b', cursor: 'pointer' }}>
                <Person size={30} />
                <span>Profile</span>
              </div>
            </Col>
          </Row>
        </Footer>
    </Container>
  );
};

export default ScrapBuyersList;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  background-color: #f3f2f8;
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 100vh;
    padding-bottom: 60px;
  }
`;

const OrderInfoContainer = styled.div`
  position: fixed;
  bottom: calc(var(--footer-height, 10vh) - 1vh); /* Position 1vh less than Footer height */
  left: 0;
  width: 100vw;
  height: ${({ isExpanded }) => (isExpanded ? '80vh' : '25vh')}; /* Responsive height */
  background-color: #fff;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.15);
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transition: height 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  overflow-y: auto; /* Allow scrolling within the container */

  @media (max-width: 768px) {
    height: ${({ isExpanded }) => (isExpanded ? '85vh' : '30vh')}; /* Adjusted for tablets */
    bottom: calc(var(--footer-height, 10vh) - 1vh); /* Keep above Footer */
  }

  @media (max-width: 480px) {
    height: ${({ isExpanded }) => (isExpanded ? '80vh' : '30vh')}; /* Adjusted for mobile */
    bottom: calc(var(--footer-height, 10vh) - 1vh); /* Consistent spacing */
  }
`;

const Footer = styled.div`
  --footer-height: 10vh; /* Set the variable for Footer height */
  background-color: #fff;
  z-index: 999; /* Slightly less than OrderInfoContainer */
  width: 100vw;
  height: var(--footer-height); /* Use the defined height */
  padding: 8px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;

  
  @media (max-width: 768px) {
    padding: 6px;
  }

  @media (max-width: 480px) {
    padding: 4px;
  }
`;



const OrderInfo = styled.div`
  padding: 20px 25px;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    padding: 15px 20px;
  }

  @media (max-width: 480px) {
    padding: 10px 15px;
  }
`;

const DragHandle = styled.div`
  width: 60px;
  height: 6px;
  background-color: #ddd;
  border-radius: 3px;
  margin: 12px auto;
  cursor: ns-resize;

  @media (max-width: 480px) {
    width: 50px;
    height: 5px;
  }
`;

const Detail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  color: #4b4b4b;

  strong {
    color: #333;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const NextButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const ConfirmScrapBuyer = styled.div`
  padding: 20px 25px;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;

  h4 {
    font-size: 18px;
    color: #333;
    margin-bottom: 10px;
  }

  @media (max-width: 768px) {
    padding: 15px 20px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px 15px;
    gap: 10px;
  }
;`

const ConfirmPickupButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    padding: 8px;
    font-size: 14px;
  }
;`


const BuyerOption = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: ${({ selected }) => (selected ? '2px solid #4caf50' : '1px solid #ccc')};
  background-color: ${({ selected }) => (selected ? '#e8f5e9' : '#fff')};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: border 0.3s ease, background-color 0.3s ease;
  cursor: pointer;

  &:hover {
    border: 2px solid #4caf50;
  }

  @media (max-width: 768px) {
    padding: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
;`

const Label1 = styled.label`
  flex-grow: 1;
  font-size: 16px;
  color: #333;
  text-align: left;
  margin-right: 10px;

  strong {
    font-weight: bold;
    color: #000;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
;`

const RadioInput = styled.input`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #ccc;
  background-color: #fff;
  position: relative;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s ease, border 0.3s ease;

  &:checked {
    border-color: #4caf50;
    background-color: #fff;
  }

  &:checked::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 10px;
    background-color: #4caf50;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  &:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 22px;
    height: 22px;
    border: 2px solid #4caf50;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  &:hover {
    border-color: #4caf50;
  }

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 480px) {
    width: 16px;
    height: 16px;
  }
;`

const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  margin-top: 20px;

  @media (max-width: 768px) {
    gap: 8px;
    margin-top: 15px;
  }

  @media (max-width: 480px) {
    gap: 6px;
    margin-top: 10px;
  }
;`

const BackButton = styled.button`
  background-color: #b2beb5;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #a9a9a9;
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    padding: 8px;
    font-size: 14px;
  }
`;




const ImageList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;

  @media (max-width: 768px) {
    justify-content: space-around;
  }

  @media (max-width: 480px) {
    justify-content: space-between;
  }
`;

const ImageItem = styled.div`
  margin-right: 10px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    margin-right: 8px;
    margin-bottom: 8px;
  }

  @media (max-width: 480px) {
    margin-right: 5px;
    margin-bottom: 5px;
  }
`;

const PopupContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  font-size: 12px;

  button {
    margin-top: 5px;
    padding: 5px 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #45a049;
    }
  }

  @media (max-width: 768px) {
    font-size: 11px;

    button {
      padding: 4px 8px;
    }
  }

  @media (max-width: 480px) {
    font-size: 10px;

    button {
      padding: 3px 6px;
    }
  }
`;

