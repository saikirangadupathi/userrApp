import React, { useState, useEffect, useRef } from 'react';
import {Button, Row, Col } from 'react-bootstrap';

import Modal from 'react-modal';


import { useNavigate } from 'react-router-dom';
import { Filter, Search } from 'react-bootstrap-icons';
import { ArrowLeft } from 'react-bootstrap-icons';
import axios from 'axios';
import styled from 'styled-components';

import { Shop, ListCheck, TagFill, PersonCircle } from 'react-bootstrap-icons';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import CartModal from './cartModal.js';

import { Cart, Trash } from 'react-bootstrap-icons';

import afterLoginScreen from './afterLoginScreen.mp4'

import CartIcon from './cartIcon.js';

import HomeContent from './homeContent.js';

import wishlistActive from './wishlistActive.png';

import wishlistNonActive from './wishlistNonActive.png';

import SegmentDropdown from './segmentsDropdown.js'
 
Modal.setAppElement('#root');

const CenteredLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ContentFooterSection = styled.div`
  padding: 5vw 0;
  background-color: #1c1c1c;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: flex-start;
  font-family: 'Roboto', sans-serif;
`;

const FooterColumn = styled.div`
  flex: 1 1 30%;
  padding: 1vw;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SocialIconsContainer = styled.div`
  display: flex;
  justify-content: center; /* Centering the icons horizontally */
  gap: 2vw;
  margin-top: 2vw;
`;

const FooterTitle = styled.h3`
  font-size: 4vw;
  color: #f4b400; /* Vibrant yellow for highlights */
  margin-bottom: 2vw;
  text-transform: uppercase;
  font-weight: bold;
`;

const FooterLink = styled.a`
  display: block;
  color: #ffffff;
  font-size: 3vw;
  margin-bottom: 1.5vw;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #f4b400;
    text-decoration: underline;
  }
`;


const SocialIcon = styled.img`
  width: 6vw;
  height: 6vw;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const NewsletterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 2vw;
`;

const NewsletterText = styled.p`
  font-size: 3vw;
  margin-bottom: 2vw;
`;

const EmailInput = styled.input`
  padding: 2vw;
  font-size: 3vw;
  border: none;
  border-radius: 10px;
  width: 80%;
  margin-bottom: 1.5vw;
`;

const SignUpButton = styled.button`
  background-color: #f4b400;
  color: #1c1c1c;
  padding: 2vw 4vw;
  border: none;
  border-radius: 10px;
  font-size: 3vw;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e69500;
  }
`;



const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);  // 6 columns per row
  grid-template-rows: auto;  // Allow rows to expand based on content
  gap: 3vw;
  overflow-x: auto;  // Enable horizontal scrolling
  margin: 2vh;
  white-space: nowrap;
  scroll-snap-type: x mandatory;  // Smooth horizontal scrolling
`;

const CategoryItem = styled.div`
  background-image: url(${(props) => props.$bgImage});
  background-size: cover;
  background-position: center;
  min-width: 45vw;
  height: 15vh;
  padding: 2vw;
  margin: 2vw;
  text-align: center;
  font-size: 2vw;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: ${(props) => (props.active ? '2px solid #4CAF50' : '2px solid transparent')};
  opacity: ${(props) => (props.active ? 0.9 : 1)};

  &:hover {
    background-color: rgba(54, 69, 79, 0.8);
    opacity: 0.8;
    transform: scale(1.05);
  }

  & > span {
    font-size: ${(props) => (props.active ? '3.5vw' : '3vw')};
    font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
    color: ${(props) => (props.active ? '#333333' : '#4A4A4A')};
  }
`;




const EcommerceHome = ({ previousRoute }) => {
  const navigate = useNavigate();
  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Electronics');
  const [level, setLevel] = useState(0);
  const [filterPrice, setFilterPrice] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [greenPoints, setGreenPoints] = useState(0);
  const [showEcoFriendly, setShowEcoFriendly] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(true);

  const [searchResults, setSearchResults] = useState([]);
  
  const [isSearching, setIsSearching] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [category, setCategory] = useState(['Gadgets', 'Furniture', 'Essentials', 'Best Sellers', 'New Arrivals', 'Eco-Friendly']);

  // State to track if the wishlist is active or not
  const [isWishlistActive, setIsWishlistActive] = useState(false);

  const [wishlistStatus, setWishlistStatus] = useState({});
  const [userId, setUserId] = useState('');

  // New state to track animation
  const [animatingProductId, setAnimatingProductId] = useState(null); // Tracks which product is animating


  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [cart, setCart] = useState([]);


  const [isScrolled, setIsScrolled] = useState(false);

  const [showBackToTop, setShowBackToTop] = useState(false);  // State for "Back to Top" button

   // Reference to the levelContainer element
   const levelContainerRef = useRef(null);



  const [fromSellBuy, setFromSellBuy] = useState(false);


  const [greenPointsInCart, setGreenpointsincart] = useState(0);

  useEffect(() => {

    if (previousRoute === '/sell-buy') {
      setFromSellBuy(true);
    }
    console.log('Previous Route....:', previousRoute);
  }, [previousRoute]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('https://recycle-backend-apao.onrender.com/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUserId(response.data.id);
        setGreenPoints(response.data.greenpoints);
        setLevel(Math.floor(Number(response.data.greenpoints) / 100));
        console.log('level..greenpoints..',level,greenPoints);
        const savedCart = response.data.shoppingSavedCart || [];
        localStorage.setItem('userId', JSON.stringify(userId));

        const updatedCart = await Promise.all(
          savedCart.map(async (item) => {
            const response = await axios.get(`https://recycle-backend-apao.onrender.com/api/products/${item.productId}`);
            const productDetails = response.data;
    
            return {
              ...item,
              name: productDetails.name,
              price: productDetails.price,
              images: productDetails.images[0],
              greenPoints: productDetails.greenPoints,
              ecoFriendly: productDetails.ecoFriendly,
              discount: productDetails.discount,
            };
          })
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        console.log('carttt..',cart);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://recycle-backend-apao.onrender.com/products');
        setProducts(response.data);
        setLoading(false);
        console.log('Products..',products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    setTimeout(() => {
      setShowLoadingSpinner(false);
      fetchProfileData();
      fetchProducts();
    }, 4500);



const handleScroll = () => {
  const levelContainerHeight = levelContainerRef.current?.offsetHeight;
  const scrollTop = window.scrollY;

  if (levelContainerHeight) {
    const scrolled = scrollTop > levelContainerHeight;
    setIsScrolled(scrolled);
    setShowBackToTop(scrolled);  
  }
};

window.addEventListener('scroll', handleScroll);

return () => {
  window.removeEventListener('scroll', handleScroll);
};

  }, []);

   const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const removeFromCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.name === item.name);
      if (existingItem.quantity > 1) {
        return prevCart.map((cartItem) =>
          cartItem.name === item.name ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
        );
      } else {
        return prevCart.filter((cartItem) => cartItem.name !== item.name);
      }
    });
  };




  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handlePaymentClick = () => {
    if (getTotalPrice() === '0.00') {
      alert('Please add items to the cart.');
    } else {
      handleSaveCart( cart );
      localStorage.setItem('cart', JSON.stringify( cart));
      navigate('/EcommerceWallet', { state: { cart, greenPointsInCart } });

    }
  };

  const handleSaveCart = async () => {
    try {
      // Fetch product details and update the cart
      const updatedCart = await Promise.all(
        cart.map(async (item) => {
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
      

      localStorage.setItem('cart', JSON.stringify(updatedCart));
  

      const transformedCart = updatedCart.map(item => ({
        productId: item.productId,
        quantity: item.quantity, 
        dateAdded: new Date(),  
      }));
  
      console.log('Transformed cart...', transformedCart);
  
      const response = await axios.post(
        'https://recycle-backend-apao.onrender.com/api/saveCart',
        { cart: transformedCart ,id:userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      alert(response.data.message);
    } catch (error) {
      console.error('Error saving cart:', error);
      alert('Failed to save cart.');
    }
  };
  

  const Footer = ({ navigate }) => (
                    <Row style={{ position: 'fixed', bottom: '0', width: '100%', backgroundColor: 'white', padding: '2vh 0', margin: '0', zIndex: 1000 }}>
                          <Col style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '3vw', color: '#4caf50', cursor: 'pointer' }}>
                              <Shop size="6vw" />
                              <span style={{ marginTop: '1vh' }}>Shopping</span>
                            </div>
                            <div onClick={() => navigate('/couponPage')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '3vw', color: '#927AE7', cursor: 'pointer' }}>
                              <TagFill size="6vw" />
                              <span style={{ marginTop: '1vh' }}>Coupons</span>
                            </div>
                            <div onClick={() => navigate('/orders-dashboard')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '3vw', color: '#927AE7', cursor: 'pointer' }}>
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

  const styles = {
    ecommerceHome: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#D6CDF6',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    marginBottom: '10vh',
  },
  levelContainer: {
    color: 'whitesmoke',
    padding: '1vw',
    textAlign: 'center',
    display: 'flex',
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.5s ease-in-out', 
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 2000,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
  searchContainer: {
    position: isScrolled ? 'fixed' : 'relative',
    top: isScrolled ? '0' : 'auto',
    width: isScrolled ? '90%' : '100%',
    left: isScrolled ? '50%' : '0',
    transform: isScrolled ? 'translateX(-50%)' : 'none',

    display: 'flex',
    alignItems: 'center',
    padding: isScrolled ? '1.5vw' : '3vw',
    backgroundColor: 'transparent',
    boxShadow: isScrolled ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: isScrolled ? '20px' : '0', 
    transition: 'all 0.5s ease-in-out',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',  // Make it transparent
    zIndex: 2,  // Place above the video
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',  // Add a subtle shadow
  },

  backToTop: {
    display: showBackToTop ? 'block' : 'none',
    position: 'fixed',
    top: '10vh',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'grey',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    padding: '1vw 3vw',
    cursor: 'pointer',
    zIndex: 101,
    fontSize: '3vw',
    transition: 'opacity 0.5s ease-in-out', 
    opacity: showBackToTop ? 1 : 0,
  },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '1vw',
      backgroundColor: '#fff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    backButton: {
      fontSize: '4vw',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
    },
    profileIcon: {
      fontSize: '6vw', 
      cursor: 'pointer',
    },
    
    levelInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontWeight: '600',
      fontFamily: 'Rhodium libre',
      fontSize: '5vw', 
      marginBottom: '2vw',
      padding: '1vw',
      width: '100%',
      zIndex: 2000,
    },
    progressInfo: {
      color: '#FFFFF0',
      fontSize: '3vw', 
      marginTop: '2vw',
      zIndex: 2000,
    },
    greenPointsInfo: {
      fontFamily: 'Rhodium libre',
      fontSize: '4vw', 
      marginLeft: 'auto', 
      marginRight: '5vw',
      zIndex: 2000,
    },
    progressBarContainer: {
      position: 'relative',
      width: '100%',
      marginTop: '3vw',
      zIndex: 2000,
    },
    progressBar: {
      backgroundColor: 'white',
      borderRadius: '10px',
      height: '2vh', 
      overflow: 'hidden',
      width: '100%',
      position: 'relative',
      zIndex: 2000,
    },
    progress: {
      backgroundColor: '#4caf50',
      height: '100%',
      width: `${greenPoints % 100}%`,
      transition: 'width 0.5s',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 2000,
    },
    checkpoint: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '1vw',
      backgroundColor: '#D6CDF6',
      borderTopLeftRadius: '5vw',
      borderBottomLeftRadius: '5vw',
      borderTopRightRadius: '5vw',
      borderBottomRightRadius: '5vw',
      zIndex: 2000,
    },    
    spinWheelButton: {
      position: 'relative',
      backgroundColor: '#4caf50',
      color: 'white',
      fontSize: '2.5vw',
      borderRadius: '5px',
      padding: '1vw',
      marginTop: '5vw',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
    },
    spinWheelBubble: {
      position: 'absolute',
      top: '-2vw',
      right: '-2vw',
      backgroundColor: 'red',
      color: 'white',
      borderRadius: '50%',
      padding: '1vw 2vw',
      fontSize: '2.5vw',
      zIndex: 2000,
    },
    section: {
      overflowY: 'auto',
      flex: 1,
    },
    categoriesContainer: {
      display: 'flex',
      flexDirection: 'row',
      overflowX: 'auto',
      padding: '1vw 1vw',
      whiteSpace: 'nowrap',
    },
    itemsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(40vw, 1fr))',
      gap: '2vw', 
      padding: '1vw 1vw',
      alignItems: 'start', 
    },
    categoryItem: {
      flexShrink: 0, 
      minWidth: '25vw', 
      backgroundColor: '#fff',
      fontFamily: 'Rhodium libre',
      border: '1px solid #ccc',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2vw',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginRight: '2vw', 
    },
    activeCategoryItem: {
      flexShrink: 0, 
      minWidth: '25vw', 
      backgroundColor: '#508C9B',
      border: '1px solid #ccc',
      borderRadius: '18px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2vw',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      color: 'whitesmoke',
      marginRight: '2vw',
    },
    item: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '3vw',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      minHeight: '50vh', 
    },
    wishlistIcon: {
      position: 'absolute', 
      top: '3vw', 
      right: '3vw',
      fontSize: '2vw', 
      color: '#FF6347', 
      cursor: 'pointer',
      zIndex: 10,
    },
  
    
    itemInfo: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    image: {
      width: '100%',
      height: 'auto',
      maxHeight: '30vh', 
      objectFit: 'cover',
      borderRadius: '10px 10px 0 0',
      marginBottom: 'auto',
    },
    itemName: {
      fontWeight: 'bold',
      fontSize: '2.5vw', 
      marginTop: '2vh',
      textAlign: 'center',
    },
    price: {
      fontSize: '3vw',
      color: '#757575',
      textAlign: 'center',
      marginTop: '1vh',
    },
    filterSortContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2vw',
    },
    select: {
      padding: '2vw',
      borderRadius: '5px',
      border: '1px solid #ccc',
    },
    toggleButton: {
      backgroundColor: showEcoFriendly ? '#CFE77A' : '#fff',
      color: showEcoFriendly ? '#36454F' : 'black',
      border: 'none',
      padding: '2vw 2vw',
      borderRadius: '5px',
      cursor: 'pointer',
      marginRight: 'auto',
      marginTop: '5vw',
    },
    filterIcon: {
      marginLeft: '2vw',
      fontSize: '6vw',
      cursor: 'pointer',
    },
    // searchContainer: {
    //   position: 'relative',
    //   display: 'flex',
    //   alignItems: 'center',
    //   padding: '3vw',
    //   backgroundColor: '#fff',
    //   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    // },
    searchInput: {
      flex: 1,
      padding: '3vw',
      border: '1px solid #ccc',
      borderRadius: '10vw',
    },
    searchIcon: {
      marginLeft: '2vw',
      fontSize: '6vw',
      cursor: 'pointer',
    },
    levelContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'transparent',
      color: 'black',
      padding: '2vw',
    },
    levelInfoContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '77vw',
      alignItems: 'flex-start',
    },
    cartIconContainer: {
      position: 'relative',
      cursor: 'pointer',
      marginLeft: 'auto',
      marginBottom: '2vw',
      zIndex: 2000,
    },
    cartIcon: {
      fontSize: '8vw',
      width: '5vw',
      height: '5vh',
      zIndex: 2000,
    },
    cartBubble: {
      position: 'absolute',
      top: '-2vw',
      right: '-2vw',
      backgroundColor: 'red',
      color: 'white',
      borderRadius: '50%',
      padding: '1vw 2vw',
      fontSize: '3vw',
      zIndex: 2000,
    },
    cartItemsContainer: {
      display: 'flex',
      overflowX: 'scroll',
      gap: '2vw',
      padding: '2vw 0',
    },
    cartItemCard: {
      minWidth: '40vw',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '3vw',
      textAlign: 'center',
      position: 'relative',
    },
    cartItemImage: {
      width: '100%',
      height: 'auto',
      objectFit: 'cover',
      borderRadius: '10px',
      marginBottom: '2vw',
    },
    cartItemInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    cartItemName: {
      fontWeight: 'bold',
      marginBottom: '2vw',
      fontSize: '4vw',
    },
    cartItemPrice: {
      marginBottom: '2vw',
      fontSize: '4vw',
    },
    cartItemQuantity: {
      marginBottom: '2vw',
      fontSize: '4vw',
    },
    trashIcon: {
      position: 'absolute',
      top: '2vw',
      right: '2vw',
      cursor: 'pointer',
      color: 'red',
      fontSize: '6vw',
    },
    modalFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '4vw',
    },
    suggestionsContainer: {
      position: 'absolute',
      top: '100%',
      left: '0',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      zIndex: 10,
      width: '100%',
    },
    suggestionItem: {
      padding: '2vw',
      cursor: 'pointer',
      textAlign: 'left',
    },



    heroSection: {
      backgroundColor: '#F5F5F5',
      padding: '1vw',
      marginBottom: '1vw',
    },
    heroBackground: {
      backgroundImage: 'url("/path-to-eco-friendly-background.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '60vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    heroContent: {
      textAlign: 'center',
      color: '#fff',
    },
    heroHeader: {
      fontSize: '6vw',
      fontWeight: 'bold',
      marginBottom: '2vw',
    },
    heroCTA: {
      backgroundColor: '#4CAF50',
      color: '#fff',
      padding: '2vw 4vw',
      borderRadius: '5vw',
      cursor: 'pointer',
      fontSize: '4vw',
    },
    navigationSection: {
      padding: '3vw',
      backgroundColor: '#fff',
    },
    stickyNavbar: {
      display: 'flex',
      justifyContent: 'space-around',
      fontSize: '4vw',
      position: 'sticky',
      top: 0,
      backgroundColor: '#fff',
      padding: '1vw',
    },
    categoryShowcase: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '3vw',
      padding: '4vw 0',
    },
    categoryItem: {
      backgroundColor: '#fff',
      padding: '2vw',
      textAlign: 'center',
      fontSize: '4vw',
      borderRadius: '10px',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    },
    featuredProductsSection: {
      padding: '4vw 0',
    },
    productOfWeekSection: {
      padding: '4vw 0',
      backgroundColor: '#E8F5E9',
    },
    testimonialsSection: {
      padding: '4vw 0',
      backgroundColor: '#F1F8E9',
    },
    sustainabilitySection: {
      padding: '4vw 0',
    },
    limitedOffersSection: {
      padding: '4vw 0',
      backgroundColor: '#FFEBEE',
    },
    recommendationsSection: {
      padding: '4vw 0',
      backgroundColor: '#FFFDE7',
    },
    footerSection: {
      padding: '4vw 0',
      backgroundColor: '#212121',
      color: '#fff',
    },


    themeSection: {
      top: 0,
      left: 0,
      width: '100%',
      height: '90vh',  // Adjust height if needed
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 0,
    },
    themeVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',  // Ensures video covers the whole section
    },
    themeOverlay: {
      position: 'relative',
      color: 'white',
      zIndex: 1,
      textAlign: 'center',
      fontSize: '4vw',
    },

  

    carouselContainer: {
      display: isSearching ? 'none' : 'block',
      marginTop: '2vw',
      padding: '1vw', 
      overflow: 'hidden',
    },
    carouselItem: {
      minWidth: '40vw',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '3vw',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '40vh',
    },
    carouselImage: {
      width: '100%',
      height: 'auto',
      maxHeight: '25vh',
      objectFit: 'cover',
      borderRadius: '10px 10px 0 0',
      marginBottom: 'auto',
    },
    carouselItemName: {
      fontWeight: 'bold',
      fontSize: '4vw',
      marginTop: '2vh',
    },
    carouselPrice: {
      fontSize: '4vw',
      color: '#757575',
      marginTop: '1vh',
    },
    section: {
      overflowY: 'auto',
      flex: 1,
    },
    
  };
  

  const categories = ['Electronics', 'Fashion', 'Home', 'Beauty', 'HomeLiving', 'PersonelCare', 'Stationery', 'BathroomEssentials', 'Cleaning', 'Kitchenware'];

  const handleFilterPrice = (event) => {
    setFilterPrice(event.target.value);
  };

  const handleSortOption = (event) => {
    setSortOption(event.target.value);
  };

  const handleSearch = () => {
    setIsSearching(true);
    let results = products.filter((product) => {
      const name = product.name || '';
      const brand = product.brand || '';
      const category = product.category || '';
      return (
        name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        brand.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        category.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    });
    setSearchResults(results);
  };

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      const filteredSuggestions = products.filter((product) => {
        const name = product.name || '';
        return (
          name.toLowerCase().startsWith(query.toLowerCase()) 
        );
      }).map(product => product.name);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch();
    setSuggestions([]);
  };

  const resetSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const getFilteredAndSortedItems = () => {
    let items = products.filter(product => product.category.toLowerCase().includes(selectedCategory.toLowerCase()));

    if (filterPrice) {

      items = items.filter((item) => item.price <= filterPrice);
    }

    if (showEcoFriendly) {
      items = items.filter((item) => item.ecoFriendly);
    }

    if (sortOption === 'name') {
      items = items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'price-asc') {
      items = items.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      items = items.sort((a, b) => b.price - a.price);
    }

    return items;
  };



  // Function to check if products are in the wishlist when the component loads
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const wishlistStatus = {};
        for (const product of products) {
          const response = await axios.get(`https://recycle-backend-apao.onrender.com/api/wishlist/check`, {
            params: {
              userId: userId,
              productId: product.id,
            },
          });
          wishlistStatus[product.id] = response.data.isInWishlist;
        }
        setWishlistStatus(wishlistStatus);
      } catch (error) {
        console.error('Error checking wishlist:', error);
      }
    };

    if (products.length > 0) {
      checkWishlist();
    }
  }, [products, userId]);



  const handleProductClick = async (product, index) => {
    try {
      let productId = product.id;
      if (!productId) {
        productId = `productid${Date.now()}`;
        product.id = productId;
      }
  
      const performance = product.performance || { views: 0 };
      performance.views += 1;
  
      const response = await axios.put(`https://recycle-backend-apao.onrender.com/api/products/${product.id}/update-performance`, {
        id: productId,
        performance
      });
      
      const updatedProduct = response.data;
      console.log('updatedproduct',updatedProduct );
      navigate(`/product-description/${index}`, {
        state: {
          product: updatedProduct,
          similarProducts: products.filter((p) => p.category === product.category && p.id !== product.id),
        },
      });
    } catch (error) {
      console.error('Error updating product performance:', error);
    }
  };



const updateWishlistStatus = async (productId) => {
  try {

    const response = await axios.post('https://recycle-backend-apao.onrender.com/api/wishlist/toggle', { userId, productId });
    

    setWishlistStatus((prevStatus) => ({
      ...prevStatus,
      [productId]: response.data.isActive,
    }));

    console.log('Wishlist updated successfully');
  } catch (error) {
    console.error('Error updating wishlist:', error);
  }
};

const toggleWishlist = (productId) => {
  const isActive = wishlistStatus[productId];

  if (!isActive) {
    setAnimatingProductId(productId);

    setTimeout(() => {
      setAnimatingProductId(null);
      updateWishlistStatus(productId);
    }, 1800);
  } else {

    updateWishlistStatus(productId);
  }
};

  const renderProducts = (productsList) => {
    if (productsList.length === 0) {
      return (
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#757575' }}>
          Not found
        </div>
      );
    }
  
    return productsList.map((product, index) => {


      const discountedPrice = product.price - (product.price * (product.discount / 100));
  
      const averageRating = product.reviews.length > 0
        ? (product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length).toFixed(1)
        : 0;

      const starRating = [];
      for (let i = 1; i <= 5; i++) {
        starRating.push(
          <span key={i} style={{ color: i <= averageRating ? '#FFD700' : '#CCCCCC', fontSize: '3vw' }}>★</span>
        );
      }
  
      return (
        <div
          key={index}
          style={styles.item}
        >
          <div style={styles.wishlistIcon} onClick={() => toggleWishlist(product.id)}>
              {/* Display animation only for the product being clicked */}
                {animatingProductId === product.id ? (
                  <iframe
                    src="https://lottie.host/embed/6ad88675-0a9e-4339-b6be-b4b9ca271add/7kRJvF5cAx.json"
                    style={{ width: '8vw', height: '8vw', border: 'none' }}
                    title="wishlist-animation"
                  ></iframe>
                ) : (
                  <img
                    src={wishlistStatus[product.id] ? wishlistActive : wishlistNonActive}
                    alt="Wishlist Icon"
                    style={styles.iconImage}
                  />
                )}
            </div>

          <div style={styles.itemInfo} onClick={() => handleProductClick(product, index)}>
          
            <img 
              src={product.images[0]} 
              alt={product.name} 
              style={styles.image} 
            />
            <div style={styles.itemName}>{product.name}</div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1vh' }}>
              <div style={{ fontSize: '3vw',fontWeight: 'light' }}>
                M.R.P <span style={{ textDecoration: 'line-through',color: '#72A0C1'}}>₹ {product.price} </span>
              </div>
              <div style={{ marginLeft: '1vw', color: 'black', fontSize: '2.5vw',top: 0, fontWeight: 'bold' }}>
                ₹<span style = {{marginLeft: '1vw', color: 'black', fontSize: '3.5vw' }}>{discountedPrice.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1vh' }}>
              <span style={{ fontSize: '3vw', color: '#757575', marginRight: '1vw' }}>Color:</span>
              <span style={{ fontSize: '3vw', color: '#36454F' }}>{product.attributes.color}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1vh' }}>
              <span style={{ fontSize: '3vw', color: '#757575', marginRight: '1vw' }}>Rating:</span>
              {starRating}
              <span style={{ marginLeft: '1vw', fontSize: '2.5vw', color: '#757575' }}>({product.reviews.length})</span>
            </div>
            {product.ecoFriendly && (
              <div style={styles.price}>
                Green Points: {product.greenPoints}
              </div>
            )}
          </div>
        </div>
      );
    });
  };
  

  
  if (loading) {
    if (fromSellBuy) {
      // Show the specific video loader if coming from SellBuyPage
      return (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
          <video
            src= {afterLoginScreen} // Replace with your video
            autoPlay
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      );
    }
    // Else, show the unique EcommerceHome loader
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#b29dfa' }}>
        <CenteredLoader>
          <iframe 
            src="https://lottie.host/embed/986cc7f5-3bf9-4d59-83d4-c35c6e3d608a/0mitlmdS4c.json"
            style={{ width: '300px', height: '300px', border: 'none' }}
          ></iframe>
        </CenteredLoader>
      </div>
    );
  }

  return (
    <div style={styles.ecommerceHome}>
      {!isSearching && <div id="levelContainer" ref={levelContainerRef} style={styles.levelContainer}>
                      <div style={styles.levelInfoContainer}>
                        <span style={styles.levelInfo}>
                          <ArrowLeft style={{marginRight:'2vw'}} onClick={() => navigate('/sell-buy')} size="7vw" />
                          <span role="img" aria-label="coins">🪙</span> Level - {level}
                          <span style={styles.greenPointsInfo}>
                            Green Points: {greenPoints}
                          </span>
                        </span>
                        <div style={styles.progressBarContainer}>
                          <div style={styles.progressBar}>
                            <div style={styles.progress}></div>
                            {/* Checkpoints at every 25% */}
                            <div style={{ ...styles.checkpoint, left: '33%' }}></div>
                            <div style={{ ...styles.checkpoint, left: '68%' }}></div>
                            <div style={{ ...styles.checkpoint, left: '100%' }}></div>
                          </div>
                        </div>
                        <span style={styles.progressInfo}>
                          {100 - (greenPoints % 100)} Points to next level
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={styles.cartIconContainer} onClick={() => setModalIsOpen(true)}>
                            <CartIcon cart={cart} setModalIsOpen={setModalIsOpen} />
                            {cart.length > 0 && <span style={styles.cartBubble}>{cart.length}</span>}
                          </div>
                          <button style={styles.spinWheelButton}>
                            Spin Wheel
                            {/* Bubble count for checkpoints crossed */}
                            {Math.floor((greenPoints % 100) / 33.3) > 0 && (
                              <span style={styles.spinWheelBubble}>
                                {Math.floor((greenPoints % 100) / 33.3)}
                              </span>
                            )}
                          </button>
                        </div>
                    </div>
                  }

    <div style={styles.searchContainer}>
      {isSearching && <ArrowLeft onClick={resetSearch} style={{ cursor: 'pointer', color: 'black', marginRight: '10px' }} size={30} />}
      <input
        type="text"
        placeholder="Search products, brands, categories..."
        value={searchQuery}
        onChange={handleInputChange}
        style={styles.searchInput}
      />
      <Search style={styles.searchIcon} onClick={handleSearch} />
      {suggestions.length > 0 && (
        <div style={styles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              style={styles.suggestionItem}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>

    <button style={styles.backToTop} onClick={handleBackToTop}>
      Back to Top
    </button>

    {/* New Theme Section with Autoplaying Video */}
    {!isSearching && <div style={styles.themeSection}>
              <video
                style={styles.themeVideo}
                src="https://gadupathi.s3.ap-south-1.amazonaws.com/newgreenCycle.mp4"
                autoPlay
                muted
                loop
              ></video>
              <div style={styles.themeOverlay}>
                <h2>Welcome to our Eco-Friendly Store</h2>
                <p>Promoting sustainable and eco-friendly products for a better tomorrow.</p>
              </div>
            </div>
            }


      <section style={styles.section}>
        {/* <div style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <div
              key={index}
              style={selectedCategory === category ? styles.activeCategoryItem : styles.categoryItem}
              onClick={() => setSelectedCategory(category)}
            >
              <div style={styles.itemName}>{category}</div>
            </div>
          ))}
        </div> */}
        

    <section style={styles.section}>

      <SegmentDropdown />
      <div>
        <h4>Are You Looking For ?</h4>
          <CategoryGrid>
                {[
                  'Daily Essentials & Personal Care',
                  'Sustainable Fashion',
                  'Home and Kitchen Products',
                  'Reusable & Zero-Waste Products',
                  'Eco-Friendly Electronics & Accessories',
                  'Organic and Sustainable Food Products',
                  'Eco-Friendly Packaging',
                  'Cultural Products & Artifacts',
                  'Regional Eco-Friendly Specialties',
                  'Upcycled and Recycled Products',
                ].map((category, index) => {
                  const categoryImages = [
                    'https://gadupathi.s3.ap-south-1.amazonaws.com/daily+essentials+and+personal+care+products.webp',
                    'https://gadupathi.s3.ap-south-1.amazonaws.com/eco-friendly+outfits+made+from+natural+and+recycled+materials.webp',
                    'https://gadupathi.s3.ap-south-1.amazonaws.com/essential+home+and+kitchen+items.webp',
                    'https://gadupathi.s3.ap-south-1.amazonaws.com/reusable+and+zero-waste+products.webp',
                    'https://gadupathi.s3.ap-south-1.amazonaws.com/eco-friendly+tech+accessories+and+gadgets.webp',
                    'https://gadupathi.s3.ap-south-1.amazonaws.com/Sustainable+Food+%26+Grocery.webp',
                    'https://gadupathi.s3.ap-south-1.amazonaws.com/eco-friendly+packaging+and+sustainable+stationery.webp',
                    'https://gadupathi.s3.ap-south-1.amazonaws.com/culturalArtifacts.webp',
                    'https://gadupathi.s3.ap-south-1.amazonaws.com/regionalArtifacts.webp',
                    'https://gadupathi.s3.ap-south-1.amazonaws.com/UpcycledAndRecycledProducts.webp',
                  ];

                  return (
                    <CategoryItem
                      key={index}
                      active={selectedCategory === category}
                      onClick={() => setSelectedCategory(category)}
                      $bgImage={categoryImages[index]}  // Dynamically assign the image URL
                    >
                      <span style={{ 
                          backgroundColor: 'rgba(245, 245, 245, 0.9)',
                          padding: '1.5vw', 
                          borderRadius: '10px', 
                          maxWidth: '30vw', 
                          whiteSpace: 'normal',
                          overflowWrap: 'break-word',
                          textAlign: 'center',
                          display: 'inline-block'
                        }}>
                        {category}
                      </span>
                    </CategoryItem>
                  );
                })}
              </CategoryGrid>
            </div>

        {!isSearching && <HomeContent
          categories={categories}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          suggestions={suggestions}
          handleSuggestionClick={handleSuggestionClick}
          handleSearch={handleSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />}
        <div style={styles.carouselContainer}>
              <Carousel
                    responsive={{
                      superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
                      desktop: { breakpoint: { max: 3000, min: 1024 }, items: 2 },
                      tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
                      mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
                    }}
                    autoPlay={true}
                    autoPlaySpeed={3000} // 3000 ms = 3 seconds
                    infinite={true} // Makes the carousel loop infinitely
                  >
                    {products.map((product, index) => (
                      <div key={index} style={styles.carouselItem}>
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          style={styles.carouselImage} 
                        />
                        <div style={styles.carouselItemName}>{product.name}</div>
                        <div style={styles.carouselPrice}>Price: ₹{product.price}</div>
                      </div>
                    ))}
                  </Carousel>
        </div>

        <div>
          <button style={styles.toggleButton} onClick={() => setShowEcoFriendly(!showEcoFriendly)}>
            Eco-friendly
          </button>
          <span style={styles.filterIcon} onClick={() => setFilterModalIsOpen(true)}>
            <Filter />
          </span>
        </div>

        <div style={styles.itemsContainer}>
          {searchResults.length > 0 ? renderProducts(searchResults) : renderProducts(getFilteredAndSortedItems())}
        </div>
        {/* Footer Section */}
            <ContentFooterSection>
              <FooterColumn>
                  <FooterTitle>Newsletter</FooterTitle>
                  <NewsletterText>Get 10% off your first order! Sign up for eco-friendly tips and product updates.</NewsletterText>
                  <EmailInput type="email" placeholder="Your Email" />
                  <SignUpButton>Sign Up</SignUpButton>
              </FooterColumn>
                <FooterColumn>
                  <FooterTitle>Quick Links</FooterTitle>
                  <FooterLink href="#">About Us</FooterLink>
                  <FooterLink href="#">FAQs</FooterLink>
                  <FooterLink href="#">Return Policy</FooterLink>
                  <FooterLink href="#">Sustainability</FooterLink>
                  <FooterLink href="#">Contact Us</FooterLink>
                </FooterColumn>
                <FooterColumn>
                  <FooterTitle>Follow Us</FooterTitle>
                  <SocialIconsContainer>
                    <SocialIcon src="https://gadupathi.s3.ap-south-1.amazonaws.com/facebook.png" alt="Facebook" />
                    <SocialIcon src="https://gadupathi.s3.ap-south-1.amazonaws.com/instagram.png" alt="Instagram" />
                    <SocialIcon src="https://gadupathi.s3.ap-south-1.amazonaws.com/twitter.png" alt="Twitter" />
                  </SocialIconsContainer>
                </FooterColumn>
            </ContentFooterSection>

      </section>
      <Footer navigate={navigate} />

</section>
      <Modal
        isOpen={filterModalIsOpen}
        onRequestClose={() => setFilterModalIsOpen(false)}
        style={styles.filterModal}
        contentLabel="Filter Options"
      >
        <h2>Filter Options</h2>
        <div style={styles.filterSortContainer}>
          <select style={styles.select} value={filterPrice} onChange={handleFilterPrice}>
            <option value="">Filter by price</option>
            <option value="100">Up to ₹100</option>
            <option value="200">Up to ₹200</option>
            <option value="300">Up to ₹300</option>
            <option value="400">Up to ₹400</option>
            <option value="500">Up to ₹500</option>
            <option value="600">Up to ₹600</option>
            <option value="700">Up to ₹700</option>
            <option value="800">Up to ₹800</option>
            <option value="900">Up to ₹900</option>
            <option value="1000">Up to ₹1000</option>
          </select>
          <select style={styles.select} value={sortOption} onChange={handleSortOption}>
            <option value="">Sort by</option>
            <option value="name">Alphabetical</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </Modal>
      <CartModal
          modalIsOpen={modalIsOpen}
          setModalIsOpen={setModalIsOpen}
          cart={cart}
          getTotalPrice={getTotalPrice}
          greenPointsInCart={greenPointsInCart}
          removeFromCart={removeFromCart}
          handlePaymentClick={handlePaymentClick}
          handleSaveCart={handleSaveCart}
        />

    </div>
  );
};

export default EcommerceHome;
