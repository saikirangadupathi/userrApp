import React from 'react';
import { Cart } from 'react-bootstrap-icons';

const CartIcon = ({ cart, setModalIsOpen }) => {
  return (
    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setModalIsOpen(true)}>
      <Cart style={{ fontSize: '24px' }} />
      {cart.length > 0 && (
        <span style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          backgroundColor: 'red',
          color: 'white',
          borderRadius: '50%',
          padding: '2px 6px',
          fontSize: '12px'
        }}>
          {cart.length}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
