import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Image, ListGroup, ListGroupItem } from 'react-bootstrap';
import { ArrowLeft, ChevronRight } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Goku from './sonGoku.jpg';

const CenteredLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #5e348b;
`;

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    const timer = setTimeout(() => setLoading(false), 3000);

    fetchProfileData();

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return (
      <CenteredLoader>
        <iframe
          src="https://lottie.host/embed/986cc7f5-3bf9-4d59-83d4-c35c6e3d608a/0mitlmdS4c.json"
          style={{ width: '20vh', height: '20vh', border: 'none' }} // Adjusted to vw for responsiveness
        ></iframe>
      </CenteredLoader>
    );
  }

  return (
    <Container fluid style={{ backgroundColor: '#5e348b', height: '100vh', display: 'flex', flexDirection: 'column', padding: '0', overflowY:'hidden' }}>
      <Row style={{ padding: '1vh 2vw', backgroundColor: '#5e348b', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1vh' }}>
        <Col xs="auto" onClick={() => navigate(-1)} style={{ cursor: 'pointer', color: 'white' }}>
          <ArrowLeft size="6vw" />
        </Col>
        <Col xs="auto" onClick={handleLogout} style={{ cursor: 'pointer', color: 'white', fontSize: '3vw' }}>
          Logout
        </Col>
      </Row>
      <Row className="mb-3" style={{ justifyContent: 'center', alignItems: 'center', margin: '0 2vw' }}>
        <Col xs={12} style={{ backgroundColor: '#8bc34a', borderRadius: '2vw', padding: '2vw', color: 'white' }}>
          <div style={{ textAlign: 'center', marginBottom: '2vh', fontSize: '3.5vw' }}>Your scorecard in our contributions</div>
          <Row style={{ justifyContent: 'space-around' }}>
            <Col xs="auto">
              <div style={{ textAlign: 'center' }}>
                <div style={{ backgroundColor: 'white', color: 'black', borderRadius: '50%', width: '15vw', height: '15vw', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1vh', fontSize: '4vw' }}>
                  CO2
                </div>
                <div style={{ fontSize: '3vw' }}>0.0012KT</div>
              </div>
            </Col>
            <Col xs="auto">
              <div style={{ textAlign: 'center' }}>
                <div style={{ backgroundColor: 'white', color: 'black', borderRadius: '50%', width: '15vw', height: '15vw', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1vh', fontSize: '4vw' }}>
                  Trees
                </div>
                <div style={{ fontSize: '3vw' }}>32 Trees</div>
              </div>
            </Col>
            <Col xs="auto">
              <div style={{ textAlign: 'center' }}>
                <div style={{ backgroundColor: 'white', color: 'black', borderRadius: '50%', width: '15vw', height: '15vw', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1vh', fontSize: '4vw' }}>
                  Waste
                </div>
                <div style={{ fontSize: '3vw' }}>0.001KT</div>
              </div>
            </Col>
            <Col xs="auto">
              <div style={{ textAlign: 'center' }}>
                <div style={{ backgroundColor: 'white', color: 'black', borderRadius: '50%', width: '15vw', height: '15vw', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1vh', fontSize: '4vw' }}>
                  Energy
                </div>
                <div style={{ fontSize: '3vw' }}>40KWh</div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mb-3" style={{ justifyContent: 'center', alignItems: 'center', margin: '0 2vw', flex: '1 0 auto' }}>
        <Col xs={12} style={{ textAlign: 'center' }}>
          <Image src={Goku} roundedCircle style={{ width: '30vw', height: '30vw', marginBottom: '2vh' }} />
        </Col>
        <Col xs={12} style={{ backgroundColor: 'white', borderRadius: '2vw', padding: '0', color: '#5e348b', marginBottom: '2vh' }}>
          <ListGroup variant="flush">
            <ListGroupItem className="d-flex justify-content-between align-items-center" style={{ borderBottom: '0.2vw solid #e0e0e0', padding: '2vh 2vw', fontSize: '3.5vw' }} onClick={() => navigate('/account-info')}>
              My Account
              <ChevronRight size="4vw" />
            </ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between align-items-center" style={{ borderBottom: '0.2vw solid #e0e0e0', padding: '2vh 2vw', fontSize: '3.5vw' }}>
              Payments
              <ChevronRight size="4vw" />
            </ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between align-items-center" style={{ borderBottom: '0.2vw solid #e0e0e0', padding: '2vh 2vw', fontSize: '3.5vw' }} onClick={() => navigate('/WishlistProducts')}>
              My Wishlist
              <ChevronRight size="4vw" />
            </ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between align-items-center" style={{ borderBottom: '0.2vw solid #e0e0e0', padding: '2vh 2vw', fontSize: '3.5vw' }} onClick={() => navigate('/previous-orders')}>
              Previous Orders
              <ChevronRight size="4vw" />
            </ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between align-items-center" style={{ padding: '2vh 2vw', fontSize: '3.5vw' }}>
              Help
              <ChevronRight size="4vw" />
            </ListGroupItem>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
