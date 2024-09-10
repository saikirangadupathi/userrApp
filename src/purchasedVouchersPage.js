import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PurchasedVouchersPage = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchPurchasedVouchers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getPurchasedVouchers');
        setOrders(response.data.vouchers || []); // Ensure orders is an array even if data is missing
        console.log('purchased..',response.data);
      } catch (error) {
        console.error("Error fetching purchased vouchers:", error);
        setOrders([]); // Set to empty array in case of error
      }
    };

    fetchPurchasedVouchers();
  }, []);

  const handleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleRedeem = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: 'Redeemed' } : order
      )
    );
    alert('Voucher redeemed');
  };

  const handleMarkAsRead = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: 'Redeemed' } : order
      )
    );
  };

  const styles = {
    purchasedVouchersPage: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f3f4f6',
      height: '100vh',
      padding: '20px',
      overflowY: 'auto',
    },
    orderCard: {
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '10px',
      padding: '10px',
      textAlign: 'left',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
    },
    orderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    orderInfo: {
      marginTop: '10px',
    },
    expandButton: {
      backgroundColor: '#92E792',
      color: 'black',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    voucherSection: {
      border: '1px dashed #ccc',
      padding: '10px',
      marginTop: '10px',
      display: 'flex',
      justifyContent: 'space-between',
    },
    voucherInfo: {
      display: 'flex',
      flexDirection: 'column',
    },
    voucherCode: {
      marginBottom: '5px',
    },
    voucherPin: {
      marginBottom: '5px',
    },
    copyButton: {
      backgroundColor: '#6a1b9a',
      color: 'white',
      border: 'none',
      padding: '5px',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    actionButton: {
      backgroundColor: '#6a1b9a',
      color: 'white',
      border: 'none',
      padding: '10px',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '10px',
      marginRight: '10px',
    },
  };

  return (
    <div style={styles.purchasedVouchersPage}>
      <h2>Purchased Orders</h2>
      {orders.map((order) => (
        <div key={order.id} style={styles.orderCard}>
          <div style={styles.orderHeader}>
            <div>
              <h3>{order.name}</h3>
              <p style={{ color: 'blue' }}>{order.dateOfPurchase}</p>
            </div>
            <div>
              <p>Status: {order.status}</p>
              <p>Price: ₹{order.price}</p>
              <p>Green Points: {order.greenPoints}</p>
            </div>
          </div>
          <button style={styles.expandButton} onClick={() => handleExpandOrder(order.id)}>
            View Details
          </button>
          {expandedOrder === order.id && (
            <div style={styles.orderInfo}>
              <div style={styles.voucherSection}>
                <div style={styles.voucherInfo}>
                  <div style={styles.voucherCode}>
                    Voucher Code: {order.code}{' '}
                    <button
                      style={styles.copyButton}
                      onClick={() => navigator.clipboard.writeText(order.code)}
                    >
                      Copy
                    </button>
                  </div>
                  <div style={styles.voucherPin}>
                    Voucher Pin: 1234{' '}
                    <button
                      style={styles.copyButton}
                      onClick={() => navigator.clipboard.writeText('1234')}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
              <button style={styles.actionButton} onClick={() => handleMarkAsRead(order.id)}>
                Mark as Read
              </button>
              <button style={styles.actionButton} onClick={() => handleRedeem(order.id)}>
                Redeem Voucher
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PurchasedVouchersPage;
