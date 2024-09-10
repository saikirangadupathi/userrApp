import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import BackArrow from './back.png';

import Support from './support.png';

import { Phone, ChatDots } from 'react-bootstrap-icons'; // Import icons

const mapboxAccessToken = 'pk.eyJ1IjoiZ3NhaXRlamEwMDEiLCJhIjoiY2x5a3MyeXViMDl3NjJqcjc2OHQ3NTVoNiJ9.b5q6xpWN2yqeaKTaySgcBQ';

const truckIconUrl = './truck.png';





const PickupOrderStatus = ({ cancelOrder }) => {
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
  const [customerLocation, setCustomerLocation] = useState(null);
  const [agentLocation, setAgentLocation] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');

  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false); // New state for managing the animation display

  const [pickupAgent, setPickupAgent] = useState(null);
  const [pickupInstructions, setPickupInstructions] = useState('');
  const [needHelp, setNeedHelp] = useState('');


  const toggleSupportModal = () => {
    setIsSupportModalOpen(!isSupportModalOpen);
  };

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/order-status/${orderInfo.Id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setOrderStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching order status:', error);
      }
    };
    fetchOrderStatus();
  }, [orderInfo.Id]);

  useEffect(() => {
    const fetchPickupAgent = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/scrap-buyers/${orderInfo.pickupAgentId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPickupAgent(res.data);
        console.log('agentt',res.data);
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

  const handlePickUpClick = () => {
    navigate('/market-price', { state: { ordersInfo: orderInfo } });
  };

  const handleCancelOrder = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmCancelOrder = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/order/${orderInfo.Id}`, {
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
        <StatusContainer>
          <PackageId>Package ID: {orderInfo.Id || 'N/A'}</PackageId>
          <StatusList>
            <StatusItem $completed={isCompleted('scheduled')}>Pickup scheduled</StatusItem>
            <StatusItem $completed={isCompleted('Pending')}>Pickup Approved</StatusItem>
            <StatusItem $completed={isCompleted('in Progress')}>Pickup Truck near you</StatusItem>
            <StatusItem $completed={isCompleted('completed')} $pulsating={isCompleted('completed')}>Pickup completed</StatusItem>
          </StatusList>
        </StatusContainer>

        <DeliveryPartnerContainer>
            <ProfileImage src={pickupAgent?.profileImgUrl || 'default-profile.png'} alt="Pickup Agent" />
            <AgentInfo>
              <ContactIcons>
              <IconButton onClick={() => window.location.href = `tel:${pickupAgent?.contact?.phonee}`}>
                  <Phone />
                </IconButton>
                <IconButton onClick={() => window.location.href = `sms:${pickupAgent?.phone}`}>
                  <ChatDots />
                </IconButton>
              </ContactIcons>
              <Detail>Name: {pickupAgent?.name}</Detail>
              <Detail>Location: {pickupAgent?.location?.address}</Detail>
              <Detail>Reviews: {pickupAgent?.reviews}</Detail>
              <Detail>Operational Hours: {pickupAgent?.operationalHours}</Detail>
            </AgentInfo>
        </DeliveryPartnerContainer>

          <PickupInstructionsContainer>
            <SectionHeader>Pickup Instructions</SectionHeader>
            <InstructionsInput
              type="text"
              value={pickupInstructions}
              onChange={(e) => setPickupInstructions(e.target.value)}
              placeholder="Enter any special instructions for pickup"
            />
          </PickupInstructionsContainer>

          <NeedHelpContainer>
            <SectionHeader>Need Help?</SectionHeader>
            <NeedHelpInput
              type="text"
              value={needHelp}
              onChange={(e) => setNeedHelp(e.target.value)}
              placeholder="Describe your issue or question"
            />
          </NeedHelpContainer>

          
        <OrderDetails>
          <DetailContainer>
            <Detail>Customer: {orderInfo.name || 'N/A'}</Detail>
            <Detail>Package weight: {orderInfo.totalWeight || 'N/A'} kg</Detail>
            <Detail>Order Status: {orderInfo.status || 'N/A'}</Detail>
            <Detail>Schedule Pickup: {orderInfo.schedulePickup || 'N/A'}</Detail>
          </DetailContainer>

          <PickupSummary>
            <SectionHeader>Pickup Summary</SectionHeader>
            <MaterialsContainer>
              <MaterialsHeader>List of materials:</MaterialsHeader>
              <MaterialsList>
                {orderInfo.cart?.map((item, index) => (
                  <MaterialItem key={index}>{item.name} - {item.quantity} x ₹{item.price} = ₹{item.quantity * item.price}</MaterialItem>
                )) || 'N/A'}
              </MaterialsList>
              <TotalPrice>Est. Total Price: ₹{calculateTotalPrice()}</TotalPrice>
            </MaterialsContainer>
          </PickupSummary>

        </OrderDetails>
      </Content>
      <Footer>
        <FooterButton onClick={handlePickUpClick}>Market price</FooterButton>
        <FooterButton onClick={handleTrackOrderClick}>Track Your Pickup</FooterButton>
      </Footer>
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
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Track Order"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
          },
        }}
      >
        {customerLocation && agentLocation && (
          <Map
            initialViewState={{
              latitude: customerLocation[0],
              longitude: customerLocation[1],
              zoom: 12,
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={mapboxAccessToken}
          >
            <Marker latitude={customerLocation[0]} longitude={customerLocation[1]} color="blue" />
            <Marker latitude={agentLocation[0]} longitude={agentLocation[1]}>
              <img src={truckIconUrl} alt="Truck Icon" width="30" height="30" />
            </Marker>
            {routeData && (
              <Source id="route" type="geojson" data={routeData}>
                <Layer
                  id="route"
                  type="line"
                  source="route"
                  layout={{
                    'line-join': 'round',
                    'line-cap': 'round',
                  }}
                  paint={{
                    'line-color': '#888',
                    'line-width': 6,
                  }}
                />
              </Source>
            )}
          </Map>
        )}
        <CloseButton onClick={handleCloseModal}>Close</CloseButton>
      </Modal>
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
  padding: 2vh 4vw;
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
  padding: 4vh;
  margin-top: 5vh;
`;

const PackageId = styled.div`
  font-size: 3.5vw;
  font-weight: bold;
  margin-bottom: 3vh;
  color: #333;
`;

const StatusList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 4vh 0;
`;

const StatusItem = styled.div`
  font-size: 3.5vw;
  color: ${props => (props.$completed ? '#4caf50' : '#bbb')};
  position: relative;
  padding-left: 7vw;
  margin-bottom: 4vh;

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

const OrderDetails = styled.div`
  background-color: #ffffff;
  border-radius: 2vw;
  box-shadow: 0 2vh 4vh rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 90vw;
  padding: 4vh;
  margin-top: 5vh;
  display: flex;
  flex-direction: column;
`;

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 4vh;
  background-color: #f9f9f9;
  border-left: 1vw solid #4caf50;
  margin-bottom: 4vh;
  border-radius: 2vw;
`;

const MaterialsContainer = styled.div`
  padding: 3vh;
  background-color: #f1f1f1;
  border-left: 1vw solid #4caf50;
  border-radius: 2vw;
`;

const MaterialsHeader = styled.div`
  font-size: 3.5vw;
  font-weight: bold;
  margin-bottom: 3vh;
  color: #333;
`;

const MaterialsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MaterialItem = styled.li`
  font-size: 3.5vw;
  padding: 2vh 0;
  border-bottom: 1px solid #ddd;
  color: #555;

  &:last-child {
    border-bottom: none;
  }
`;

const TotalPrice = styled.li`
  font-size: 3.5vw;
  padding: 2vh 0;
  font-weight: bold;
  color: #000;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  position: fixed;
  bottom: 0;
  background: linear-gradient(135deg, #b29dfa 0%, #6149b3 100%);
  padding: 1.5vh 0;
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
  padding: 2vh 3vw;
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

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 3.5vw;
  color: #333;
  cursor: pointer;
  padding: 2vh 3vw;
  border-radius: 2vw;
  transition: background-color 0.3s ease;
  position: absolute;
  top: 2vh;
  right: 2vw;

  &:hover {
    background-color: #f2f2f2;
  }
`;

const ConfirmText = styled.p`
  font-size: 3.5vw;
  text-align: center;
  margin-bottom: 3vh;
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
  padding: 2vh 3vw;
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
  padding: 2vh 3vw;
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

const DeliveryPartnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 2vw;
  box-shadow: 0 1vh 3vh rgba(0, 0, 0, 0.1);
  padding: 3vh;
  margin: 5vh 0;
  width: 100%;
  max-width: 90vw;
`;

const ProfileImage = styled.img`
  width: 15vw;
  height: 15vw;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 4vw;
`;

const Detail = styled.div`
  font-size: 3.5vw;
  color: #333;
  margin-bottom: 1vh;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ContactIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 2vh;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  margin-right: 3vw;
  cursor: pointer;
  font-size: 5vw;
  color: #4caf50;

  &:hover {
    color: #388e3c;
  }

  &:focus {
    outline: none;
  }
`;

const SectionHeader = styled.h3`
  font-size: 4vw;
  font-weight: bold;
  margin-bottom: 3vh;
  color: #333;
`;

const AgentInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 4vh;
  background-color: #f9f9f9;
  border-left: 1vw solid #4caf50;
  margin-bottom: 4vh;
  border-radius: 2vw;
`;

const PickupInstructionsContainer = styled.div`
  background-color: #ffffff;
  border-radius: 2vw;
  box-shadow: 0 2vh 4vh rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 90vw;
  padding: 4vh;
  margin-top: 5vh;
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
  padding: 4vh;
  margin-top: 5vh;
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

const PickupSummary = styled.div`
  background-color: #ffffff;
  border-radius: 2vw;
  box-shadow: 0 2vh 4vh rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 90vw;
  padding: 4vh;
  margin-top: 5vh;
`;
