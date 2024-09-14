import React, { useState,useRef, useEffect } from 'react';

import styled, { keyframes } from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import BackArrow from './back.png';

import mapboxgl from 'mapbox-gl';


import Support from './support.png';

import Expand from './expand.png';

import { ArrowsFullscreen } from 'react-bootstrap-icons';

import OrderDetails6 from './pickupStatus';
import L from 'leaflet';

import { Card, Button, Collapse } from 'react-bootstrap'; // Bootstrap components for better UI
import { Phone, ChatDots } from 'react-bootstrap-icons'; // Icons from Bootstrap

const mapboxAccessToken = 'pk.eyJ1IjoiZ3NhaXRlamEwMDEiLCJhIjoiY2x5a3MyeXViMDl3NjJqcjc2OHQ3NTVoNiJ9.b5q6xpWN2yqeaKTaySgcBQ';

const truckIconUrl = './truck.jpg';







const PickupOrderStatus = ({ cancelOrder }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);


  const location = useLocation();
  const navigate = useNavigate();
  const orderInfo = location.state?.ordersInfo || {
    packageId: '12345',
    name: 'John Doe',
    totalWeight: 10,
    cart: [{ name: 'Paper', quantity: 5, price: 10 }, { name: 'Plastic', quantity: 5, price: 20 }],
    status: 'scheduled',
    schedulepickup: '2023-08-01'
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  // const [customerLocation, setCustomerLocation] = useState(null);
  // const [agentLocation, setAgentLocation] = useState(null);
  // const [routeData, setRouteData] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');

  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const [pickupAgent, setPickupAgent] = useState(null);
  const [pickupInstructions, setPickupInstructions] = useState('');
  const [needHelp, setNeedHelp] = useState('');


  const [isAgentExpanded, setIsAgentExpanded] = useState(false);
  const [isOrderExpanded, setIsOrderExpanded] = useState(false);

  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const [customerLocation, setCustomerLocation] = useState([37.7749, -122.4194]);
  const [orderDestination,setOrderDestination] = useState([]);
  const [agentLocation, setAgentLocation] = useState([37.7749, -122.4195]);
  const [routeData, setRouteData] = useState(null);

  const [isSmallMapContainer,setIsSmallMapContainer] = useState(false);


  const toggleOrderExpand = () => setIsOrderExpanded(!isOrderExpanded);


  const toggleAgentExpand = () => setIsAgentExpanded(!isAgentExpanded);

  const toggleMapExpand = () => setIsMapExpanded(prev => !prev);


  

  const toggleSupportModal = () => {
    setIsSupportModalOpen(!isSupportModalOpen);
  };

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await axios.get(`https://recycle-backend-apao.onrender.com/api/order-status/${orderInfo.Id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setOrderStatus(response.data.status);
        console.log('status',response.data.status);
        const {latitude, longitude }= response.data.location;
        setCustomerLocation([ latitude, longitude]);
      } catch (error) {
        console.error('Error fetching order status:', error);
      }
    };
    fetchOrderStatus();
  }, [orderInfo.Id]);

  useEffect(() => {
    const fetchPickupAgent = async () => {
      try {
        const res = await axios.get(`https://recycle-backend-apao.onrender.com/api/scrap-buyers/${orderInfo.pickupAgentId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPickupAgent(res.data);
        
      } catch (error) {
        console.error('Error fetching pickup agent:', error);
      }
    };
  
    fetchPickupAgent();
  }, [orderInfo.pickupAgentId]);
  

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCustomerLocation([latitude, longitude]);

      const agentLat = latitude + 0.018;
      const agentLng = longitude;
      setAgentLocation([agentLat, agentLng]);
    });
  }, []);


  // useEffect(() => {
  //   if (isMapExpanded && mapRef.current) {
  //     mapRef.current.resize();
  //   }
  // }, [isMapExpanded]);

  // Fetch route and update bounds
  useEffect(() => {
    if (customerLocation && agentLocation) {
      const fetchRoute = async () => {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${customerLocation[1]},${customerLocation[0]};${agentLocation[1]},${agentLocation[0]}?geometries=geojson&access_token=${mapboxAccessToken}`;
        try {
          const response = await axios.get(url);
          setRouteData(response.data.routes[0].geometry);
        } catch (error) {
          console.error('Error fetching route data:', error);
        }
      };
      fetchRoute();
    }
  }, [customerLocation, agentLocation]);

  useEffect(() => {
    if (agentLocation && customerLocation) {
        const bounds = [
            [Math.min(agentLocation[1], customerLocation[1]), Math.min(agentLocation[0], customerLocation[0])], // SW corner
            [Math.max(agentLocation[1], customerLocation[1]), Math.max(agentLocation[0], customerLocation[0])], // NE corner
        ];
        mapRef.current?.fitBounds(bounds, {
            padding: 50, // Adjust padding to your preference
        });
    }
}, [agentLocation, customerLocation]);

  const handlePickUpClick = () => {
    navigate('/market-price', { state: { ordersInfo: orderInfo } });
  };

  const handleCancelOrder = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmCancelOrder = async () => {
    try {
      await axios.delete(`https://recycle-backend-apao.onrender.com/api/order/${orderInfo.Id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      cancelOrder(orderInfo.Id);
      setIsConfirmModalOpen(false);
      setShowAnimation(true); // Show the animation

      setTimeout(() => {
        setShowAnimation(false); // Hide the animation after 4 seconds
        navigate('/pickup-list');
      }, 4000);
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to cancel the order. Please try again.');
    }
  };

  const handleTrackOrderClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const isCompleted = (status) => {
    const statusOrder = ['scheduled', 'approved', 'Pending', 'in Progress', 'completed'];
    return statusOrder.indexOf(orderStatus) >= statusOrder.indexOf(status);
  };

  const calculateTotalPrice = () => {
    return orderInfo.cart.reduce((total, item) => total + item.quantity * item.price, 0);
  };



  const handleMapLoad = (event) => {
    const map = event.target; // Access the actual Mapbox map instance
  
    // Add customer marker
    new mapboxgl.Marker({ color: '#5D3FD3' })
      .setLngLat([customerLocation[1], customerLocation[0]])
      .addTo(map);
  
    // Add truck marker for the agent location
    const el = document.createElement('div');
    el.style.backgroundImage = `url(https://gadupathi.s3.ap-south-1.amazonaws.com/truck.jpg)`;
    el.style.width = '32px';
    el.style.height = '32px';
    el.style.backgroundSize = 'cover';
    el.style.borderRadius = '50%';
    el.style.cursor = 'pointer';
  
    new mapboxgl.Marker(el)
      .setLngLat([agentLocation[1], agentLocation[0]])
      .addTo(map);
  
    // Check if route source exists, if not, add it
    if (!map.getSource('route')) {
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: routeData,
        },
      });
  
      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#888',
          'line-width': 6,
        },
      });
    }
  };
  
  




  // Define the custom truck icon
const truckIcon = new L.Icon({
  iconUrl: truckIconUrl,
  iconSize: [20, 20], // Set the size of the icon
  iconAnchor: [16, 32], // Anchor the icon (half of iconSize for centered icon)
  popupAnchor: [0, -32], // Position where popups should appear
});


const MapContainer = () => (
  <LargeMapContainer ref={mapContainerRef} expanded={isMapExpanded}>
    <Map
      ref={mapRef}
      initialViewState={{
        latitude: customerLocation[0],
        longitude: customerLocation[1],
        zoom: isMapExpanded ? 13 : 14,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      mapboxAccessToken={mapboxAccessToken}
      onLoad={handleMapLoad} // Add onLoad here
    >
      {/* Customer Marker */}
      <Marker latitude={customerLocation[0]} longitude={customerLocation[1]} color="#5D3FD3" />

      {/* Agent Location Marker */}
      {agentLocation && (
        <Marker latitude={agentLocation[0]} longitude={agentLocation[1]}>
          <div
            style={{
              backgroundImage: `url(${truckIconUrl})`,
              width: '32px',
              height: '32px',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </Marker>
      )}

      {/* Route Layer */}
      {routeData && (
        <Source id="route" type="geojson" data={routeData}>
          <Layer
            id="route"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{ 'line-color': '#888', 'line-width': 6 }}
          />
        </Source>
      )}
    </Map>

    {isMapExpanded && <CloseButton onClick={toggleMapExpand}>Close</CloseButton>}
  </LargeMapContainer>
);

  

  return (
    <Container>
      {showAnimation && (
        <FullScreenAnimation>
          <iframe
            src="https://lottie.host/embed/b28a773d-db49-4d4f-828c-e1ba9de2dd83/ZyFCAHwfO1.json?loop=false&autoplay=true"
            width="100%"
            height="100%"
            frameBorder="0"
            title="Lottie Animation"
          ></iframe>
        </FullScreenAnimation>
      )}
      <Content>
        <Header>
          <StyledBackArrow src={BackArrow} alt="Back" onClick={() => navigate(-1)} />
          <SupportIcon src={Support} alt="Support" onClick={toggleSupportModal} />
        </Header>
            {!isMapExpanded && (
                  <OrderDetails6 />
            )}

            {isMapExpanded && (
              <div>
                  {<MapContainer expanded={isMapExpanded} />}
              </div>
            )}

          <StyledCard>
          <Card.Header>
            {/* Conditionally render based on the presence of pickupAgent */}
            {pickupAgent ? (
              <>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <ProfileImage
                      src={pickupAgent?.profileImage || 'default-profile.png'}
                      alt="Pickup Agent"
                    />
                    <Card.Title style={{ marginLeft: 'auto',fontSize:'3vw' }}>
                      {pickupAgent?.name || 'N/A'}
                    </Card.Title>
                    {!isMapExpanded && (
                          <div style={{ marginLeft: '20vw', marginRight: '0' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                              <ExpandButton onClick={toggleMapExpand}>
                                <ArrowsFullscreen size={18} />
                              </ExpandButton>
                            </div>
                              <MapContainer expanded={isMapExpanded} />
                          </div>
                      )}                                                                                                                                                                                            
                  </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                      <AgentInfo>
                        <ContactIcons>
                          <Button
                            variant="outline-primary"
                            onClick={() => window.location.href = `tel:${pickupAgent?.contact?.phone}`}
                          >
                            <Phone />
                          </Button>
                          <Button
                            variant="outline-success"
                            onClick={() => window.location.href = `sms:${pickupAgent?.phone}`}
                          >
                            <ChatDots />
                          </Button>
                        </ContactIcons>
                      </AgentInfo>
                      <ToggleButton style={{ marginLeft: 'auto' }} onClick={toggleAgentExpand}>
                        {isAgentExpanded ? 'Less' : 'More'}
                      </ToggleButton>
                    </div>
                    <Collapse in={isAgentExpanded}>
                      <Card.Body>
                        <Card.Text>{pickupAgent?.location?.address || 'N/A'}</Card.Text>
                        <Detail><strong>Reviews:</strong> {pickupAgent?.reviews || 'N/A'}</Detail>
                        <Detail><strong>Operational Hours:</strong> {pickupAgent?.operationalHours || 'N/A'}</Detail>
                      </Card.Body>
                    </Collapse>
                  </>
                ) : (
                  // Display message when the pickup agent is not assigned
                  <Card.Body>
                    <Card.Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'gray' }}>
                      Pickup agent is not yet assigned for Your order.
                    </Card.Text>
                  </Card.Body>
                )}
              </Card.Header>
            </StyledCard>


          <PickupInstructionsContainer>
            <SectionHeader>Pickup Instructions</SectionHeader>
            <InstructionsInput
              type="text"
              value={pickupInstructions}
              onChange={(e) => setPickupInstructions(e.target.value)}
              placeholder="Enter any special instructions for pickup"
            />
            <SectionHeader>Need Help?</SectionHeader>
            <NeedHelpInput
              type="text"
              value={needHelp}
              onChange={(e) => setNeedHelp(e.target.value)}
              placeholder="Describe your issue or question"
            />
          </PickupInstructionsContainer>


          
              {/* Updated OrderDetails */}
      <StyledCard>
        <Card.Header>
          <div style={{display:'flex',flexDirection:'row',alignItems: 'center', width: '100%' }}>
            <Card.Title>Order Details</Card.Title>
            <ToggleButton style={{ marginLeft: 'auto'}} onClick={toggleOrderExpand}>{isOrderExpanded ? 'Less' : 'More'}</ToggleButton>
          </div>
          <Card.Text>Package Weight: {orderInfo.totalWeight || 'N/A'} kg</Card.Text>
          <Detail>Customer: {orderInfo.name || 'N/A'}</Detail>
            <Detail>Order Status: {orderInfo.status || 'N/A'}</Detail>
            <Detail>Scheduled Pickup: {orderInfo.schedulePickup || 'N/A'}</Detail>
        </Card.Header>
        <Collapse in={isOrderExpanded}>
          <Card.Body>

          <PickupSummary>
                <SectionHeader>Pickup Summary</SectionHeader>
                <MaterialsContainer>
                  <MaterialsHeader>Materials:</MaterialsHeader>
                  <MaterialsList>
                    {orderInfo.cart?.map((item, index) => (
                      <MaterialItem key={index}>
                        {item.name} - {item.quantity} x ₹{item.price} = ₹{item.quantity * item.price}
                      </MaterialItem>
                    )) || 'N/A'}
                  </MaterialsList>
                  <TotalPrice>Total: ₹{calculateTotalPrice()}</TotalPrice>
                </MaterialsContainer>
              </PickupSummary>

          </Card.Body>
        </Collapse>
      </StyledCard>

      </Content>
      {/* <Footer>
        <FooterButton onClick={handlePickUpClick}>Market price</FooterButton>
        <FooterButton onClick={handleTrackOrderClick}>Track Your Pickup</FooterButton>
      </Footer> */}
      <SupportModalContainer
        isOpen={isSupportModalOpen}
        onRequestClose={toggleSupportModal}
        contentLabel="Support Options"
        style={{
          overlay: {
            backgroundColor: 'transparent',
          },
          content: {
            top: '50px',
            right: '10px',
            bottom: 'auto',
            left: 'auto',
            transform: 'none',
            padding: '0',
            width: '150px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <ModalOption onClick={() => { /* Handle Help click */ }}>Help</ModalOption>
        <ModalOption onClick={handleCancelOrder}>Cancel Order</ModalOption>
      </SupportModalContainer>
      
      <Modal
        isOpen={isConfirmModalOpen}
        onRequestClose={handleCloseConfirmModal}
        contentLabel="Confirm Cancel Order"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            padding: '10px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            backgroundColor: '#f9f9f9',
            border: 'none',
          },
        }}
      >
        <ConfirmText>Are you sure you want to cancel this order?</ConfirmText>
        <ButtonContainer>
          <ConfirmButton onClick={confirmCancelOrder}>Yes</ConfirmButton>
          <CancelButton onClick={handleCloseConfirmModal}>No</CancelButton>
        </ButtonContainer>
      </Modal>
    </Container>
  );
};

export default PickupOrderStatus;




const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  background: linear-gradient(135deg, #f3f2f8 0%, #e0e0e0 100%);
  padding: 5vh 4vw;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  overflow-y: auto;
  padding-bottom: 10vh;
`;

const Header = styled.div`
  display: flex;
  min-height: 5vh;
  justify-content: space-between;
  width: 100%;
  padding: 1vh 0;
  position: fixed;
  top: 0;
  background: linear-gradient(135deg, #b29dfa 0%, #6149b3 100%);
  padding: 1vh 0;
  box-shadow: 0 -1vh 3vh rgba(0, 0, 0, 0.3);
  z-index: 1100;
`;

const SupportIcon = styled.img`
  width: 6vw;
  height: 6vw;
  margin-right: 2vw;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const SupportModalContainer = styled(Modal)`
  position: absolute;
  top: 7vh;
  right: 2vw;
  background-color: white;
  border-radius: 2vw;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 3vh;
  width: 35vw;
  z-index: 1000;
`;

const ModalOption = styled.div`
  padding: 2vh;
  font-size: 3.5vw;
  cursor: pointer;
  color: #333;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #ddd;
  }
`;

const StyledBackArrow = styled.img`
  width: 6vw;
  height: 6vw;
  margin-left: 2vw;
  color: whitesmoke;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const pulsate = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const StatusContainer = styled.div`
  background-color: #ffffff;
  border-radius: 2vw;
  box-shadow: 0 2vh 4vh rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 90vw;
  padding: 3vh;
  margin-top: 2vh;
`;

const PackageId = styled.div`
  font-size: 3.5vw;
  font-weight: bold;
  margin-bottom: 1vh;
  color: #333;
`;

const StatusList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2vh 0;
`;

const StatusItem = styled.div`
  font-size: 3.5vw;
  color: ${props => (props.$completed ? '#4caf50' : '#bbb')};
  position: relative;
  padding-left: 3vw;
  margin-bottom: 2vh;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 1vh;
    width: 5vw;
    height: 5vw;
    border-radius: 50%;
    background-color: ${props => (props.$completed ? '#4caf50' : '#bbb')};
    box-shadow: 0 1vh 2vh rgba(0, 0, 0, 0.2);
  }

  &:after {
    content: '';
    position: absolute;
    left: 2.5vw;
    top: 6vh;
    width: 0.5vw;
    height: 8vh;
    background-color: ${props => (props.$completed ? '#4caf50' : '#bbb')};
    display: ${props => (props.$completed ? 'block' : 'none')};
  }

  &:last-child:after {
    display: none;
  }
`;


const ExpandButton = styled.button`
  background: none;
  border: none;
  color: black;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease-in;

  &:hover {
    color: #388e3c;
  }

  &:focus {
    outline: none;
  }
`;

const StyledCard = styled(Card)`
  margin: 2vw 0;
  width: 90vw;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transform: translateY(-5px);
  }

  .card-header {
    display: flex;
    flex-direction: column; /* Change to column layout */
    align-items: flex-start; /* Align items to the start */
    padding: 20px;
    background-color: #f8f9fa;
  }

  .card-body {
    padding: 20px;
  }
`;

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
`;

const AgentInfo = styled.div`
  flex: 1;
`;


const LargeMapContainer = styled.div`
    position: relative;
    width: ${({ expanded }) => expanded ? '80vw' : '90px'};
    height: ${({ expanded }) => expanded ? '60vh' : '10vh'};
    margin: ${({ expanded }) => expanded ? '0 auto' : '0'};
    border-radius: 15px;
    transition: all 0.3s ease;
    z-index: ${({ expanded }) => expanded ? 500 : 1};
    overflow: hidden;
`;
const CloseButton = styled.button`
    position: absolute;
    top: 3vh;
    right: 4vw;
    background: #fff;
    border: none;
    border-radius: 10%;
    width: 14vw;
    height: 2vh;
    padding: 4vw;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:before {
        content: '✕';
        color: #333;
        font-size: 4vw;
    }
`;

const Detail = styled.p`
  font-size: 16px;
  color: #555;
`;

const ToggleButton = styled(Button)`
  display: flex;
  align-items: center;
  right: 0;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #b29dfa 0%, #6149b3 100%);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 2vw 3vw;
  font-size: 3vw;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  align-self: flex-end;
  margin-left: auto;


  &:hover {
    background: linear-gradient(135deg, #b29dfa 0%, #6149b3 100%);
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }


  &::after {
    content: '${props => (props.expanded ? "▲" : "▼")}';
    font-size: 12px;
    transition: transform 0.3s ease;
    transform: rotate(${props => (props.expanded ? "180deg" : "0deg")});
  }
`;


const ContactIcons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;


const PickupSummary = styled.div`
  background: linear-gradient(135deg, #ffffff, #f3f4f7); /* Subtle gradient */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Soft shadow */
  border-radius: 15px; /* Rounded corners */
  padding: 20px; /* Inner padding for content */
  margin-top: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px); /* Lift effect on hover */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); /* Enhanced shadow on hover */
  }
`;

const SectionHeader = styled.h2`
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 2vw;
  color: #333;
  text-align: center; /* Centered heading */
`;

const MaterialsContainer = styled.div`
  background-color: #f9fafb;
  border-radius: 10px;
  padding: 15px;
  margin-top: 10px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05); /* Inner shadow for depth */
`;

const MaterialsHeader = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #444;
  margin-bottom: 10px;
`;

const MaterialsList = styled.ul`
  list-style-type: none; /* Remove default bullet points */
  padding: 0;
  margin: 0;
`;

const MaterialItem = styled.li`
  font-size: 16px;
  color: #666;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f0f4ff; /* Light hover background */
  }

  /* Styling for the quantity and price parts to be emphasized */
  span {
    font-weight: bold;
    color: #333;
  }
`;

const TotalPrice = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
  margin-top: 20px;
  text-align: right; /* Align total to the right */
  border-top: 2px solid #e0e0e0;
  padding-top: 10px;
`;



const Footer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  position: fixed;
  bottom: 0;
  background: linear-gradient(135deg, #b29dfa 0%, #6149b3 100%);
  padding: 1vh 0;
  box-shadow: 0 -1vh 3vh rgba(0, 0, 0, 0.3);
  border-top-left-radius: 5vw;
  border-top-right-radius: 5vw;
`;

const FooterButton = styled.button`
  background: linear-gradient(135deg, #d0f5d3 0%, #d0f5d3 100%);
  border: none;
  font-size: 3.5vw;
  font-weight: bold;
  color: black;
  margin: 2vh 1vw;
  cursor: pointer;
  padding: 2vh 2vw;
  border-radius: 5vw;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 1vh 3vh rgba(0, 0, 0, 0.2);

  &:hover {
    background: linear-gradient(135deg, #ff6a3d 0%, #fe8c71 100%);
    transform: translateY(-1vh);
  }

  &:active {
    transform: translateY(0);
  }
`;



const ConfirmText = styled.p`
  font-size: 3.5vw;
  text-align: center;
  margin-bottom: 2vh;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 2vh;
`;

const ConfirmButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 2vw;
  padding: 2vh 1vw;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 1vh 3vh rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #45a049;
    transform: translateY(-1vh);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CancelButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 2vw;
  padding: 2vh 1vw;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 1vh 3vh rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #e53935;
    transform: translateY(-1vh);
  }

  &:active {
    transform: translateY(0);
  }
`;

const FullScreenAnimation = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 1200; // Ensure it is above other content
  display: flex;
  align-items: center;
  justify-content: center;
`;



const IconButton = styled.button`
  background: none;
  border: none;
  margin-right: 1vw;
  cursor: pointer;
  font-size: 3vw;
  color: #4caf50;

  &:hover {
    color: #388e3c;
  }

  &:focus {
    outline: none;
  }
`;


const PickupInstructionsContainer = styled.div`
  background-color: #ffffff;
  border-radius: 2vw;
  box-shadow: 0 2vh 4vh rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 90vw;
  padding: 1vh;
  margin-top: 1vh;
`;

const InstructionsInput = styled.input`
  width: 100%;
  padding: 2vh;
  font-size: 3.5vw;
  margin-top: 2vh;
  border-radius: 2vw;
  border: 1px solid #ddd;
`;

const NeedHelpContainer = styled.div`
  background-color: #ffffff;
  border-radius: 2vw;
  box-shadow: 0 2vh 4vh rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 90vw;
  padding: 1vh;
  margin-top: 1vh;
`;

const NeedHelpInput = styled.textarea`
  width: 100%;
  padding: 2vh;
  font-size: 3.5vw;
  margin-top: 2vh;
  border-radius: 2vw;
  border: 1px solid #ddd;
  resize: vertical;
`;


