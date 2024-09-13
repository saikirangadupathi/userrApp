import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';

const PreviousOrders = () => {
  const [pickupOrders, setPickupOrders] = useState([]);
  const [reCommerceOrders, setReCommerceOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const pickupResponse = await axios.get('https://recycle-backend-apao.onrender.com/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const reCommerceResponse = await axios.get('https://recycle-backend-apao.onrender.com/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPickupOrders(pickupResponse.data.pickupHistory);
        setReCommerceOrders(reCommerceResponse.data.reCommerceOrderHistory);
        console.log('ordersss..', pickupOrders, reCommerceOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <h2>Pickup Completed Orders</h2>
          {pickupOrders.map((order, index) => (
            <Card key={index} className="mb-3">
              <Card.Body>
                {order.cart.map((item, itemIndex) => (
                  <div key={itemIndex} className="mb-2">
                    <Card.Text><strong>Item Name:</strong> {item.name}</Card.Text>
                    <Card.Text><strong>Price:</strong> {item.price}</Card.Text>
                    <Card.Text><strong>Quantity:</strong> {item.quantity}</Card.Text>
                  </div>
                ))}
                <Card.Text><strong>Order Date:</strong> {order.date}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Re-Commerce Completed Orders</h2>
          {reCommerceOrders.map((order, index) => (
            <Card key={index} className="mb-3">
              <Card.Body>
                <Card.Text>{order.description}</Card.Text>
                <Card.Text>{order.date}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default PreviousOrders;
