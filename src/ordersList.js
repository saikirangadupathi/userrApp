import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Clipboard, CurrencyRupee, Person } from 'react-bootstrap-icons';

const PickupList = () => {
  const [ordersList, setOrdersList] = useState([]);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState('');
  const [pickupIds, setPickupIds] = useState([]);

  useEffect(() => {
    // Fetch profile data and extract pickupIds
  const fetchProfileData = async () => {
          try {
            const response = await axios.get('http://localhost:8080/api/profile', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setProfileData(response.data);
            setUserId(response.data.id);
            
            const pickupIds = response.data.pickupHistory.map((pickup) => pickup.pickupId);
            setPickupIds(pickupIds);
          } catch (error) {
            console.error('Error fetching profile data:', error);
          } finally {
            setLoading(false);
          }
      };

      const fetchOrders = async () => {
        if (pickupIds.length === 0) {
          return;
        }
        try {
          const pickupIdsParam = pickupIds.join(',');
      
          const response = await axios.get('http://localhost:8080/getOrdersByUsers', {
            params: { pickupIds: pickupIdsParam, userId: userId },
          });
          const filteredOrders = response.data.orderslist.filter((order) =>
            ['Scheduled', 'inProgress', 'completed', 'Pending'].includes(order.status)
          );
          setOrdersList(response.data.orderslist);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };

  fetchProfileData();
  fetchOrders();

  const intervalId = setInterval(fetchOrders, 10000);

  return () => clearInterval(intervalId);
}, [pickupIds, userId]); 

  const handleprofileClick = () => {
    navigate('/profile');
  };

  const handlePriceClick = () => {
    navigate('/market-price');
  };

  const handleOrderClick = (order) => {
    navigate('/pickup-order-status', { state: { ordersInfo: order } });
  };

  const scheduledAndInProgressOrders = ordersList.filter(order => order.status !== 'completed');
  const completedOrders = ordersList.filter(order => order.status === 'completed');

  return (
    <Container>
      <Header style={{ position: 'fixed', top: '0' }}>
        <Title>Orders List</Title>
      </Header>
      <OrdersContainer style={{ marginTop: '45px', marginBottom: '40px' }}>
        {scheduledAndInProgressOrders.map((order, index) => (
          <OrderCard key={index} onClick={() => handleOrderClick(order)}>
            <OrderInfoContainer>
                  <ImageContainer>
                    <img src={order.image || '/default-image.jpg'} alt={`Order ${order.Id}`} />
                  </ImageContainer>
                  <DetailCard>
                    <Detail>Package ID: {order.Id}</Detail>
                    <Detail>Name: {order.name}</Detail>
                    <Detail>Status: {order.status}</Detail>
                  </DetailCard>
            </OrderInfoContainer>
            <ItemsList>
              <Detail>Items:</Detail>
              {order.cart.map((item, idx) => (
                <ItemDetail key={idx}>{item.name} - {item.quantity}KGS</ItemDetail>
              ))}
            </ItemsList>
          </OrderCard>
        ))}
      </OrdersContainer>
      <CompletedOrdersContainer>
        <CompletedTitle>Completed Pickups</CompletedTitle>
        {completedOrders.map((order, index) => (
          <OrderCard key={index} onClick={() => handleOrderClick(order)}>
                <OrderInfoContainer>
                    <ImageContainer>
                            <img src={order.images[0] || '/default-image.jpg'} alt={`Order ${order.Id}`} />
                    </ImageContainer>
                    <DetailCard>
                        <Detail>Package ID: {order.Id}</Detail>
                        <Detail>Name: {order.name}</Detail>
                        <Detail>Status: {order.status}</Detail>
                    </DetailCard>
                </OrderInfoContainer>
                <ItemsList>
                    <Detail>Items:</Detail>
                    {order.cart.map((item, idx) => (
                      <ItemDetail key={idx}>{item.name} - {item.quantity}KGS</ItemDetail>
                    ))}
                </ItemsList>
        </OrderCard>
        ))}
      </CompletedOrdersContainer>
      <Footer>
        <Row style={{ position: 'fixed', bottom: '0', width: '100%', backgroundColor: '#eaeaea', padding: '10px 0', margin: '0' }}>
          <Col style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div onClick={() => navigate('/market-price')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#5e348b', cursor: 'pointer' }}>
              <CurrencyRupee size={30} />
              <span>Market Price</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#4caf50', cursor: 'pointer' }}>
              <Clipboard size={30} />
              <span>Pick up Status</span>
            </div>
            <div onClick={() => navigate('/profile')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#5e348b', cursor: 'pointer' }}>
              <Person size={30} />
              <span>Profile</span>
            </div>
          </Col>
        </Row>
      </Footer>
    </Container>
  );
};

export default PickupList;

const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100vw;
  margin-top: 2vh;
  padding: 0 1vh;
`;

const CompletedOrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100vw;
  margin-top: 2vh;
  margin-bottom: 5vh;
  padding: 0 1vh;
`;

const OrderCard = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  padding: 1.5vh;
  margin-bottom: 2vh;
  box-sizing: border-box;
  display: flex; /* Updated to flex to position horizontally */
  flex-direction: column; /* Align items horizontally */
  justify-content: space-between; /* Add spacing between items */
  align-items: center; /* Align items vertically in the center */
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const OrderInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1; /* Allow the order info to grow */
  padding-right: 10px; /* Add some space between the info and image */
`;

const DetailCard = styled.div`
  text-align: left;
  margin-left: 2vh;
`;


const ImageContainer = styled.div`
  width: 20vw; /* Set a fixed width for the image */
  height: 10vh; /* Set a fixed height for the image */
  border-radius: 10px; /* Round the corners */
  overflow: hidden; /* Ensure the image fits inside the container */
  background-color: #f1f1f1; /* Add a background color for better visibility */
  
  img {
    width: 20vw;
    height: 15vh;
    object-fit: cover; /* Ensure the image covers the container */
  }
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: row;
  display: grid;
  max-width: 40vw;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 5px;
  margin-bottom: 10px;
  border-radius: 10px;
  font-family: sans-serif;
  padding: 10px;
  background-color: #f9f9f9;
  align-items: center;
`;

const Detail = styled.div`
  font-size: 3vw;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: left;

  &:first-child, &:nth-child(2), &:nth-child(4),&:nth-child(6) {
    font-weight: bold;
  }
`;

const ItemsList = styled.div`
  margin-top: 1vh;
  padding: 2vw;
  width: 100%;
  border-radius: 10px;
  background-color: #f1f1f1;
  border-left: 5px solid #4caf50;
`;

const ItemDetail = styled.div`
  font-size: 3vw;
  margin-left: 10px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;

  &:before {
    content: '• ';
    color: #4caf50;
    margin-right: 5px;
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  background-color: #f3f2f8;
  min-height: 100vh;
  box-sizing: border-box;
`;

const Header = styled.div`
  width: 100%;
  padding: 10px 0;
  text-align: center;
  background-color: #402E7A;
  color: white;
  z-index: 1100;
`;

const Title = styled.h1`
  margin: 0;
`;

const CompletedTitle = styled.h2`
  margin: 0 0 20px 0;
  text-align: center;
`;