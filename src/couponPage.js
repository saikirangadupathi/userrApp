import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { Row, Col, Spinner } from 'react-bootstrap';
import { Shop, ListCheck, TagFill, PersonCircle, ArrowLeft, Search } from 'react-bootstrap-icons';


Modal.setAppElement('#root');

const ButtonGroupWrapper = styled.div`
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 15px;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

const PriceButton = styled.button`
  border: none;
  padding: 10px;
  flex: 0 0 auto;
  cursor: pointer;
  background-color: white;
  color: black;
  margin-right: 5px;
  border-radius: 5px;
`;

const CenteredLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #b29dfa;
`;

const CouponPage = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [purchasedVouchers, setPurchasedVouchers] = useState([]);
  const [couponsByCategory, setCouponsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('https://recycle-backend-apao.onrender.com/api/coupons');
        const coupons = response.data;
        
        // Group coupons by category
        const groupedCoupons = coupons.reduce((acc, coupon) => {
          const { category } = coupon;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(coupon);
          return acc;
        }, {});
        
        setCouponsByCategory(groupedCoupons);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };
    setTimeout(() => {
      setShowLoadingSpinner(false);
      fetchCoupons();
    }, 1400);
  }, []);

  const styles = {
    couponPage: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#D6CDF6',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '10px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    backButton: {
      fontSize: '24px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      color: 'whitesmoke'
    },
    profileIcon: {
      fontSize: '24px',
      cursor: 'pointer',
    },
    section: {
      marginTop: '10px',
      padding: '20px',
      overflowY: 'auto',
      flex: 1,
    },
    categoryContainer: {
      marginBottom: '20px',
    },
    categoryHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      fontFamily: 'Albert-Sans',
      fontSize: '30px',
      fontWeight: 'bold',
    },
    couponGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr', // Single column layout
      gap: '10px',
    },
    couponCard: {
      position: 'relative',
      padding: '20px',
      backgroundSize: 'cover', // Ensures the background image covers the entire card
      backgroundPosition: 'center', // Centers the image within the card
      borderRadius: '10px',
      minHeight: '200px', // Ensures the card has a minimum height
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden', // Ensures that the content stays within the borders
    },
    couponContent: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)', // Light transparent background
      borderRadius: '20px', // Rounded corners
      padding: '10px 20px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    couponText: {
      color: '#333', // Darker text color for better readability
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    couponCode: {
      color: '#555',
      fontSize: '14px',
    },
    showAllButton: {
      marginTop: '10px',
      padding: '10px 20px',
      backgroundColor: '#8ce08a',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    modal: {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        width: '400px',
        borderRadius: '10px',
      },
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px',
      backgroundColor: '#fff',
      boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.1)',
      position: 'fixed',
      bottom: 0,
      width: '100%',
    },
    footerIcon: {
      fontSize: '14px',
      textAlign: 'center',
      cursor: 'pointer',
    },
    radioContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
      marginTop: '10px',
    },
    radioOption: {
      marginBottom: '10px',
    },
    purchasedVouchers: {
      height: '40px',
      fontFamily: 'Rhodium libre',
      fontSize: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      position: 'fixed',
      width: '100%',
    },
    addButton: {
      backgroundColor: '#6a1b9a',
      color: '#fff',
      border: 'none',
      padding: '10px',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    searchContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    searchInput: {
      flex: 1,
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    searchIcon: {
      marginLeft: '10px',
      fontSize: '24px',
      cursor: 'pointer',
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
      padding: '10px',
      cursor: 'pointer',
      textAlign: 'left',
    },
  };

  const handleShowAll = (category) => {
    setExpandedCategories((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const handleCouponClick = (coupon) => {
    setSelectedCoupon(coupon);
    setModalIsOpen(true);
  };

  const handlePayment = async () => {
    const orderId = `ORD${new Date().getTime()}`;
    const order = {
      orderId,
      ...selectedCoupon,
      date: new Date().toLocaleDateString(),
      price: selectedPrice,
      status: 'Not Redeemed',
    };
    console.log('price..',(order.price).toString());
    setPurchasedVouchers([...purchasedVouchers, order]);
    alert('Purchase successful');
    setModalIsOpen(false);
    setSelectedPrice(null);
  
    try {
      await axios.post('https://recycle-backend-apao.onrender.com/addPurchasedVoucher', {
        orderId: orderId,
        name: selectedCoupon.name,
        price: (order.price).toString(),
        dateOfPurchase: new Date().toLocaleDateString(),
        expiryDate: selectedCoupon.expiryDate,
        location: "",
      });
    } catch (error) {
      console.error("Error posting voucher details:", error);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    setSearchQuery(searchQuery.toLowerCase());
  };

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      const filteredSuggestions = Object.keys(couponsByCategory).filter(category => {
        return category.toLowerCase().startsWith(query.toLowerCase()) || 
               couponsByCategory[category].some(coupon => coupon.name.toLowerCase().startsWith(query.toLowerCase()));
      });
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    handleSearch();
  };

  const resetSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSuggestions([]);
  };

  const filteredCategories = Object.keys(couponsByCategory).filter(category => {
    if (searchQuery === '') return true;
    if (category.toLowerCase().includes(searchQuery)) return true;
    return couponsByCategory[category].some(coupon => coupon.name.toLowerCase().includes(searchQuery));
  });

  const Footer = ({ navigate }) => (
    <Row style={{ position: 'fixed', bottom: '0', width: '100%', backgroundColor: 'white', padding: '10px 0', margin: '0' }}>
      <Col style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <div onClick={() => navigate('/EcommerceHome')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#927AE7', cursor: 'pointer' }}>
          <Shop size={30} />
          <span>Shopping</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#4caf50', cursor: 'pointer' }}>
          <TagFill size={30} />
          <span>Coupons</span>
        </div>
        <div onClick={() => navigate('/orders-dashboard')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#927AE7', cursor: 'pointer' }}>
          <ListCheck size={30} />
          <span>OrdersList</span>
        </div>
        <div onClick={() => navigate('/profile')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#927AE7', cursor: 'pointer' }}>
          <PersonCircle size={30} />
          <span>Profile</span>
        </div>
      </Col>
    </Row>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',  backgroundColor: '#b29dfa' }}>
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
    <div style={styles.couponPage}>
      <header onClick={() => navigate('/purchased-Vouchers', { state: { purchasedVouchers } })} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: '#201E43', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' , height: '80px'}}>
        <h3 style={{fontFamily: 'Rhodium-libre',color: 'whitesmoke'}} >
          Purchased Vouchers
        </h3>
        <button style={styles.backButton}>&rarr;</button>
      </header>
      <div style={styles.searchContainer}>
        {isSearching && <ArrowLeft onClick={resetSearch} style={{ cursor: 'pointer', color: 'black', marginRight: '10px' }} size={30} />}
        <input
          type="text"
          placeholder="Search categories or coupons..."
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
      <section style={styles.section}>
        {filteredCategories.map((category) => (
          <div key={category} style={styles.categoryContainer}>
            <div style={styles.categoryHeader}>
              {category}
            </div>
            <div style={styles.couponGrid}>
            {couponsByCategory[category]
            .slice(0, expandedCategories[category] ? undefined : 1) // Show only one card initially
            .map((coupon) => (
              <div
                key={coupon.id}
                style={{
                  ...styles.couponCard,
                  backgroundImage: `url(${coupon.imageUrl})`, // Set the background image to the coupon's imageUrl
                }}
                onClick={() => handleCouponClick(coupon)}
              >
                <div style={styles.couponContent}>
                    <div style={styles.couponText}>{coupon.name}</div>
                    <div style={styles.couponCode}>{coupon.code}</div>
                  </div>
              </div>
            ))}
            </div>
            <button style={styles.showAllButton} onClick={() => handleShowAll(category)}>
              {expandedCategories[category] ? 'Show Less' : 'Show All'}
            </button>
          </div>
        ))}
      </section>
      <Footer navigate={navigate} />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={styles.modal}
        contentLabel="Coupon Details"
      >
        {selectedCoupon && (
          <>
            <h2>{selectedCoupon.name}</h2>
            <p>{selectedCoupon.description}</p>
            <div>Use Code: {selectedCoupon.code}</div>
            <p>Green Points: {selectedCoupon.greenPoints}</p>
            <ButtonGroupWrapper>
              <StyledButtonGroup>
                {[200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700].map((price) => (
                  <PriceButton
                    key={price}
                    onClick={() => setSelectedPrice(price)}
                    style={{ backgroundColor: selectedPrice === price ? '#6a1b9a' : 'white', color: selectedPrice === price ? 'white' : 'black' }}
                  >
                    ₹{price}
                  </PriceButton>
                ))}
              </StyledButtonGroup>
            </ButtonGroupWrapper>
            {selectedPrice && <p>Amount to be paid: ₹{selectedPrice}</p>}
            <div style={styles.radioContainer}>
              <label style={styles.radioOption}>
                <input
                  type="radio"
                  value="upi"
                  checked={selectedPaymentMethod === 'upi'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                UPI Payment
              </label>
              <label style={styles.radioOption}>
                <input
                  type="radio"
                  value="razorpay"
                  checked={selectedPaymentMethod === 'razorpay'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                Razorpay Payment
              </label>
            </div>
            <button style={styles.addButton} onClick={handlePayment}>Make Payment</button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default CouponPage;
