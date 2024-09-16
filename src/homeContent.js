import React from 'react';
import { Search } from 'react-bootstrap-icons';
import styled from 'styled-components';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import HomeCardCarousel from './homeCardCarousel'; 


const HeroSectionContainer = styled.div`
  background-color: #F5F5F5;
  padding: 5vw;
  margin-bottom: 3vw;
`;

const HeroWrapper = styled.div`
  background-color: red;  /* Temporary color to check styling */
  background-size: cover;
  background-position: center;
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;


const HeroContentInner = styled.div`
  text-align: center;
  color: #fff;
`;

const HeroHeader = styled.h1`
  font-size: 6vw;
  font-weight: bold;
  margin-bottom: 2vw;
  color: black;
`;

const HeroCTAButton = styled.button`
  background-color: #4CAF50;
  color: #fff;
  padding: 2vw 4vw;
  border-radius: 5vw;
  cursor: pointer;
  font-size: 4vw;
  border: none;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #3E8E41;
  }
`;


const StickyNavbar = styled.div`
  display: flex;
  justify-content: space-around;
  font-size: 4vw;
  position: sticky;
  top: 0;
  background-color: #fff;
  padding: 1vw;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2vw;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 3vw;
  border: 1px solid #ccc;
  border-radius: 10vw;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 3vw;
  overflow-x: auto;
  margin: 2vw;
  white-space: nowrap;
  scroll-snap-type: x mandatory; 

  
`;

const CategoryItem = styled.div`
  background-image: url(${(props) => props.$bgImage});
  background-size: cover;
  background-position: center;
  min-width: 45vw;
  height: 15vh;
  padding: 2vw;
  text-align: center;
  font-size: 2vw;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  transition: all 0.3s ease;
  border: ${(props) => (props.active ? '2px solid #4CAF50' : '2px solid transparent')};
  opacity: ${(props) => (props.active ? 0.9 : 1)};

  &:hover {
    background-color: rgba(54, 69, 79, 0.8);
    opacity: 0.8;
    transform: scale(1.05);
  }

  & > span {
    font-size: ${(props) => (props.active ? '3.5vw' : '3vw')};
    font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
    color: ${(props) => (props.active ? '#333333' : '#4A4A4A')};
  }
`;


const FeaturedProductsSection = styled.div`
  padding: 4vw 0;
  background-color: #F5F5F5;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 5vw;
  font-weight: bold;
  margin-bottom: 4vw;
  color: #333;
`;

const RecommendationCarousel = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 2vw;
  gap: 4vw;
  scroll-snap-type: x mandatory;
  white-space: nowrap;

  div {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    flex: 0 0 30%;
    padding: 2vw;
    scroll-snap-align: start;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }

    img {
      width: 100%;
      height: 40vh;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 2vw;
    }

    p {
      font-size: 4vw;
      font-weight: bold;
      color: #333;
      margin-bottom: 2vw;
    }

    button {
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 2vw 4vw;
      margin: 1vw;
      border-radius: 5vw;
      font-size: 3.5vw;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #3E8E41;
      }
    }

    span {
      display: block;
      margin-top: 1vw;
      padding: 1vw 3vw;
      background-color: #F1F8E9;
      border-radius: 20px;
      font-size: 3vw;
      color: #4CAF50;
      font-weight: bold;
    }
  }
`;

const TestimonialsSection = styled.div`
  padding: 4vw 0;
  background-color: #F1F8E9;
`;

const SustainabilitySection = styled.div`
  padding: 4vw 0;
`;

const LimitedOffersSection = styled.div`
  padding: 4vw 0;
  background-color: #FFEBEE;
`;

const RecommendationsSection = styled.div`
  padding: 4vw 0;
  background-color: #FFFDE7;
`;

const HeroContentCarousel = styled(Carousel)`
  width: 100%;
  .react-multi-carousel-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    text-align: center;
    color: #fff;
  }
`;

const ProductHighlight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #E8F5E9;
  padding: 3vw;
  border-radius: 10px;
`;

const ProductImage = styled.img`
  width: 80%;
  margin-bottom: 2vw;
  border-radius: 10px;
`;

const CTAButton = styled.button`
  background-color: #4CAF50;
  color: #fff;
  padding: 1vw 2vw;
  border-radius: 5vw;
  font-size: 3vw;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3E8E41;
  }
`;

const Testimonial = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2vw;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin: 2vw;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 3vw 0;
`;

const Icon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2vw;
`;

const CountdownTimer = styled.div`
  font-size: 4vw;
  color: #D32F2F;
  font-weight: bold;
  text-align: center;
  margin-top: 2vw;
`;



const HomeContent = ({ categories, searchQuery, setSearchQuery, suggestions, handleSuggestionClick, handleSearch, selectedCategory, setSelectedCategory }) => {
  
  return (
    <div>
      <h3>Shop by Categories</h3>
        <CategoryGrid>
            {categories.map((category, index) => (
                <CategoryItem
                key={index}
                active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                $bgImage={`https://gadupathi.s3.ap-south-1.amazonaws.com/${category}.jpg`}

                >
                <span style={{backgroundColor: 'whitesmoke',padding: '1.5vw',borderRadius:'10px'}}>{category}</span>
                </CategoryItem>
            ))}
        </CategoryGrid>

<HeroSectionContainer>

        <HomeCardCarousel />



      {/* Featured Products and Best Sellers */}

      <FeaturedProductsSection>
        <SectionTitle>Best Sellers</SectionTitle>
        <RecommendationCarousel>
            
          <div>
            <img src="best-seller1.jpg" alt="Best Seller 1" />
            <p>Sustainable Sofa</p>
            <button>Add to Cart</button>
            <button>More Info</button>
            <span>Sustainable</span>
          </div>
          <div>
            <img src="best-seller2.jpg" alt="Best Seller 2" />
            <p>Eco-Friendly Chair</p>
            <button>Add to Cart</button>
            <button>More Info</button>
            <span>Eco-Certified</span>
          </div>
          {/* Add more best-selling products */}
        </RecommendationCarousel>
      </FeaturedProductsSection>

      {/* Product of the Week/Month */}
      <SectionTitle>Product of the Month</SectionTitle>
      <ProductHighlight>
        <ProductImage src="featured-product.jpg" alt="Featured Product" />
        <h3>Innovative Eco Lamp</h3>
        <p>This lamp reduces carbon emissions by 50% using recycled materials.</p>
        <CTAButton>Learn How It Helps the Planet</CTAButton>
      </ProductHighlight>

      {/* Customer Testimonials */}
      <TestimonialsSection>
        <SectionTitle>Customer Testimonials</SectionTitle>
        <Testimonial>
          <p>"This eco-friendly furniture is amazing! It blends perfectly with my decor and helps the environment." - Jane Doe</p>
        </Testimonial>
        <Testimonial>
          <p>"Best sustainable products I've ever purchased! Highly recommend." - John Smith</p>
        </Testimonial>
      </TestimonialsSection>

      {/* Sustainability Commitment */}
      <SustainabilitySection>
        <SectionTitle>Our Green Promise</SectionTitle>
        <IconContainer>
          <Icon>
            <img src="recycle-icon.png" alt="Recycled Packaging" />
            <p>100% Recycled Packaging</p>
          </Icon>
          <Icon>
            <img src="carbon-neutral-icon.png" alt="Carbon Neutral Shipping" />
            <p>Carbon Neutral Shipping</p>
          </Icon>
          <Icon>
            <img src="eco-materials-icon.png" alt="Eco-Friendly Materials" />
            <p>Eco-Friendly Materials</p>
          </Icon>
        </IconContainer>
      </SustainabilitySection>

      {/* Limited Time Offers */}
      <LimitedOffersSection>
        <SectionTitle>Limited Time Offers</SectionTitle>
        <p>Don't miss out on our exclusive eco-friendly product sales!</p>
        <CountdownTimer>Sale Ends In: 02:15:30</CountdownTimer>
      </LimitedOffersSection>

      {/* Personalized Recommendations */}
      <RecommendationsSection>
        <SectionTitle>Recommended for You</SectionTitle>
        <RecommendationCarousel>
          {/* Add personalized recommendation product cards */}
          <div>
            <img src="recommended1.jpg" alt="Recommended Product 1" />
            <p>Eco-Friendly Coffee Table</p>
          </div>
          <div>
            <img src="recommended2.jpg" alt="Recommended Product 2" />
            <p>Sustainable Dining Set</p>
          </div>
          {/* Add more recommended products */}
        </RecommendationCarousel>
      </RecommendationsSection>
    </HeroSectionContainer>

    </div>
  );
};

export default HomeContent;
