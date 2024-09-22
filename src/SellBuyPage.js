import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign, faStore, faRecycle } from '@fortawesome/free-solid-svg-icons';

import ShopIcon from './shop.png';

const SellBuyPage = () => {
  const navigate = useNavigate();

  const handleSellClick = () => {
    navigate('/market-price');
  };

  const handleBuyClick = () => {
    navigate('/EcommerceHome');
  };

  return (
    <Container>
      <LogoContainer>
        <Icon icon={faRecycle} style={{ fontSize: '15vw' }} color="#B2E851" />
        <Logo>Green Cycle</Logo>
      </LogoContainer>
      <ButtonContainer>
        <StyledButton onClick={handleBuyClick} color="white">
            <ImageIcon src={ShopIcon} alt="Buy Icon" /> {/* Use ImageIcon instead of IconBuy */}
            <ButtonText>Buy</ButtonText>
        </StyledButton>
        <StyledButton onClick={handleSellClick} color="white">
          <IconSell icon={faIndianRupeeSign} />
          <ButtonText>Sell</ButtonText>
        </StyledButton>
      </ButtonContainer>
    </Container>
  );
};

export default SellBuyPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #b29dfa;
`;


const ImageIcon = styled.img`
  width: 17vw;
  height: 18vw;
  margin-top: 2vh;
  margin-bottom: 1vh;
  z-index: 1;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5vh;
  animation: fadeIn 1s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Logo = styled.h1`
  color: #36454F;
  font-size: 10vw;
  margin-left: 1vw;
  text-shadow: 0.2vw 0.2vw 0.4vw rgba(0, 0, 0, 0.5);
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 1s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const StyledButton = styled.button`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.color};
  color: white;
  width: 50vw;
  height: 20vh;
  border: none;
  border-radius: 10vw;
  cursor: pointer;
  margin-bottom: 5vh;
  font-size: 8vw;
  font-weight: bold;
  font-family: 'Rhodium Libre', serif;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1vh 1.5vh rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before, &:after {
    content: '';
    position: absolute;
    border-radius: 50%;
  }

  &:before {
    width: 70vw;
    height: 70vw;
    top: -15vh;
    left: -10vw;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
    z-index: -2;
  }

  &:after {
    width: 60vw;
    height: 60vw;
    top: -10vh;
    left: -5vw;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.2));
    z-index: -1;
  }

  &:hover {
    transform: translateY(-2vh);
    box-shadow: 0 2vh 2.5vh rgba(0, 0, 0, 0.2);
  }

  &:active {
    box-shadow: 0 3vh 3vh rgba(0, 0, 0, 0.3);
    transform: translateY(-1vh);
  }

  &:focus {
    outline: none;
  }
`;

const ButtonText = styled.span`
  color: #36454F;
  margin-bottom: 3vh;
  z-index: 1;
  text-shadow: 0.2vw 0.2vw 0.4vw rgba(0, 0, 0, 0.5);
`;

const Icon = styled(FontAwesomeIcon)`
  color: ${(props) => props.color || '#DAF7A6'};
  margin-top: 2vh;
  margin-bottom: 1vh;
  font-size: 12vw;
  z-index: 1;
`;

const IconSell = styled(FontAwesomeIcon)`
  color: ${(props) => props.color || '#f3c70d'};
  margin-top: 2vh;
  margin-bottom: 1vh;
  font-size: 12vw;
  z-index: 1;
`;

const IconBuy = styled(FontAwesomeIcon)`
  color: ${(props) => props.color || '#A6DAF7'};
  margin-top: 2vh;
  margin-bottom: 1vh;
  font-size: 12vw;
  z-index: 1;
`;
