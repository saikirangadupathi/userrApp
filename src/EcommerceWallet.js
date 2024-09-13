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
        const response = await axios.get('https://recycle-backend-apao.onrender.com/api/profile', {
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


  

const handleApplyCoupon = async () => {
  try {
    const response = await axios.post('https://recycle-backend-apao.onrender.com/api/applyCoupon', { code: couponCode }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  
    if (response.data.success) {
      setCouponMessage('Coupon applied successfully!');
      setIsCouponError(false);
    } else {
      setCouponMessage('Invalid coupon code'); 
      setIsCouponError(true); 
    }
  } catch (error) {
    setCouponMessage('Error applying coupon');
    setIsCouponError(true);
  }
};


const handleCouponInputChange = (e) => {
  setCouponCode(e.target.value);
  setCouponMessage(''); 
  setIsCouponError(false); 
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
    const offset = 5.5 * 60 * 60 * 1000; 
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
      marginBottom: '14vh', 
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
      padding: '2vh', 
      borderRadius: '1.5vw', 
      boxShadow: '0 0.5vh 1.5vh rgba(0, 0, 0, 0.1)',
      marginBottom: '2vh', 
      transition: 'all 0.3s ease',
      margin: '1vh', 
    },
    sectionTitle: {
      fontSize: '2rem',
      fontWeight: '600',
      marginBottom: '1.5vh',
      color: '#333',
    },
    walletBalance: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1vh', 
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
      marginRight: '2vw', 
      border: '0.5vh solid #ccc',
      borderRadius: '1vw', 
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
      height: '3vw', 
      width: '3vw',
      padding: '0.7vw',
      backgroundColor: '#ccc',
      borderRadius: '1vw',
      transition: '0.3s',
    },
    customCheckboxContainerChecked: {
      border: '0.5vh solid #4caf50',
      padding: '1vw',
      backgroundColor: '#e8f5e9',
    },
    customCheckboxChecked: {
      backgroundColor: '#4caf50',
    },
    walletInputContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    walletInput: {
      padding: '1vh',
      border: '0.2vh solid #ddd',
      borderRadius: '1.5vw',
      width: '40vw',
      fontSize: '0.8rem',
      transition: 'all 0.3s ease',
    },
    remainingText: {
      fontSize: '0.8rem',
      color: '#888',
    },
    couponSection: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '1vh',
      marginBottom: '1.5vh',
    },
    couponInputContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '95vw',
      height: '7vh',
      padding: '1vw',
      border: '0.2vh solid #ddd',
      borderRadius: '1.5vw',
      overflow: 'hidden',
    },
    couponInput: {
      flex: 1,
      width: '55vw',
      padding: '1vh',
      border: '0.5vw solid #ddd',
      borderRadius: '1.5vw',
      outline: 'none',
      fontSize: '0.9rem',
    },
    applyButton: {
      backgroundColor: '#4caf50',
      color: '#fff',
      border: 'none',
      borderRadius: '1.5vw',
      padding: '1vh',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      outline: 'none',
    },
    couponMessage: {
      marginTop: '0.5vh',
      fontSize: '1.4rem',
      color: '#d32f2f',
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '1vh',
      backgroundColor: '#fff',
    },
    addButton: {
      backgroundColor: '#6a1b9a',
      color: '#fff',
      border: 'none',
      padding: '1vh',
      borderRadius: '1.2vw',
      cursor: 'pointer',
    },
    paymentSection: {
      margin: '1vh',
      backgroundColor: '#fff',
      padding: '2vh',
      borderRadius: '1.5vw',
      boxShadow: '0 0 1vh rgba(0, 0, 0, 0.1)',
      marginBottom: '19.7vh',
    },
    radioContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
    },
    radioOption: {
      marginBottom: '1vh',
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
      const response = await axios.post('https://recycle-backend-apao.onrender.com/api/updateGreenPoints', { greenpoints: newBalance }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setProfileGreenPoints(response.data.greenpoints);
    } catch (error) {
      console.error('Error updating wallet balance:', error);
    }
  };

  const updateWalletBalance = async (newBalance) => {
    try {
      const response = await axios.post('https://recycle-backend-apao.onrender.com/api/updateWallet', { wallet: newBalance }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setWalletBalance(Number(response.data.wallet) || 0);
    } catch (error) {
      console.error('Error updating wallet balance:', error);
    }
  };

  const updateReCommerceOrderHistory = async (orderData) => {
    try {
      const response = await axios.post('https://recycle-backend-apao.onrender.com/api/update-users-eCommerceOrders', orderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('e-commerceOrdersUpdated', response.data);
    } catch (error) {
      console.error('Error updating reCommerce order history:', error);
    }
  };

  const handlePayment = async () => {
    const cartDetails = cartDetailsRef.current.getDetails();

    if (!cartDetails.name) {
        alert('Name is required.');
        return;
    }
    if (!profileData.contactNumber) {
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
        userId: profileData.id,
        name: cartDetails.name,
        contact: profileData.contactNumber,
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
        const response = await axios.post('https://recycle-backend-apao.onrender.com/api/order', orderData);
        console.log('Order placed successfully:', response.data);
        alert('Order placed successfully');


        const totalGreenPoints = parseInt(profileGreenPoints) + parseInt(greenPointsInCart);
        console.log('total greenpoints', totalGreenPoints);
        localStorage.setItem('greenPoints', totalGreenPoints);

        await updateGreenPoints(totalGreenPoints);

        const newWalletBalance = walletBalance - walletAmount;
        await updateWalletBalance(newWalletBalance);

        const reCommerceOrderHistoryData = {
          userId: profileData.id,
          orderId: orderId,
          productIds: cart.map(item => item.productId),
          orderDate: new Date(),
          deliveryDate: null,
          orderValue: orderData.totalPrice,
          paymentMethod: 'UPI',
          deliveryAddress: cartDetails.address,
          orderStatus: 'Processing'
      };
        await updateReCommerceOrderHistory(reCommerceOrderHistoryData);

        setShowLottie(true);
        setTimeout(() => {
            setShowLottie(false);
            navigate('/orders-dashboard');
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
                            borderColor: isCouponError ? '#D70040' : 'transparent',
                            borderWidth: isCouponError ? '2px' : '1px',
                            borderStyle: 'solid',
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
                                      value={walletAmount === 0 ? '' : walletAmount}
                                      onChange={handleWalletAmountChange}
                                      min={1}
                                      max={Math.min(walletBalance, getTotalPrice())}
                                      style={styles.walletInput}
                                      placeholder="0"
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
