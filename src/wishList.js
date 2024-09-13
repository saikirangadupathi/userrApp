import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import axios from 'axios';

import wishlistActive from './wishlistActive.png';
import wishlistNonActive from './wishlistNonActive.png';

const styles = {
  productGridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(35vw, 1fr))',
    gap: '30px',
    padding: '20px',
    justifyContent: 'center',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: '15px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    padding: '5vw',
    width: '45vw',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    height: '100%',
  },
  productCardHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
  },
  wishlistIcon: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
    zIndex: 1,
    transition: 'opacity 0.2s ease-in-out',
  },
  iconImage: {
    width: '30px',
    height: '30px',
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px 0',
  },
  image: {
    width: '100%',
    height: 'auto',
    maxHeight: '25vh',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '15px',
    transition: 'transform 0.3s ease',
  },
  itemName: {
    fontWeight: '600',
    fontSize: '4vw',
    color: '#333',
    marginBottom: '2vw',
  },
  priceSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10px',
  },
  originalPrice: {
    textDecoration: 'line-through',
    color: '#999',
    marginRight: '10px',
    fontSize: '3vw',
  },
  discountedPrice: {
    fontSize: '20px',
    color: 'black',
    fontWeight: '700',
  },
  starRating: {
    marginTop: '10px',
  },
  star: {
    color: '#FFD700',
    fontSize: '4vw',
  },
  ecoFriendlyBadge: {
    backgroundColor: '#4caf50',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '12px',
    marginTop: '15px',
    fontSize: '3vw',
  },
};

const WishlistProducts = () => {
  const [products, setProducts] = useState([]);
  const [userWishlist, setUserWishlist] = useState([]);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const [animatingProductId, setAnimatingProductId] = useState(null);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [userId, setUserId] = useState('');

  const navigate = useNavigate();  // Initialize navigate

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('https://recycle-backend-apao.onrender.com/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const profileData = response.data;
        setUserId(profileData.id);
        const wishlistProductIds = profileData.wishlist ? profileData.wishlist.map(item => item.productId) : [];

        const productResponse = await axios.get('https://recycle-backend-apao.onrender.com/api/products');
        setProducts(productResponse.data);

        const initialWishlistStatus = {};
        productResponse.data.forEach(product => {
          initialWishlistStatus[product.id] = wishlistProductIds.includes(product.id);
        });

        setUserWishlist(wishlistProductIds);
        setWishlistStatus(initialWishlistStatus);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const toggleWishlist = async (productId) => {
    try {
      const isCurrentlyInWishlist = wishlistStatus[productId];
      setAnimatingProductId(productId);

      const response = await axios.post('https://recycle-backend-apao.onrender.com/api/wishlist/toggle', { userId, productId });
      const newStatus = response.data.isActive;

      setTimeout(() => {
        setWishlistStatus((prevStatus) => ({
          ...prevStatus,
          [productId]: newStatus,
        }));

        setUserWishlist((prevWishlist) => {
          if (newStatus) {
            return [...prevWishlist, productId];
          } else {
            return prevWishlist.filter((id) => id !== productId);
          }
        });

        setAnimatingProductId(null);
      }, 1500);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  // Function to handle product click, update performance, and navigate to description page
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
        performance,
      });

      const updatedProduct = response.data;
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

  const renderProducts = (productsList) => {
    const wishlistProducts = productsList.filter((product) => userWishlist.includes(product.id));

    if (wishlistProducts.length === 0) {
      return (
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#757575' }}>
          No wishlist items found.
        </div>
      );
    }

    return wishlistProducts.map((product, index) => {
      const discountedPrice = product.price - (product.price * (product.discount / 100));
      const averageRating = product.reviews.length > 0
        ? (product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length).toFixed(1)
        : 0;

      return (
        <div
          key={index}
          style={hoveredProductId === product.id ? { ...styles.productCard, ...styles.productCardHover } : styles.productCard}
          onMouseEnter={() => setHoveredProductId(product.id)}
          onMouseLeave={() => setHoveredProductId(null)}
        >
          <div style={styles.wishlistIcon} onClick={() => toggleWishlist(product.id)}>
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

          <div
            style={styles.itemInfo}
            onClick={() => handleProductClick(product, index)} // Handle product click
          >
            <img src={product.images[0]} alt={product.name} style={styles.image} />
            <div style={styles.itemName}>{product.name}</div>

            <div style={styles.priceSection}>
              <span style={styles.originalPrice}>₹{product.price}</span>
              <span style={styles.discountedPrice}>₹{discountedPrice.toFixed(2)}</span>
            </div>

            <div style={styles.starRating}>
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} style={{ color: i < averageRating ? '#FFD700' : '#CCCCCC', fontSize: '16px' }}>★</span>
              ))}
              <span style={{ marginLeft: '10px', fontSize: '14px', color: '#757575' }}>
                ({product.reviews.length})
              </span>
            </div>

            {product.ecoFriendly && (
              <div style={styles.ecoFriendlyBadge}>
                Green Points: {product.greenPoints}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return <div>
            <h2>Your Wishlist</h2>
            <div style={styles.productGridContainer}>
                
                {renderProducts(products)}
                </div>
            </div>;
};

export default WishlistProducts;
