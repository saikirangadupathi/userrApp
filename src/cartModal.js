import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

const CartModal = ({ modalIsOpen, setModalIsOpen, cart, greenPointsInCart, removeFromCart, handlePaymentClick, handleSaveCart }) => {

  // Function to calculate total green points
const getTotalGreenPoints = () => {
  return cart.reduce((total, item) => total + item.greenPoints, 0);
};

const getTotalPrice = () => {
  return cart.reduce((total, item) => {
    const discountedPrice = item.price - (item.price * (item.discount / 100));
    return total + discountedPrice;
  }, 0).toFixed(2);
};



  return (
    <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cart Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cart.length > 0 ? (
          <div>
            {cart.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  padding: '15px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: '10px',
                  backgroundColor: '#f9f9f9',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                <img
                  src={item.images}
                  alt={item.name}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginRight: '15px',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '600' }}>{item.name}</div>
                  <div style={{ fontSize: '16px', fontWeight: '500', margin: '5px 0', color: '#777' }}>Price: <span style={{ textDecoration: 'line-through'}}>₹{item.price}</span><span> {(item.price - (item.price * (item.discount / 100))).toFixed(2)}</span></div>
                  <div style={{ fontSize: '16px', color: '#555' }}>Quantity: {item.quantity}</div>
                  <div style={{ color: '#28a745', fontWeight: '500', marginTop: '8px' }}>
                    Green Points: ♻️ {item.greenPoints}
                  </div>
                </div>
                <Trash
                  style={{
                    cursor: 'pointer',
                    color: '#dc3545',
                    fontSize: '24px',
                    marginLeft: '20px',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = '#ff6b6b')}
                  onMouseLeave={(e) => (e.target.style.color = '#dc3545')}
                  onClick={() => removeFromCart(item)}
                />
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <h3 style={{ fontWeight: '700', fontSize: '22px' }}>Total: ₹{getTotalPrice()}</h3>
              <h3 style={{ color: '#28a745', fontWeight: '700', fontSize: '20px' }}>
                  Total Green Points: ♻️ {getTotalGreenPoints()}
              </h3>
            </div>
          </div>
        ) : (
          <p style={{ textAlign: 'center', fontSize: '18px', color: '#777' }}>Your cart is empty.</p>
        )}
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'center' }}>
        <Button variant="primary" onClick={handlePaymentClick} style={{ width: '120px' }}>
          Continue
        </Button>
        <Button variant="warning" onClick={handleSaveCart} style={{ width: '120px' }}>
          Save Cart
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CartModal;



