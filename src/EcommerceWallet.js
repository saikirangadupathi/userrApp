import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CartDetails from './cartDetails';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import { Shop, WalletFill, TagFill, PersonCircle } from 'react-bootstrap-icons';

const EcommerceWallet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState(location.state?.cart || []);
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [greenPointsInCart] = useState(location.state?.greenPointsInCart || 0);
  const cartDetailsRef = useRef();
  const [showLottie, setShowLottie] = useState(false);
  const [profileGreenPoints, setProfileGreenPoints] = useState('');
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);

  const [savedAddresses, setSavedAddresses] = useState(null);

  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [isCouponError, setIsCouponError] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        let finalres=response.data
          console.log('profiledata..',finalres);
          setProfileData(finalres);
          setWalletBalance(Number(finalres.wallet) || 0);
          setProfileGreenPoints(finalres.greenpoints);
          setSavedAddresses(finalres.addresses);
          console.log('addresses....',savedAddresses);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    const timer = setTimeout(() => setLoading(false), 3000);
    fetchProfileData();
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);


  
// Handle apply coupon with error handling and message inside input
const handleApplyCoupon = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/applyCoupon', { code: couponCode }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    // Assuming response has success field to determine if the coupon is valid
    if (response.data.success) {
      setCouponMessage('Coupon applied successfully!');
      setIsCouponError(false); // Reset error state
    } else {
      setCouponMessage('Invalid coupon code'); // Show error message
      setIsCouponError(true); // Set error state
    }
  } catch (error) {
    setCouponMessage('Error applying coupon');
    setIsCouponError(true); // Set error state for general errors
  }
};


// Reset coupon state when input value changes
const handleCouponInputChange = (e) => {
  setCouponCode(e.target.value);
  setCouponMessage(''); // Reset the coupon message
  setIsCouponError(false); // Reset error state
};


  console.log('profileGreenPoints',(profileGreenPoints));
  const Footer = ({ navigate }) => (
    <Row style={{ position: 'fixed', bottom: '0', width: '100%',padding: '17vh', backgroundColor: 'white', padding: '10px 0', margin: '0' }}>
      <Col style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <div onClick={() => navigate('/EcommerceHome')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#927AE7', cursor: 'pointer' }}>
          <Shop size={30} />
          <span>Shopping</span>
        </div>
        <div onClick={() => navigate('/couponPage')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#927AE7', cursor: 'pointer' }}>
          <TagFill size={30} />
          <span>Coupons</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#4caf50', cursor: 'pointer' }}>
          <WalletFill size={30} />
          <span>Wallet</span>
        </div>
        <div onClick={() => navigate('/profile')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', color: '#927AE7', cursor: 'pointer' }}>
          <PersonCircle size={30} />
          <span>Profile</span>
        </div>
      </Col>
    </Row>
  );

  function getCurrentISTDate() {
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (5 hours 30 minutes)
    const istDate = new Date(now.getTime() + offset);
    const year = istDate.getUTCFullYear();
    const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(istDate.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const styles = {
    ecommerceWallet: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#e6ebf0',
      height: '100vh',
      display: 'flex',
      paddingBottom: '10vh',
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginBottom: '14vh', // was 130px
    },
    walletContainer: {
      backgroundColor: '#92E792',
      color: 'black',
      padding: '4vw',
      textAlign: 'center',
      borderRadius: '1vw',
      margin: '2vw',
      fontSize: '2vw',
      fontWeight: 'bold'
    },
    section: {
      backgroundColor: '#f9f9f9',
      padding: '2vh', // was 20px
      borderRadius: '1.5vw', // was 12px
      boxShadow: '0 0.5vh 1.5vh rgba(0, 0, 0, 0.1)', // was 0 4px 12px
      marginBottom: '2vh', // was 20px
      transition: 'all 0.3s ease',
      margin: '1vh', // was 10px
    },
    sectionTitle: {
      fontSize: '2rem', // was 22px
      fontWeight: '600',
      marginBottom: '1.5vh', // was 15px
      color: '#333',
    },
    walletBalance: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1vh', // was 10px
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
    checkboxText: {
      marginLeft: '1vw',
      fontSize: '2.8vw',
      fontWeight: '500',
      color: '#555',
    },
    customCheckboxContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      marginRight: '2vw', // was 10px
      border: '0.5vh solid #ccc', // was 2px
      borderRadius: '1vw', // was 4px
      transition: 'all 0.3s ease',
    },
    customCheckbox: {
      position: 'absolute',
      opacity: 0,
      cursor: 'pointer',
      height: 0,
      width: 0,
    },
    customCheckboxSpan: {
      height: '3vw', // was 2vw + padding
      width: '3vw', // was 2vw + padding
      padding: '0.7vw',
      backgroundColor: '#ccc', // Default background color
      borderRadius: '1vw', // was 4px
      transition: '0.3s',
    },
    customCheckboxContainerChecked: {
      border: '0.5vh solid #4caf50', // was 2px
      padding: '1vw',
      backgroundColor: '#e8f5e9', // Light green background
    },
    customCheckboxChecked: {
      backgroundColor: '#4caf50', // Green background when activated
    },
    walletInputContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    walletInput: {
      padding: '1vh', // was 10px
      border: '0.2vh solid #ddd', // was 1px
      borderRadius: '1.5vw', // was 6px
      width: '40vw',
      fontSize: '0.8rem', // was 16px
      transition: 'all 0.3s ease',
    },
    remainingText: {
      fontSize: '0.8rem', // was 14px
      color: '#888',
    },
    couponSection: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '1vh', // was 10px
      marginBottom: '1.5vh', // was 15px
    },
    couponInputContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '95vw',
      height: '7vh',
      padding: '1vw', // was 1vw (unchanged, already optimal)
      border: '0.2vh solid #ddd', // was 1px
      borderRadius: '1.5vw', // was 6px
      overflow: 'hidden',
    },
    couponInput: {
      flex: 1,
      width: '55vw',
      padding: '1vh', // was 10px
      border: '0.5vw solid #ddd', // was 0.5vw (unchanged, already optimal)
      borderRadius: '1.5vw', // was 6px
      outline: 'none',
      fontSize: '0.9rem', // was 16px
    },
    applyButton: {
      backgroundColor: '#4caf50',
      color: '#fff',
      border: 'none',
      borderRadius: '1.5vw', // was 6px
      padding: '1vh', // was 10px
      cursor: 'pointer',
      fontSize: '0.9rem', // was 14px
      fontWeight: 'bold',
      outline: 'none',
    },
    couponMessage: {
      marginTop: '0.5vh', // was 5px
      fontSize: '1.4rem', // was 14px
      color: '#d32f2f',
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '1vh', // was 10px
      backgroundColor: '#fff',
    },
    addButton: {
      backgroundColor: '#6a1b9a',
      color: '#fff',
      border: 'none',
      padding: '1vh', // was 10px
      borderRadius: '1.2vw', // was 5px
      cursor: 'pointer',
    },
    paymentSection: {
      margin: '1vh', // was 10px
      backgroundColor: '#fff',
      padding: '2vh', // was 20px
      borderRadius: '1.5vw', // was 10px
      boxShadow: '0 0 1vh rgba(0, 0, 0, 0.1)', // was 0 0 10px
      marginBottom: '19.7vh', // was 180px
    },
    radioContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
    },
    radioOption: {
      marginBottom: '1vh', // was 10px
    },
    lottieFullScreen: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      zIndex: 9999,
    },
    iframePlayer: {
      width: '100vw',
      height: '100vh',
    },

    contentSection: {
      marginBottom: '24vh',
      paddingBottom: '10vh',
    },

  paymentSection: {
    margin: '1vh', 
    backgroundColor: '#fff',
    padding: '2vh', 
    borderRadius: '1.5vw',
    boxShadow: '0 0 1vh rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    ':hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 0 2vh rgba(0, 0, 0, 0.2)',
    }
  },
  paymentSectionTitle: {
    fontSize: '1.4rem',
    fontWeight: '600',
    marginBottom: '1vh',
    color: '#4caf50',
  },
  radioContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
  radioOption: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5vh',
    marginBottom: '1.5vh',
    border: '2px solid #ddd',
    borderRadius: '1vw',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 1vh rgba(0, 0, 0, 0.05)',
    width: '100%',
  },
  radioOptionChecked: {
    borderColor: '#4caf50',
    backgroundColor: '#e8f5e9',
    boxShadow: '0 0 1.5vh rgba(0, 0, 0, 0.15)',
  },
  radioInput: {
    marginRight: '1vw',
  },
  addButton: {
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    padding: '1.5vh', 
    borderRadius: '1.5vw',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    outline: 'none',
    marginTop: '2vh',
    width: '100%',
    transition: 'background-color 0.3s ease',
    ':hover': {
      backgroundColor: '#388e3c',
    },
  },


  };
  

  // In the parent component

const getTotalPrice = () => {
  return cart.reduce((total, item) => {
    const discountedPrice = item.discount
      ? item.price - (item.price * (item.discount / 100))
      : item.price;

    return total + (discountedPrice * item.quantity);
  }, 0).toFixed(2);
};


  const handleWalletAmountChange = (event) => {
    let value = event.target.value;
    if (!value) {
      setWalletAmount('');
      return;
    }
  
    value = parseInt(value, 10);
    if (value < 1) {
      value = 0;
    }
    setWalletAmount(value);
  };
  


  const handleWalletCheckboxChange = (e) => {
    setUseWallet(e.target.checked);
    if (!e.target.checked) {
      setWalletAmount(0);
    }
  };

  const getFinalAmount = () => {
    const totalPrice = parseFloat(getTotalPrice());
    return (totalPrice - walletAmount).toFixed(2);
  };

  const updateGreenPoints = async (newBalance) => {
    try {
      const response = await axios.post('http://localhost:8080/api/updateGreenPoints', { greenpoints: newBalance }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setProfileGreenPoints(response.data.greenpoints);
    } catch (error) {
      console.error('Error updating wallet balance:', error);
    }
  };

  const updateWalletBalance = async (newBalance) => {
    try {
      const response = await axios.post('http://localhost:8080/api/updateWallet', { wallet: newBalance }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setWalletBalance(Number(response.data.wallet) || 0);
    } catch (error) {
      console.error('Error updating wallet balance:', error);
    }
  };

  const updateReCommerceOrderHistory = async (orderData) => {
    try {
      await axios.post('http://localhost:8080/api/updateReCommerceOrderHistory', orderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
    } catch (error) {
      console.error('Error updating reCommerce order history:', error);
    }
  };

  const handlePayment = async () => {
    const cartDetails = cartDetailsRef.current.getDetails();

    // Validate required data
    if (!cartDetails.name) {
        alert('Name is required.');
        return;
    }
    if (!cartDetails.phone) {
        alert('Contact (Phone number) is required.');
        return;
    }
    if (!cartDetails.address) {
        alert('Shipping address is required.');
        return;
    }
    if (!cartDetails.location) {
        alert('Location is required.');
        return;
    }
    if (cart.length === 0) {
        alert('Cart is empty.');
        return;
    }

    const orderId = `ORD${new Date().getTime()}`;

    const orderData = {
        id: orderId.toString(),
        userId: profileData.id, // Ensure this is available in profileData
        name: cartDetails.name,
        contact: cartDetails.phone,
        location: {
            address: cartDetails.address,
            lat: cartDetails.location.lat,
            lng: cartDetails.location.lng
        },
        cart: cart.map(item => ({
            productId: item.productId,
            name: item.name,
            sellerId: item.sellerId,
            quantity: item.quantity,
            price: item.price,
            status: 'orderplaced',
        })),
        totalPrice: parseFloat(getTotalPrice()),
        status: 'orderplaced',
        date: getCurrentISTDate(),
        paymentMethod: selectedPaymentMethod,
        greenPoints: greenPointsInCart,
        orderHistory: [{
            status: 'orderplaced',
            date: new Date(),
            remarks: 'Order placed successfully'
        }]
    };
    console.log('address..',cartDetails.address); 

    try {
        const response = await axios.post('http://localhost:8080/api/order', orderData);
        console.log('Order placed successfully:', response.data);
        alert('Order placed successfully');

        // Update green points in local storage
        const totalGreenPoints = parseInt(profileGreenPoints) + parseInt(greenPointsInCart);
        console.log('total greenpoints', totalGreenPoints);
        localStorage.setItem('greenPoints', totalGreenPoints);

        await updateGreenPoints(totalGreenPoints);

        // Update wallet balance
        const newWalletBalance = walletBalance - walletAmount;
        await updateWalletBalance(newWalletBalance);

        // Update reCommerceOrderHistory
        const reCommerceOrderHistoryData = {
            id: orderId,
            totalPrice: orderData.totalPrice,
            date: orderData.date,
            greenpoints: greenPointsInCart
        };
        await updateReCommerceOrderHistory(reCommerceOrderHistoryData);

        // Show Lottie animation
        setShowLottie(true);
        // Hide Lottie animation after 5.5 seconds
        setTimeout(() => {
            setShowLottie(false);
        }, 4500);
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Error placing order');
    }
};


  return (
    <>
      {showLottie && (
        <div style={styles.lottieFullScreen}>
          <iframe 
            src="https://lottie.host/embed/bc670896-1c25-4765-ac0d-f4bb2f5e800a/UmXfG7vjzs.json" 
            style={styles.iframePlayer}
            title="Order Confirmation Animation"
          ></iframe>
        </div>
      )}
      {!showLottie && (
        <div style={styles.ecommerceWallet}>
          <div style={styles.walletContainer}>
            <div style={{ fontSize: '18px', marginBottom: '10px' }}>
              <span role="img" aria-label="coins">🪙</span> Wallet Balance: ₹{walletBalance.toFixed(2)}
            </div>
          </div>
          {cart.length > 0 && (
              <CartDetails
                ref={cartDetailsRef}
                getTotalPrice={getTotalPrice}
                useWallet={useWallet}
                walletAmount={walletAmount}
                getFinalAmount={getFinalAmount}
                usersSavedAddresses={savedAddresses} 
              />
          )}
          <div style={styles.contentSection}>
            <section style={styles.section}>
                    <div style={styles.couponSection}>
                    <div 
                          style={{
                            ...styles.couponInputContainer,
                            borderColor: isCouponError ? '#D70040' : 'transparent', // Change border color based on error
                            borderWidth: isCouponError ? '2px' : '1px', // Adjust the border width if needed
                            borderStyle: 'solid', // Ensure the border is solid
                          }}
                        >
                          <input
                            type="text"
                            placeholder={couponMessage || 'Enter coupon code'}
                            value={couponCode}
                            onChange={handleCouponInputChange}
                            style={styles.couponInput}
                          />
                          <button 
                            style={styles.applyButton} 
                            onClick={isCouponError ? () => setCouponCode('') : handleApplyCoupon}
                          >
                            {isCouponError ? '❌' : 'APPLY'}
                          </button>
                        </div>
                    </div>


                    <div style={styles.walletBalance}>
                    <label style={styles.checkboxLabel}>
                            <div
                              style={{
                                ...styles.customCheckboxContainer,
                                ...(useWallet ? styles.customCheckboxContainerChecked : {}),
                              }}
                            >
                              <input
                                type="checkbox"
                                style={styles.customCheckbox}
                                checked={useWallet}
                                onChange={handleWalletCheckboxChange}
                              />
                              <span
                                style={{
                                  ...styles.customCheckboxSpan,
                                  ...(useWallet ? styles.customCheckboxChecked : {}),
                                }}
                              ></span>
                            </div>
                            <span style={styles.checkboxText}>Use Wallet Balance</span>
                          </label>
                        {useWallet && (
                            <div style={styles.walletInputContainer}>
                                <input
                                      type="number"
                                      className="walletInput"
                                      value={walletAmount === 0 ? '' : walletAmount} // Show empty if zero
                                      onChange={handleWalletAmountChange}
                                      min={1} // Ensure the input cannot go below 1
                                      max={Math.min(walletBalance, getTotalPrice())}
                                      style={styles.walletInput}
                                      placeholder="0" // Placeholder for empty input
                                    />

                                <div style={styles.remainingText}>
                                    Remaining: ₹{(walletBalance - walletAmount).toFixed(2)}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

          <section style={styles.paymentSection}>
                    <h3 style={styles.paymentSectionTitle}>Choose Payment Method</h3>
                    <div style={styles.radioContainer}>
                      <label
                        style={{
                          ...styles.radioOption,
                          ...(selectedPaymentMethod === 'upi' ? styles.radioOptionChecked : {}),
                        }}
                      >
                        <input
                          type="radio"
                          value="upi"
                          checked={selectedPaymentMethod === 'upi'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          style={styles.radioInput}
                        />
                        UPI Payment
                      </label>
                      <label
                        style={{
                          ...styles.radioOption,
                          ...(selectedPaymentMethod === 'razorpay' ? styles.radioOptionChecked : {}),
                        }}
                      >
                        <input
                          type="radio"
                          value="razorpay"
                          checked={selectedPaymentMethod === 'razorpay'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          style={styles.radioInput}
                        />
                        Razorpay Payment
                      </label>
                    </div>
                    <button style={styles.addButton} onClick={handlePayment}>
                      Make Payment
                    </button>
                  </section>
              </div>
          <Footer navigate={navigate} />
        </div>
      )}
    </>
  );
};

export default EcommerceWallet;
