import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Carousel, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { Cart, Trash } from 'react-bootstrap-icons';

const ProductDescriptionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, similarProducts } = location.state;

  const [currentProduct, setCurrentProduct] = useState(product);
  const [currentSimilarProducts, setCurrentSimilarProducts] = useState(similarProducts);
  const [modalIsOpen, setModalIsOpen] = useState(false);


// //////////////////

  const [cart, setCart] = useState([]);

  const [greenPointsInCart, setGreenpointsincart] = useState(0);



  let totalDiscountedPrice = 0; // Variable to store the sum of all discounted prices


  useEffect(() => {
    const totalGreenPoints = cart.reduce((total, item) => {
      return total + parseInt(item.greenPoints, 10);
    }, 0);

    setGreenpointsincart(totalGreenPoints);
  }, [cart])




//////////////////////

  const [question, setQuestion] = useState('');

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState('');

  const [level, setLevel] = useState(0);
  const [isGiftWrap, setIsGiftWrap] = useState(false);
  const [greenPoints, setGreenPoints] = useState(0);
  const [userId, setUserId] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([
    // Sample saved addresses
    { name: 'gaduparthi sai teja', phone: '9390438443', address: 'plot no 37& 52,madhura nagarr,nizampet,telangana -500090' },
    { name: 'leoo', phone: '0987654321', address: 'plot -31,madhura nagarr,nizampet,telangana -500090' },
  ]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUserId(response.data.id);
        console.log('userrId..',userId);
        setGreenPoints(response.data.greenPoints || 0);
        setLevel(Math.floor(response.data.greenPoints / 100));

        // Save shoppingSavedCart to local storage as 'cart'
        const savedCart = response.data.shoppingSavedCart || [];
        localStorage.setItem('userId', JSON.stringify(userId));

        const updatedCart = await Promise.all(
          savedCart.map(async (item) => {
            const response = await axios.get(`http://localhost:8080/api/products/${item.productId}`);
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

        console.log('carttt..',cart);


      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfileData();

    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);

    const productDetailsSection = document.getElementById('productDetails');
      if (productDetailsSection) {
        productDetailsSection.style.display = 'block';
      }
  }, []);

  const styles = {
    container: {
      padding: '10px',
      backgroundColor: '#D6CDF6',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
  productSection: {
    padding: '7px',
    borderRadius: '10px',
    backgroundColor: '#f1f1f1',
  },
    cartIconContainer: {
      position: 'relative',
      cursor: 'pointer',
    },
    cartIcon: {
      fontSize: '24px',
    },
    cartBubble: {
      position: 'absolute',
      top: '-10px',
      right: '-10px',
      backgroundColor: 'red',
      color: 'white',
      borderRadius: '50%',
      padding: '2px 6px',
      fontSize: '12px',
    },
    productHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    productName: {
      fontSize: '24px',
      fontWeight: 'bold',
    },
    averageRating: {
      display: 'flex',
      alignItems: 'center',
    },
    imageSlider: {
      width: '100%',
      height: '40vh',         // Set a fixed height for the entire carousel
      marginBottom: '20px',
    },
    carouselItem: {
      width: '100%',
      height: '100%',  
      justifyContent: 'center',
      alignItems: 'center',  
      marginBottom: '10px',     // Ensure each Carousel.Item takes up the full height of the imageSlider
    },
    image: {
      maxWidth: '100%',        // Image scales to fit the container width
      height: '40vh',     // Image scales to fit the container height
      objectFit: 'contain',    // Ensures the whole image fits within the container without cropping
      borderRadius: '10px',
    },

    imageContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff', // White background to fill any empty space around the image
    },
    choicesSection: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginBottom: '20px',
    },
    choiceCard: {
      flex: '0 0 100px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '10px',
      textAlign: 'center',
      cursor: 'pointer',
    },
    productInfo: {
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
    },
    addressSection: {
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },

    giftWrapSection: {
      display: 'flex',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      position: 'relative', 
      width: '100%' ,
      marginBottom: '20px'
    },
    addressContainer: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '10px',
      cursor: 'pointer',
      marginBottom: '20px',
    },
    locationIcon: {
      marginRight: '10px',
    },
    addressText: {
      fontSize: '16px',
    },
    savedAddressList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    savedAddressCard: {
      padding: '10px',
      backgroundColor: '#f9f9f9',
      borderRadius: '5px',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    sectionHeader: {
      cursor: 'pointer',
      padding: '10px',
      backgroundColor: '#f1f1f1',
      borderRadius: '10px',
      marginBottom: '10px',
    },
    sectionContent: {
      padding: '10px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '10px',
      display: 'none',
    },
    productGallery: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '20px',
      marginTop: '20px',
    },
    questionSection: {
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
    },
    questionInput: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      marginBottom: '10px',
    },
    questionButton: {
      backgroundColor: '#92E792',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 20px',
      cursor: 'pointer',
    },
    addButton: {
      backgroundColor: '#92E792',
      width: '30px',
      height: '30px',
      color: 'black',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    addCartButton: {
      backgroundColor: '#92E792',
      width: '180px',
      height: '40px',
      color: 'black',
      border: 'none',
      borderRadius: '13px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    BuyButton: {
      backgroundColor: '#FFFF00',
      width: '180px',
      height: '40px',
      color: 'black',
      border: 'none',
      borderRadius: '13px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
    },
    cartItemsContainer: {
      display: 'flex',
      flexDirection: 'column', // Stack items vertically instead of horizontally
      gap: '20px', // Increase gap between cart items for better spacing
      padding: '20px',
      maxHeight: '400px', // Set a max height for the cart container
      overflowY: 'auto', // Allow vertical scroll if content exceeds max height
      backgroundColor: '#f9f9f9', // Light background for the cart container
      borderRadius: '20px', // Soft rounded corners for the container
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow for a floating effect
      padding: '10px',
    },
    
    cartItemCard: {
      display: 'flex', // Use flex layout for better alignment of image and text
      justifyContent: 'space-between', // Space between image and content
      alignItems: 'center', // Vertically center items in the cart card
      backgroundColor: '#fff',
      borderRadius: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Enhanced shadow for depth
      padding: '20px',
      textAlign: 'left', // Align text to the left for a clean look
      position: 'relative',
      transition: 'transform 0.3s ease', // Smooth transition for hover effects
      '&:hover': {
        transform: 'scale(1.02)', // Slight zoom-in effect on hover for interactivity
      },
    },
    
    cartItemImage: {
      width: '120px', // Increase width for a more prominent product image
      height: '120px', // Ensure consistent image size
      objectFit: 'cover', // Maintain aspect ratio and cover the container
      borderRadius: '15px', // Rounded corners for the image
      marginRight: '20px', // Space between image and text
    },
    
    cartItemInfo: {
      display: 'flex',
      flexDirection: 'column', // Stack text elements vertically
      alignItems: 'flex-start', // Align text to the left
      flex: 1, // Allow the text area to expand and fill available space
      gap: '10px', // Space between the text elements
    },
    
    cartItemName: {
      fontWeight: 'bold',
      fontSize: '18px', // Larger font for item name
      marginBottom: '5px',
      color: '#333', // Darker color for readability
    },
    
    cartItemPrice: {
      fontSize: '16px',
      color: '#999', // Lighter color for original price
      textDecoration: 'line-through',
      marginBottom: '5px',
    },
    
    discountedPrice: {
      fontSize: '20px', // Larger size for discounted price
      color: '#27ae60', // Green color to highlight discount
    },
    
    cartItemQuantity: {
      fontSize: '16px',
      color: '#333',
    },
    
    trashIcon: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      cursor: 'pointer',
      color: '#e74c3c', // Red color for the trash icon for delete
      fontSize: '24px', // Larger icon size for emphasis
    },
    
    modalFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
      padding: '10px',
      borderTop: '1px solid #ccc', // Add subtle border to separate footer
    },
    
    cartAddButton: {
      width: '40px', // Adjust width for a more compact button
      height: '40px',
      backgroundColor: '#27ae60', // Green color for add button
      color: 'white',
      border: 'none',
      borderRadius: '50%', // Circular button
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '20px', // Increase font size for button text
      transition: 'background-color 0.3s ease',
      '&:hover': {
        backgroundColor: '#2ecc71', // Lighter green on hover
      },
    },
    
    saveButton: {
      backgroundColor: '#f39c12',
      width: '100px',
      height: '45px',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
      '&:hover': {
        backgroundColor: '#e67e22', // Darker orange on hover
      },
    },
    
    similarProductsContainer: {
      marginTop: '10px',
      display: 'flex',
      overflowX: 'auto',
      gap: '10px',
      padding: '10px 0',
    },
    similarProductCard: {
      flex: '0 0 auto',
      width: '200px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '10px',
      textAlign: 'center',
      cursor: 'pointer',
    },

    strikethrough: {
      textDecoration: 'line-through',
      color: 'black',
      marginRight: '10px',
    },
    discountedPrice: {
      color: 'green',
      fontSize: '27px', // Adjusted for larger font size
    },
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} style={{ color: '#FFFF00' }}>
          &#9733;
        </span>
      ); // Full star
    }
  
    if (halfStar) {
      stars.push(
        <span key="half" style={{ color: '#FFFF00' }}>
          &#9733;
        </span>
      ); // Half star
    }
  
    for (let i = stars.length; i < 5; i++) {
      stars.push(
        <span key={i + 5} style={{ color: 'white' }}>
          &#9734;
        </span>
      ); // Empty star
    }

    return stars;
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / reviews.length;
  };

  const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount) / 100).toFixed(2);
  };

  const handleSimilarProductClick = async (similarProduct) => {
    try {
      const response = await axios.get('http://localhost:8080/products');
      const newSimilarProducts = response.data.filter(p => p.category === similarProduct.category && p._id !== similarProduct._id);
      setCurrentProduct(similarProduct);
      setCurrentSimilarProducts(newSimilarProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.name === item.name);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.name === item.name ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
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
      // Step 1: Save the cart before fetching product details
      let userId = localStorage.getItem('userId');
      if (userId) {
        // Clean up the userId if it has extra quotes or whitespace
        userId = userId.replace(/^"|"$/g, '').trim();
      }
  
      // Transform the cart to match the backend schema (before fetching product details)
      const transformedCart = cart.map(item => ({
        productId: item.productId || item.id, 
        quantity: item.quantity,
        dateAdded: item.dateAdded || new Date(),
      }));
      console.log('transformedcart..',transformedCart);
      // Send the cart to saveCart API first
      const saveCartResponse = await axios.post(
        'http://localhost:8080/api/saveCart',
        { cart: transformedCart, id: userId },   // Send cleaned userId with the cart
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,  // Include the user's token
          },
        }
      );
  
      // Alert the success message after saving the cart
      alert(saveCartResponse.data.message);
  
      // Step 2: After saving the cart, fetch product details
      const updatedCart = await Promise.all(
        cart.map(async (item) => {
          const response = await axios.get(`http://localhost:8080/api/products/${item.productId}`);
          const productDetails = response.data;
  
          // Return updated item with fetched product details
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
  
      // Step 3: Update the cart with fetched product details and save it in local storage
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
  
      alert('Cart updated with product details!');
      
    } catch (error) {
      console.error('Error during cart save or product details fetch:', error);
      alert('Failed to save cart or fetch product details.');
    }
  };
  
  
  

  const toggleSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section.style.display === 'none' || section.style.display === '') {
      section.style.display = 'block';
    } else {
      section.style.display = 'none';
    }
  };

  const handleGiftWrapChange = (e) => {
    setIsGiftWrap(e.target.checked);
  };

  const handleSendQuestion = () => {
    console.log('Question sent:', question);
    // Add logic to send question to the server or handle it as needed
    setQuestion(''); // Clear the input after sending
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Product Description</h1>
        
        <div style={styles.cartIconContainer} onClick={() => setModalIsOpen(true)}>
          <Cart style={styles.cartIcon} />
          {cart.length > 0 && <span style={styles.cartBubble}>{cart.length}</span>}
        </div>

      </div>
      <div style={styles.productHeader}>
        <p style={styles.productName}>{currentProduct.name}</p>
        <div style={styles.averageRating}>
          {renderStars(calculateAverageRating(currentProduct.reviews))}
        </div>
      </div>
      
      <Carousel style={styles.imageSlider}>
        {currentProduct.images.map((imageUrl, index) => (
          <Carousel.Item key={index} style={styles.carouselItem}>
            <div style={styles.imageContainer}>
              <img
                className="d-block"
                src={imageUrl}
                alt={`${currentProduct.name} image ${index + 1}`}
                style={styles.image} 
              />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <div style={styles.productSection}>
            <div style={styles.choicesSection}>
              <div style={styles.choiceCard}>Color</div>
              <div style={styles.choiceCard}>Weight</div>
              <div style={styles.choiceCard}>Features</div>
            </div>
            <div style={styles.productInfo}>
              <p>
                <span>M.R.P </span>
                <span style={styles.strikethrough}>₹{currentProduct.price}</span>
                <span style={styles.discountedPrice}>
                  ₹{calculateDiscountedPrice(currentProduct.price, currentProduct.discount)} ({currentProduct.discount}% off)
                </span>
              </p>
              <p>{currentProduct.description}</p>
              {cart.find((item) => item.name === currentProduct.name) ? (
                <div style={styles.buttonContainer}>
                  <button
                    style={styles.addButton}
                    onClick={() => removeFromCart(currentProduct)}
                  >
                    -
                  </button>
                  <span>{cart.find((item) => item.name === currentProduct.name)?.quantity || 0}</span>
                  <button
                    style={styles.addButton}
                    onClick={() => addToCart(currentProduct)}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button style={styles.addCartButton} onClick={() => addToCart(currentProduct)}>Add to Cart</button>
              )}
              <button style={styles.BuyButton} onClick={() => console.log('Buy now')}>Buy Now</button>
            </div>


            <div
              style={styles.addressContainer}
              onClick={() => setShowAddressModal(true)}
            >
              <div style={styles.locationIcon}>📍</div>
              <div style={styles.addressText}>
                Deliver to: {address || 'Select an address'}
              </div>
            </div>


            <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Choose Your Location</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div style={styles.savedAddressList}>
                  {savedAddresses.map((addr, index) => (
                    <div
                      key={index}
                      style={styles.savedAddressCard}
                      onClick={() => {
                        setAddress(addr.address);
                        setShowAddressModal(false);
                      }}
                    >
                      <div>{addr.name}</div>
                      <div>{addr.phone}</div>
                      <div>{addr.address}</div>
                    </div>
                  ))}
                </div>
              </Modal.Body>
            </Modal>
            <div style={styles.giftWrapSection}>
                  <div style={{ position: 'absolute', left: '20' }}>
                    <label>
                      <input
                        type="checkbox"
                        style={{ marginRight: '10px' }}
                        checked={isGiftWrap}
                        onChange={handleGiftWrapChange}
                      />
                      Gift-wrap this order
                    </label>
                  </div>
                </div>

            <div style={styles.addressSection}>
                                  <div className="sectionHeader" style={styles.sectionHeader} onClick={() => toggleSection('productDetails')}>
                                    Product Details
                                  </div>
                                  <div className="sectionContent" id="productDetails" style={styles.sectionContent}>
                                    {<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nec venenatis eros, et tristique enim. Morbi tincidunt nec est feugiat tristique. Donec vel purus nec magna venenatis tristique. </p>}
                                  </div>
                                  <div className="sectionHeader" style={styles.sectionHeader} onClick={() => toggleSection('productSpecifications')}>
                                    Product Specifications
                                  </div>
                                  <div className="sectionContent" id="productSpecifications" style={styles.sectionContent}>
                                    {<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nec venenatis eros, et tristique enim. Morbi tincidunt nec est feugiat tristique. Donec vel purus nec magna venenatis tristique. </p>}
                                  </div>
                                  <div className="sectionHeader" style={styles.sectionHeader} onClick={() => toggleSection('aboutBrand')}>
                                    About the Brand
                                  </div>
                                  <div className="sectionContent" id="aboutBrand" style={styles.sectionContent}>
                                    {<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nec venenatis eros, et tristique enim. Morbi tincidunt nec est feugiat tristique. Donec vel purus nec magna venenatis tristique. </p>}
                                  </div>
                                  <div className="sectionHeader" style={styles.sectionHeader} onClick={() => toggleSection('additionalDetails')}>
                                    Additional Details
                                  </div>
                                  <div className="sectionContent" id="additionalDetails" style={styles.sectionContent}>
                                    {<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nec venenatis eros, et tristique enim. Morbi tincidunt nec est feugiat tristique. Donec vel purus nec magna venenatis tristique. </p>}
                                  </div>
                                
                                
                          </div>

              </div>
            <div style={styles.productGallery}>
              <h3>Product Image Gallery</h3>
              <div vertical="true">
                {currentProduct.images.map((imageUrl, index) => (
                    <div key={index} style={styles.carouselItem}>
                      <div style={styles.imageContainer}>
                        <img
                          className="d-block"
                          src={imageUrl}
                          alt={`${currentProduct.name} image ${index + 1}`}
                          style={styles.image} 
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div style={styles.questionSection}>
              <h3>Questions to Ask</h3>
              <input
                type="text"
                placeholder="Ask a question..."
                style={styles.questionInput}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button style={styles.questionButton} onClick={handleSendQuestion}>
                Send
              </button>
            </div>
            <div style={styles.reviewContainer}>
              <h3>Reviews</h3>
              {currentProduct.reviews.map((review, index) => (
                <div key={index}>
                  <p><strong>{review.user}</strong> ({new Date(review.date).toLocaleDateString()})</p>
                  <div style={styles.starContainer}>{renderStars(review.rating)}</div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
       
      <h3 style={{marginTop: '10px' }}>Similar Products</h3>
      <div style={styles.similarProductsContainer}>
          {currentSimilarProducts.map((similarProduct, index) => {
            const averageRating = calculateAverageRating(similarProduct.reviews);
            return (
              <div key={index} style={styles.similarProductCard} onClick={() => handleSimilarProductClick(similarProduct)}>
                <img
                  src={similarProduct.images[0]} 
                  alt={similarProduct.name}
                  style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                />
                <p>{similarProduct.name}</p>
                <p>
                  <span>M.R.P </span>
                  <span style={styles.strikethrough}>₹{similarProduct.price}</span>
                  <span style={styles.discountedPrice}>
                    ₹{calculateDiscountedPrice(similarProduct.price, similarProduct.discount)} ({similarProduct.discount}% off)
                  </span>
                </p>
                <div style={styles.starContainer}>{renderStars(averageRating)}</div>
                {cart.find((item) => item.name === similarProduct.name) ? (
                  <div style={styles.buttonContainer}>
                    <button
                      style={styles.addButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(similarProduct);
                      }}
                    >
                      -
                    </button>
                    <span>{cart.find((item) => item.name === similarProduct.name)?.quantity || 0}</span>
                    <button
                      style={styles.addButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(similarProduct);
                      }}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    style={styles.addCartButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(similarProduct);
                    }}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            );
          })}
        </div>
      <Modal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Cart Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={styles.cartItemsContainer}>

              {cart.map((item, index) => {
                // Calculate the discounted price if a discount is available
                const discountedPrice = item.discount ? item.price - (item.price * (item.discount / 100)) : item.price;

                // Add to the total discounted price
                totalDiscountedPrice += discountedPrice * item.quantity;

                return (
                  <div key={index} style={styles.cartItemCard}>
                    <img
                      src={item.images}
                      alt={item.name}
                      style={styles.cartItemImage}
                    />
                    <div style={styles.cartItemInfo}>
                      <span style={styles.cartItemName}>{item.name}</span>

                      {/* Display original price with strikethrough and discounted price below it */}
                      {item.discount ? (
                        <>
                          <span style={styles.cartItemPrice}>
                            <span style={styles.strikethrough}>₹{item.price}</span>{' '}
                            <span style={styles.discountedPrice}>₹{discountedPrice.toFixed(2)}</span>
                          </span>
                        </>
                      ) : (
                        <span style={styles.cartItemPrice}>₹{item.price}</span>
                      )}

                      <span style={styles.cartItemQuantity}>x{item.quantity}</span>
                      <span style={{color:"green"}}>greenPoints: {item.greenPoints}</span>
                    </div>
                    <Trash style={styles.trashIcon} onClick={() => removeFromCart(item)} />
                  </div>
                );
              })}

          </div>
          <h3>Total: ₹{getTotalPrice()}</h3>

           
          <h3>Total Green points:♻️ {greenPointsInCart}</h3>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handlePaymentClick}>
            Continue
          </Button>
          <Button variant="warning" onClick={handleSaveCart}>
            Save Cart
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductDescriptionPage;
