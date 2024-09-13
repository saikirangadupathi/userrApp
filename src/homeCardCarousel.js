import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';  // Only import Swiper and SwiperSlide from 'swiper/react'
import 'swiper/css';
import 'swiper/css/effect-coverflow';  // Import necessary effect styles
import 'swiper/css/pagination';        // Import pagination styles
import 'swiper/css/navigation';        // Import navigation styles

import { EffectCoverflow, Pagination, Navigation, Autoplay  } from 'swiper/modules'; 

// Images
import slide_image_1 from './carouselImages/Balcony.jpg';
import slide_image_2 from './carouselImages/Kitchen.jpg';
import slide_image_3 from './carouselImages/washroom.jpg';
import slide_image_4 from './carouselImages/bedroom.jpg';
import slide_image_5 from './carouselImages/HomeLiving.jpg';
import slide_image_6 from './carouselImages/LivingArea.jpg';

import styled from 'styled-components';

// Styled Components for the Carousel and content
const HeroWrapper = styled.div`
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
  font-size: 4vw;
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

function HomeCardCarousel() {
  const carouselItems = [
    {
      id: 1,
      title: 'Eco-Friendly Balcony Oasis',
      description: 'Transform your balcony into a green sanctuary with sustainable, stylish solutions that embrace the outdoors.',
      image: slide_image_1,
    },
    {
      id: 2,
      title: 'Sustainable Kitchen Essentials',
      description: 'Revamp your kitchen with eco-conscious designs that reduce waste and enhance your cooking experience with minimal environmental impact.',
      image: slide_image_2,
    },
    {
      id: 3,
      title: 'Eco-Conscious Washroom Must-Haves',
      description: 'Refresh your washroom with essential items that blend luxury with sustainability, making every day a little greener.',
      image: slide_image_3,
    },
    {
        id: 4,
        title: 'Eco-Friendly Bedroom Comfort',
        description: 'Create a serene and sustainable retreat with bedroom essentials that offer comfort without compromising on the environment.',
        image: slide_image_4,
    },
    {
        id: 5,
        title: 'Sustainable Home Furniture',
        description: 'Elevate your home with eco-friendly furniture that combines timeless design and sustainable craftsmanship for every room.',
        image: slide_image_5,
    },
    {
        id: 6,
        title: 'Eco-Living Essentials for Your Space',
        description: 'Bring your living room to life with eco-friendly pieces that are as stylish as they are sustainable, designed for conscious living.',
        image: slide_image_6,
    },
  ];

  return (
    <div className="container">
      <Swiper
        effect="coverflow"  // Configure the effect directly
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        autoplay={{  // Added autoplay settings here
          delay: 3000,  // Delay in milliseconds between slides
          disableOnInteraction: false,  // Autoplay continues even after user interaction
        }}
        slidesPerView={'auto'}
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}  // Added Autoplay module
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={{ clickable: true }}  // Enable pagination via props
        
        className="swiper_container"
      >
        {carouselItems.map((item) => (
          <SwiperSlide key={item.id}>
            <HeroWrapper
              style={{
                backgroundImage: `url(${item.image})`,
              }}
            >
              <HeroContentInner>
                <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        padding: '1vw 2vw',
                        borderRadius: '10px',
                        display: 'inline-block',
                        margin: '3vw'}}>
                    <HeroHeader>{item.title}</HeroHeader>
                    <p style={{ 
                            color: 'black',
                            fontSize: '3vw'
                            }}>
                            {item.description}
                    </p>
                </div>
                <HeroCTAButton>Shop Now</HeroCTAButton>
              </HeroContentInner>
            </HeroWrapper>
          </SwiperSlide>
        ))}

        {/* Swiper navigation buttons and pagination */}
        <div className="slider-controler">
          
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>
    </div>
  );
}

export default HomeCardCarousel;
