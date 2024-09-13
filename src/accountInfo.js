import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';

const AccountInfo = () => {
  const [userData, setProfileData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loginCredits, setLoginCredits] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('https://recycle-backend-apao.onrender.com/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfileData(response.data);
        setLoginCredits(response.data.loginCredentials[0]);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...userData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.post('https://recycle-backend-apao.onrender.com/api/users', userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEditMode(false);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h2 className="text-center mb-4">Account Information</h2>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                Personal Information
                <FaEdit
                  style={{ cursor: 'pointer', color: '#007bff' }}
                  onClick={() => setEditMode(true)}
                />
              </Card.Title>
              {editMode ? (
                <Form>
                  <Form.Group controlId="formUsername" className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={loginCredits.username || ''}
                      onChange={handleInputChange}
                      placeholder="Enter your username"
                      className="rounded-0"
                    />
                  </Form.Group>
                  <Form.Group controlId="formName" className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={userData.name || ''}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="rounded-0"
                    />
                  </Form.Group>
                  <Form.Group controlId="formContact" className="mb-3">
                    <Form.Label>Contact</Form.Label>
                    <Form.Control
                      type="text"
                      name="contact"
                      value={userData.contactNumber || ''}
                      onChange={handleInputChange}
                      placeholder="Enter your contact number"
                      className="rounded-0"
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={handleSave} className="w-100 rounded-0">
                    Save
                  </Button>
                </Form>
              ) : (
                <div className="mt-3">
                  <p><strong>Username:</strong> {loginCredits.username}</p>
                  <p><strong>Name:</strong> {userData.name}</p>
                  <p><strong>Contact:</strong> {userData.contactNumber}</p>
                </div>
              )}
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Account Balance</Card.Title>
              <p><strong>Wallet Balance:</strong> {userData.wallet}</p>
              <p><strong>Green Points:</strong> {userData.greenpoints}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountInfo;

