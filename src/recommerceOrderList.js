import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Clipboard, CurrencyRupee, Person } from 'react-bootstrap-icons';

import { Shop, ListCheck, TagFill, PersonCircle } from 'react-bootstrap-icons';

import Slider from 'react-slick';

import OrderStatus from './orderStatusIndicator';




const OrdersDashboard = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const navigate = useNavigate();

  const [orderIds, setOrderIds] = useState([]);

  const [userProfile, setUserProfile] = useState({});


  const [products, setProducts] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const [showOrderDetails, setShowOrderDetails] = useState(false); 

  const [isLoading, setIsLoading] = useState(true);



   const fetchProductsByIds = async (productIds) => {
    try {
      const response = await axios.get('https://recycle-backend-apao.onrender.com/api/getProductsByIds', {
        params: {
          productIds: productIds.join(','),
        },
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };


  const fetchUserProfileAndOrders = async () => {
    try {
      const profileResponse = await axios.get('https://recycle-backend-apao.onrender.com/api/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUserProfile(profileResponse.data);

 
      const orderIds = profileResponse.data.reCommerceOrderHistory.map((order) => order.orderId);
      setOrderIds(orderIds);

 
      const userId = profileResponse.data.id;
      const orderIdParams = orderIds.join(',');
      const ordersResponse = await axios.get('https://recycle-backend-apao.onrender.com/get-eCommerce-OrdersByUsers', {
        params: {
          userId: userId,
          orderIds: orderIdParams,
        },
      });

      setOrderDetails(ordersResponse.data.orderslist);

      const productIds = ordersResponse.data.orderslist.flatMap(order => 
        order.cart.map(item => item.productId)
      );
      
      if (productIds.length > 0) {

        await fetchProductsByIds(productIds);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchUserProfileAndOrders();
    }, 3000);

    return () => clearInterval(intervalId);
}, []);

  const handleOrderClick = async (order) => {
    setSelectedOrder(order);
    fetchRecommendedProducts(order.cart.map(item => item.productId));
    setShowOrderDetails(true);
  };


  const fetchRecommendedProducts = async (productIds) => {
    try {
      const response = await axios.get('https://recycle-backend-apao.onrender.com/api/recommendedProducts', {
        params: { productIds: productIds.join(',') }
      });
      setRecommendedProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching recommended products:', error);
    }
  };



const carouselSettings = {
  dots: false, 
  infinite: true, 
  speed: 500, 
  slidesToShow: 1, 
  slidesToScroll: 1, 
  autoplay: true, 
  autoplaySpeed: 3000, 
};

  const OrderDescription = ({ order }) => (
    <OrderDescriptionContainer>
      <OrderInfoContainer>
        <OrderDetailsWrapper>
          <Title>Order Details</Title>
          <Detail><strong>Status:</strong></Detail><p style={{fontSize:'3vw',textAlign:'left'}}> {order.status}</p>
          <Detail><strong>Delivery Address:</strong></Detail>
            <p style={{fontSize:'3vw',textAlign:'left'}}>{order.location.map(loc => loc.address).join(', ')}</p>
          <Detail><strong>Total Price:</strong> ₹{order.totalPrice}</Detail>
        </OrderDetailsWrapper>
        <OrderStatusWrapper>
            <OrderStatus style={{ height: '30vh' }} orderStatus={order.status} />
        </OrderStatusWrapper>
    </OrderInfoContainer>
      
      {order.deliveryAgent && (
        <SectionContainer>
          <SectionTitle>Delivery Agent Information</SectionTitle>
          <InfoText>Name: {order.deliveryAgent.name}</InfoText>
          <InfoText>Contact: {order.deliveryAgent.contact}</InfoText>
          <InfoText>Estimated Delivery Time: {order.deliveryAgent.estimatedDelivery}</InfoText>
        </SectionContainer>
      )}

      {order.cart.map((item, idx) => (
        <ItemContainer key={idx}>
          <ItemDetail>{item.name} - {item.quantity} units - ₹{item.price}</ItemDetail>
        </ItemContainer>
      ))}

      <SectionContainer>
        <SectionTitle>Need Help?</SectionTitle>
        <HelpLink href="mailto:support@example.com">Contact Support</HelpLink>
      </SectionContainer>
    </OrderDescriptionContainer>
);


  const RecommendedProducts = ({ products }) => (
    <RecommendedProductsContainer>
      <Title>Recommended Products</Title>
      <div style={{ 
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            overflowX: 'auto',
            overflowY: 'hidden',
            width: '100%', 
            padding: '10px 0'
        }}>
        {products.map((product, idx) => (
          <ProductCard key={idx}>
            <ProductImage src={product.images[0] || '/placeholder-image.jpg'} alt={product.name} />
            <ProductName>{product.name}</ProductName>
            <ProductPrice>Price: ₹{product.price}</ProductPrice>
          </ProductCard>
        ))}
      </div>
    </RecommendedProductsContainer>
  );
  


  const handleBackToOrders = () => {
    setShowOrderDetails(false);  // Show the orders list and hide the details
  };
  
  
  

  const Footer = ({ navigate }) => (
    <Row style={{ position: 'fixed', bottom: '0',left: '0', width: '100%', backgroundColor: 'white', padding: '2vh 0', margin: '0', zIndex: 1000 }}>
          <Col style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div onClick={() => navigate('/EcommerceHome')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '3vw', color: '#927AE7', cursor: 'pointer' }}>
              <Shop size="6vw" />
              <span style={{ marginTop: '1vh' }}>Shopping</span>
            </div>
            <div onClick={() => navigate('/couponPage')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '3vw', color: '#927AE7', cursor: 'pointer' }}>
              <TagFill size="6vw" />
              <span style={{ marginTop: '1vh' }}>Coupons</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '3vw', color: '#4caf50', cursor: 'pointer' }}>
              <ListCheck size="6vw" />
              <span style={{ marginTop: '1vh' }}>OrdersList</span>
            </div>
            <div onClick={() => navigate('/profile')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '3vw', color: '#927AE7', cursor: 'pointer' }}>
              <PersonCircle size="6vw" />
              <span style={{ marginTop: '1vh' }}>Profile</span>
            </div>
          </Col>
    </Row>
);

  const navigateToProfile = () => navigate('/profile');
  const navigateToPricing = () => navigate('/EcommerceHome');
  const navigateToOrderDetails = (order) => navigate('/order-details', { state: { orderInfo: order } });

  const activeOrders = orderDetails.filter(order => order.status !== 'delivered');
  const deliveredOrders = orderDetails.filter(order => order.status === 'delivered');

  return (
    <MainContainer>
      <MainHeader>
        <MainTitle>Your Orders</MainTitle>
      </MainHeader>
      <ScrollableContent>
      {isLoading ? (
          <LoaderContainer>
              <iframe 
                src="https://lottie.host/embed/986cc7f5-3bf9-4d59-83d4-c35c6e3d608a/0mitlmdS4c.json"
                style={{ width: '40vw', height: '40vh', border: 'none' }}
              ></iframe>
          </LoaderContainer>
        ) : (
        !showOrderDetails ? (
          <OrdersSection>
            {orderDetails.map((order, index) => (
              <OrderTile key={index} onClick={() => handleOrderClick(order)}>
                <OrderTileDetails>
                    {products.map((product, idx) => (
                      <ImageWrapper>
                          <Slider {...carouselSettings}>
                            {product.images.map((image, i) => (
                              <OrderImage key={i} src={image || '/placeholder-image.jpg'} alt={`Product ${i}`} />
                            ))}
                          </Slider>
                      </ImageWrapper>
                    ))}
                      <InfoCard>
                        <InfoDetail><strong>ID:</strong> {order.id}</InfoDetail>
                        <InfoDetail><strong>Customer:</strong> {order.name}</InfoDetail>
                        <InfoDetail><strong>Total Price:</strong> ₹{order.totalPrice}</InfoDetail>
                        <InfoDetail>Address: {order.location.map(loc => loc.address).join(', ')}</InfoDetail>
                      </InfoCard>
                    </OrderTileDetails>
                <OrderItemsListing>
                  <InfoDetail><strong>Items:</strong></InfoDetail>
                  {order.cart.map((item, idx) => (
                    <ItemInfo key={idx}>{item.name} - {item.quantity} units - ₹{item.price}</ItemInfo>
                  ))}
                </OrderItemsListing>
              </OrderTile>
            ))}
          </OrdersSection>
        ) : (
          <>
            <OrderDescription order={selectedOrder} />
            {recommendedProducts.length > 0 && (
              <RecommendedProducts products={recommendedProducts} />
            )}
            <button onClick={handleBackToOrders}>Back to Orders</button>
          </>
        )
      )}
      </ScrollableContent>
      <Footer navigate={navigate} />
    </MainContainer>
  );
};

export default OrdersDashboard;

const MainContainer = styled.div`
  padding: 10px;
  background-color: #d6cdf6;
  height: 100vh;
  overflow-y: hidden;
`;

const ScrollableContent = styled.div`
  padding-bottom: 20vh;
  height: calc(100vh - 3vh);
  overflow-y: auto;
  background-color: #d6cdf6;
`;

const MainHeader = styled.header`
  text-align: center;
  margin-bottom: 20px;
  background-color: #d6cdf6;
`;

const MainTitle = styled.h1`
  font-size: 24px;
  margin: 0;
  color: #333;
`;


const OrdersSection = styled.section`
  margin-bottom: 20px;
`;


const ActiveOrdersSection = styled.section`
  margin-bottom: 20px;
`;


const DeliveredOrdersSection = styled.section`
  margin-bottom: 20px;
`;


const DeliveredSectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
`;

const OrderInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  height: 30vh;
  margin-bottom: 20px;
  width: 100%;
`;

const OrderStatusWrapper = styled.div`
  flex: 0 40%;
  max-width: 40vw;
  max-height: 30vh;
`;

const OrderDetailsWrapper = styled.div`
  flex: 1;
  font-size: 1vw;
  margin-left: 1vw;
`;

const OrderTile = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  text-align: left;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  margin-bottom: 3vw;
  padding: 5vw;
  cursor: pointer;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }
`;

const OrderTileDetails = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 3vw;
`;

const ImageWrapper = styled.div`
  flex: 0 0 10vw; 
  margin-right: 2vw;
  border-radius: 5px;
  overflow: hidden;
`;

const OrderImage = styled.img`
  width: 20vw;
  height: 10vh;
  object-fit: cover;
`;



const InfoDetail = styled.p`
  font-size: 3vw;
  color: #333;
  margin: 4px 0;
  font-weight: 500;
`;


const InfoCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const OrderItemsListing = styled.div`
  padding-top: 3vw;
  border-top: 2px solid #eee;
`;

const ItemInfo = styled.p`
  font-size: 14px;
  color: #666;
  margin: 5px 0;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;



const SectionContainer = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
`;

const InfoText = styled.p`
  font-size: 16px;
  color: #666;
  margin: 5px 0;
`;

const HelpLink = styled.a`
  color: #0066cc;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;


const AppFooter = styled.footer`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

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


const OrderDescriptionContainer = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 6vw;
  text-align: left;
  color: #333;
  margin-bottom: 15px;
`;

const Detail = styled.p`
  font-size: 4vw;
  text-align: left;
  color: #666;
  margin: 5px 0;
  strong {
    color: #333;
    font-weight: bold;
  }
`;

const ItemContainer = styled.div`
  background: #f8f8f8;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
`;

const ItemDetail = styled.p`
  font-size: 14px;
  color: #555;
`;


const RecommendedProductsContainer = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;


const ProductCard = styled.div`
  background: #f0f0f0;
  padding: 15px;
  margin: 10px;
  border-radius: 8px;
  width: 40vw;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;  // Centering items in the card
`;

const ProductImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const ProductName = styled.p`
  font-size: 16px;
  color: #333;
  margin: 5px 0;
  text-align: center;  // Centering product name
`;

const ProductPrice = styled.p`
  font-size: 14px;
  color: #666;
  text-align: center;  // Centering price information
`;