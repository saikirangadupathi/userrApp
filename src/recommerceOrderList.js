import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Clipboard, CurrencyRupee, Person } from 'react-bootstrap-icons';



const OrdersDashboard = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const retrieveUserProfile = async () => {
      try {
        const response = await axios.get('http://your-api-url/api/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        console.log('User profile data:', response.data);
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error retrieving user profile:', error);
      }
    };

    const timer = setTimeout(() => setIsLoading(false), 3000);
    retrieveUserProfile();

    const loadOrders = async () => {
      try {
        const response = await axios.get("http://your-api-url/api/orders");
        const relevantOrders = response.data.orders.filter(order =>
          order.status === "pending" || order.status === "processing" || order.status === "delivered"
        );
        setOrderDetails(relevantOrders);
      } catch (error) {
        console.error("Error loading orders:", error);
      }
    };

    loadOrders();
  }, []);

  const navigateToProfile = () => navigate('/profile');
  const navigateToPricing = () => navigate('/EcommerceHome');
  const navigateToOrderDetails = (order) => navigate('/order-details', { state: { orderInfo: order } });

  const activeOrders = orderDetails.filter(order => order.status !== 'delivered');
  const deliveredOrders = orderDetails.filter(order => order.status === 'delivered');

  return (
    <MainContainer>
      <MainHeader>
        <MainTitle>E-commerce Orders Dashboard</MainTitle>
      </MainHeader>
      <ActiveOrdersSection>
        {activeOrders.map((order, index) => (
          <OrderTile key={index} onClick={() => navigateToOrderDetails(order)}>
            <OrderTileDetails>
              <ImageWrapper>
                <img src={order.image || '/placeholder-image.jpg'} alt={`Order ${order.id}`} />
              </ImageWrapper>
              <InfoCard>
                <InfoDetail>Order ID: {order.id}</InfoDetail>
                <InfoDetail>Customer: {order.customer}</InfoDetail>
                <InfoDetail>Status: {order.status}</InfoDetail>
              </InfoCard>
            </OrderTileDetails>
            <OrderItemsListing>
              <InfoDetail>Items:</InfoDetail>
              {order.items.map((item, idx) => (
                <ItemInfo key={idx}>{item.name} - {item.quantity} units</ItemInfo>
              ))}
            </OrderItemsListing>
          </OrderTile>
        ))}
      </ActiveOrdersSection>
      <DeliveredOrdersSection>
        <DeliveredSectionTitle>Delivered Orders</DeliveredSectionTitle>
        {deliveredOrders.map((order, index) => (
          <OrderTile key={index} onClick={() => navigateToOrderDetails(order)}>
            <OrderTileDetails>
              <ImageWrapper>
                <img src={order.image || '/placeholder-image.jpg'} alt={`Order ${order.id}`} />
              </ImageWrapper>
              <InfoCard>
                <InfoDetail>Order ID: {order.id}</InfoDetail>
                <InfoDetail>Customer: {order.customer}</InfoDetail>
                <InfoDetail>Status: {order.status}</InfoDetail>
              </InfoCard>
            </OrderTileDetails>
            <OrderItemsListing>
              <InfoDetail>Items:</InfoDetail>
              {order.items.map((item, idx) => (
                <ItemInfo key={idx}>{item.name} - {item.quantity} units</ItemInfo>
              ))}
            </OrderItemsListing>
          </OrderTile>
        ))}
      </DeliveredOrdersSection>
      <AppFooter>
        <Row style={{ position: 'fixed', bottom: '0', width: '100%', backgroundColor: '#eaeaea', padding: '10px 0', margin: '0' }}>
          <Col style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <InteractiveIcon onClick={navigateToPricing}>
              <CurrencyRupee size={30} />
              <span>Pricing</span>
            </InteractiveIcon>
            <InteractiveIcon onClick={navigateToProfile}>
              <Person size={30} />
              <span>User Profile</span>
            </InteractiveIcon>
          </Col>
        </Row>
      </AppFooter>
    </MainContainer>
  );
};

export default OrdersDashboard;

const MainContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
`;

// Main header with centered title
const MainHeader = styled.header`
  text-align: center;
  margin-bottom: 20px;
`;

// Title with responsive font size
const MainTitle = styled.h1`
  font-size: 24px;
  margin: 0;
  color: #333;
`;

// Section for active orders
const ActiveOrdersSection = styled.section`
  margin-bottom: 20px;
`;

// Section for delivered orders
const DeliveredOrdersSection = styled.section`
  margin-bottom: 20px;
`;

// Title for delivered orders
const DeliveredSectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
`;

// Container for each order tile
const OrderTile = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  padding: 10px;
  cursor: pointer;
`;

// Wrapper for order tile details
const OrderTileDetails = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

// Wrapper for the order image
const ImageWrapper = styled.div`
  flex: 1;
  margin-right: 10px;
`;

// Order image with responsive size
const OrderImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
`;

// Card for order information
const InfoCard = styled.div`
  flex: 3;
`;

// Details inside the order information card
const InfoDetail = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
`;

// Listing of order items
const OrderItemsListing = styled.div`
  margin-top: 10px;
`;

// Item information inside order items listing
const ItemInfo = styled.p`
  margin: 0;
  font-size: 14px;
  color: #333;
`;

// Footer section with fixed position
const AppFooter = styled.footer`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #eaeaea;
  padding: 10px 0;
`;

// Interactive icon wrapper for footer
const InteractiveIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: #333;
  span {
    margin-top: 5px;
    font-size: 12px;
  }
`;
