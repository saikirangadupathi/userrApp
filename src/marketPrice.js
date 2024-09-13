import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, FormControl, InputGroup, ButtonGroup } from 'react-bootstrap';
import { ArrowLeft, Cart, Clipboard, CurrencyRupee, Person } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import afterLoginScreen from './afterLoginScreen.mp4'

const ButtonGroupWrapper = styled.div`
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 2vh;  /* Adjusted for vertical spacing */
  color: white;
`;

const StyledButtonGroup = styled(ButtonGroup)`
  display: flex;
  flex-wrap: nowrap;
  color: white;
`;

const CategoryButton = styled(Button)`
  background-color: white;
  border-color: white;
  margin-right: 1vw; /* Adjusted for horizontal spacing */
  flex: 0 0 auto;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #9FD4A3;
    color: white;
  }
`;

const FixedHeader = styled.div`
  background-color: #402E7A;
  padding: 2vh 3vw; /* Adjusted padding to scale proportionally */
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1000;
`;

const ScrollableContent = styled.div`
  background-color: #D6CDF6;
  padding-top: 20vh; /* Adjusted padding to account for the header */
  overflow-y: auto;
  height: calc(100vh - 9vh); /* Adjusted height to account for the footer */
  position: relative; /* Ensures positioning context for the BackToTopButton */
`;

const CenteredLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const CartIconWrapper = styled.div`
  position: relative;
`;

const CartBubble = styled.div`
  position: absolute;
  top: -2vh; /* Adjusted for better positioning */
  right: -2vw;
  background-color: yellow;
  color: black;
  border-radius: 50%;
  padding: 1vh 2vw; /* Adjusted padding */
  font-size: 2.5vw; /* Adjusted font size */
  font-weight: bold;
`;

const BackToTopButton = styled.button`
  position: fixed;
  top: calc(20vh + 5vh); /* Just below the FixedHeader */
  left: 50%;
  transform: translateX(-50%);
  padding: 1vh 2vw;
  font-size: 3vw;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 10%;
  cursor: pointer;
  z-index: 2000;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
`;

const MarketPrice = ({ updateCart, cart, previousRoute }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState({});
  const [allItems, setAllItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const scrollableContentRef = useRef(null);


  // New state to track if we are coming from the '/sell-buy' route
  const [fromSellBuy, setFromSellBuy] = useState(false);

  useEffect(() => {
    // Only set this to true on the initial render if the previous route is '/sell-buy'
    if (previousRoute === '/sell-buy') {
      setFromSellBuy(true);
    }
    console.log('Previous Route....:', previousRoute);
  }, [previousRoute]);



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://recycle-backend-apao.onrender.com/api/recycling-materials');
        const categoryData = {};
        response.data.forEach(category => {
          categoryData[category.category] = category.items;
        });
        setCategories(categoryData);
        setAllItems(response.data.flatMap(category => category.items));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    setTimeout(() => {
      setLoading(false);
      fetchCategories();
    }, 5000);
  }, []);

  useEffect(() => {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalItems);
  }, [cart]);

  const handleAdd = (item) => {
    const itemKey = `${item.name}-${item.itemId}`;
  
    const updatedQuantities = {
      ...quantities,
      [itemKey]: (quantities[itemKey] || 0) + 1,
    };
    
    setQuantities(updatedQuantities);
  
    const updatedCart = cart.some(cartItem => cartItem.itemId === item.itemId)
      ? cart.map(cartItem =>
          cartItem.itemId === item.itemId
            ? { ...cartItem, quantity: updatedQuantities[itemKey] }
            : cartItem
        )
      : [...cart, { ...item, quantity: 1 }];
  
    updateCart(updatedCart);
  };
  
  const handleMinus = (item) => {
    const itemKey = `${item.name}-${item.itemId}`;
  
    if (quantities[itemKey] > 0) {
      const updatedQuantities = {
        ...quantities,
        [itemKey]: quantities[itemKey] - 1,
      };
  
      setQuantities(updatedQuantities);
  
      const updatedCart = cart
        .map(cartItem =>
          cartItem.itemId === item.itemId
            ? { ...cartItem, quantity: updatedQuantities[itemKey] }
            : cartItem
        )
        .filter(cartItem => cartItem.quantity > 0);
  
      updateCart(updatedCart);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const getFilteredItems = () => {
    if (selectedCategory === 'all') {
      return allItems.filter(item => item.name.toLowerCase().includes(searchTerm));
    }
    return categories[selectedCategory]?.filter(item => item.name.toLowerCase().includes(searchTerm)) || [];
  };

  const filteredItems = getFilteredItems();

  const handleScroll = () => {
    if (scrollableContentRef.current) {
      const scrollPosition = scrollableContentRef.current.scrollTop;
      const thirdItemPosition = document.getElementById('item-3')?.offsetTop || 0;

      setShowBackToTop(scrollPosition > thirdItemPosition);
    }
  };

  const handleBackToTopClick = () => {
    if (scrollableContentRef.current) {
      // Start the smooth scroll to top
      scrollableContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });

      // Set a timeout to hide the button after the scroll animation is expected to complete
      setTimeout(() => {
        setShowBackToTop(false);
      }, 500); // Adjust the delay to match the scroll duration
    }
  };

  useEffect(() => {
    const scrollableContent = scrollableContentRef.current;

    if (scrollableContent) {
      scrollableContent.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollableContent) {
        scrollableContent.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <Container fluid style={{ backgroundColor: '#b29dfa', minHeight: '100vh', padding: '0' }}>
       {loading ? (
          fromSellBuy ? (
      // Show the specific video loader if coming from SellBuyPage
      <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
        <video
          src= {afterLoginScreen} // Replace with your video
          autoPlay
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    ) : (
      // Else, show the unique MarketPrice loader
      <CenteredLoader>
        <iframe
          src="https://lottie.host/embed/9d9ed392-5459-4927-8c94-a74d323a09b5/f0jEp4ugFb.json"
          style={{ width: '45vw', height: '45vw', border: 'none' }} // Adjusted for proportional scaling
        ></iframe>
      </CenteredLoader>
    )
) : (
        <>
          <FixedHeader>
            <Row style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: '1vh' }}>
              <Col xs="auto" onClick={() => navigate('/sell-buy')} style={{ cursor: 'pointer', color: 'white ' }}>
                <ArrowLeft size="7vw" />
              </Col>
              <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '5vw', fontWeight: 'bold' }}>
                Market Price
                <div style={{ marginLeft: 'auto', fontSize: '4vw' }}>Today</div>
              </Col>
              <Col xs="auto" style={{ display: 'flex', alignItems: 'center' }}>
                <CartIconWrapper>
                  <Cart size="7vw" style={{ cursor: 'pointer', color: 'white', marginRight: '4vw' }} onClick={() => navigate('/pickup-info', { state: { cart } })} />
                  {cartCount > 0 && <CartBubble>{cartCount}</CartBubble>}
                </CartIconWrapper>
              </Col>
            </Row>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search"
                aria-label="Search"
                aria-describedby="basic-addon1"
                onChange={handleSearch}
                style={{ fontSize: '3.5vw', padding: '2vw' }} // Adjusted for proportional scaling
              />
            </InputGroup>
            <ButtonGroupWrapper>
              <StyledButtonGroup>
                <CategoryButton
                  variant={selectedCategory === 'all' ? 'success' : 'outline-light'}
                  onClick={() => setSelectedCategory('all')}
                  style={{ color: 'black', fontSize: '3.5vw', padding: '1.5vw 2vw' }} // Adjusted for proportional scaling
                >
                  All
                </CategoryButton>
                {Object.keys(categories).map((category, idx) => (
                  <CategoryButton
                    key={idx}
                    variant={selectedCategory === category ? 'success' : 'outline-light'}
                    onClick={() => setSelectedCategory(category)}
                    style={{ color: 'black', fontSize: '3.5vw', padding: '1.5vw 2vw' }} // Adjusted for proportional scaling
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                  </CategoryButton>
                ))}
              </StyledButtonGroup>
            </ButtonGroupWrapper>
          </FixedHeader>
          <ScrollableContent ref={scrollableContentRef} id="scrollableContent">
            <Row className="mb-3" style={{ margin: '3vh 1vw' }}>
              <Col xs={12}>
                {filteredItems.map((item, index) => (
                  <Card
                    key={index}
                    id={`item-${index + 1}`} // Assigning IDs to items
                    style={{ backgroundColor: 'white', border: 'none', color: 'black', padding: '3vw', marginBottom: '2vh', height: '25vh' }}
                  >
                    <Row>
                      <Col xs={5} style={{ padding: '5vw', marginRight: '3vw' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <img src={item.imageUrl} alt={item.name} style={{ height:'15vh', width: '100%' }} />
                        </div>
                      </Col>
                      <Col xs={5} style={{ backgroundColor: '#f3f2f8', height: "15vh", borderRadius: "2vw", marginRight: '1vw' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1vh', justifyContent: 'space-between', height: '100%', fontFamily: 'SanFrancisco', fontWeight: '150' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '3.5vw' }}>{item.name}</div>
                            <div style={{ fontSize: '4vw' }}>₹ {item.price}/KG</div>
                          </div>
                          <div style={{ color: 'black', display: 'flex', justifyContent: 'right', alignItems: 'center', marginBottom: '2vh' }}>
                            <Button style={{ color: 'black', border: 'solid', borderColor: '#f1f1f1' }} variant="outline-light" onClick={() => handleMinus(item)}>-</Button>
                            <span style={{ margin: '0 2vw', fontSize: '3.5vw' }}>{quantities[`${item.name}-${item.itemId}`] || 0}</span>
                            <Button style={{ color: 'black', border: 'solid', borderColor: '#f1f1f1' }} variant="outline-light" onClick={() => handleAdd(item)}>+</Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Col>
            </Row>
            {showBackToTop && (
              <BackToTopButton onClick={handleBackToTopClick}>
                ↑ Back to Top
              </BackToTopButton>
            )}
          </ScrollableContent>
          <Row style={{ position: 'fixed', bottom: '0', width: '100%', backgroundColor: '#eaeaea', padding: '2vh 0', margin: '0' }}>
            <Col style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '3.5vw', color: '#4caf50', cursor: 'pointer' }}>
                <CurrencyRupee size={30} />
                <span>Market Price</span>
              </div>
              <div onClick={() => navigate('/pickup-list')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '3.5vw', color: '#5e348b', cursor: 'pointer' }}>
                <Clipboard size={30} />
                <span>Pick up Status</span>
              </div>
              <div onClick={() => navigate('/profile')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '3.5vw', color: '#5e348b', cursor: 'pointer' }}>
                <Person size={30} />
                <span>Profile</span>
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default MarketPrice;
