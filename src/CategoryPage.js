import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import e_waste from './e-waste.jpg';
import metals from './metals.jpg';
import paperwaste from './paperwaste.jpg';
import plastic from './plastic.jpg';


const categories = [
  { name: 'Plastic', image: plastic },
  { name: 'Metal', image:  metals},
  { name: 'E-waste', image: e_waste},
  { name: 'Paper', image: paperwaste},
];

const CategoryPage = ({ ordersList }) => {
  const [categorySelected, setCategorySelected] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const ordersInfo = location.state?.ordersInfo;

  useEffect(() => {
    if (ordersInfo) {
      setCategorySelected(true);
    }
  }, [ordersInfo]);

  const handleStatusClick = () => {
    navigate('/pickup-list', { state: { ordersList } });
  };
  
  const handlePriceClick = () => {
    navigate('/market-price');
  };

  const handleSubmit = () => {
    if (categorySelected) {
      navigate('/pickup-info', { state: { ordersInfo } });
    } else {
      alert('Please select a category before proceeding.');
    }
  };

  const handleCategoryClick = (category) => {
    setCategorySelected(category);
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/sell-buy')}>&lt;</BackButton>
        <ProfileButton onClick={() => navigate('/profile')}>&#128100;</ProfileButton>
      </Header>
      <CategoryContainer>
        {categories.map((category) => (
          <Category
            key={category.name}
            onClick={() => handleCategoryClick(category)}
            selected={categorySelected && categorySelected.name === category.name}
          >
            <CategoryImage src={category.image} alt={category.name} />
            <CategoryName>{category.name}</CategoryName>
          </Category>
        ))}
      </CategoryContainer>
      <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
      <Footer>
        <FooterButton onClick={handlePriceClick}>Price</FooterButton>
        <FooterButton>Pick Up</FooterButton>
        <FooterButton onClick={handleStatusClick}>Status</FooterButton>
      </Footer>
    </Container>
  );
};

export default CategoryPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #4b0082;
  height: 100vh;
  padding: 20px;
  
  @media (min-width: 768px) {
    padding: 40px;
  }

  @media (min-width: 1024px) {
    padding: 60px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;

  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;

  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const CategoryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
  


  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
  }
`;

const Category = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 77px
`;

const CategoryImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;

  @media (min-width: 768px) {
    width: 150px;
    height: 150px;
  }

  @media (min-width: 1024px) {
    width: 200px;
    height: 200px;
  }
`;

const CategoryName = styled.span`
  color: white;
  margin-top: 10px;
  font-size: 16px;

  @media (min-width: 768px) {
    font-size: 18px;
    margin-top: 12px;
  }

  @media (min-width: 1024px) {
    font-size: 20px;
    margin-top: 14px;
  }
`;

const SubmitButton = styled.button`
  background-color: #32cd32;
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  margin-top: 20px;

  @media (min-width: 768px) {
    padding: 20px 40px;
    font-size: 18px;
  }

  @media (min-width: 1024px) {
    padding: 25px 50px;
    font-size: 20px;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: auto;
  background-color: white;
  padding: 10px 0;
  border-radius: 20px 20px 0 0;

  @media (min-width: 768px) {
    padding: 15px 0;
  }

  @media (min-width: 1024px) {
    padding: 20px 0;
  }
`;

const FooterButton = styled.button`
  background: none;
  border: none;
  color: #4b0082;
  font-size: 18px;
  cursor: pointer;

  @media (min-width: 768px) {
    font-size: 20px;
  }

  @media (min-width: 1024px) {
    font-size: 22px;
  }
`;