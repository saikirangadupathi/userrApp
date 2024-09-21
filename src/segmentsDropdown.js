import React, { useState } from 'react';
import styled from 'styled-components';
import { FaChevronRight } from 'react-icons/fa';  // Importing the arrow icon from react-icons

const SegmentDropdownContainer = styled.div`
  margin: 4vh 2vw;
  padding: 2vw;
  background: linear-gradient(145deg, #f5f5f5, #e0e0e0);
  border-radius: 20px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1), 0px 6px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2vw);
    box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.15), 0px 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

const SegmentTitle = styled.div`
  padding: 4vw;
  font-size: 4vw;
  font-weight: light;
  margin-bottom: 3vw;
  cursor: pointer;
  color: black;
  border-radius: 15px;
  font-family: Myriad Pro;
  text-align: left;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15), 0px 8px 15px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 80%);
    transition: transform 0.6s ease;
    transform: scale(0);
    border-radius: 50%;
  }

  &:hover::before {
    transform: scale(1.5);
  }
`;

const ArrowIcon = styled(FaChevronRight)`
  font-size: 4vw;
  transition: transform 0.3s ease;

  ${({ isOpen }) => isOpen && `
    transform: rotate(90deg);  // Rotate the arrow when the segment is open
  `}
`;

const BrandCardsContainer = styled.div`
  display: ${(props) => (props.open ? 'grid' : 'none')};
  grid-template-columns: repeat(auto-fill, minmax(40vw, 1fr));
  gap: 2vw;
  padding: 4vw 2vw;
`;

const BrandCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2vw;
  text-align: center;
`;

const BrandImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
`;

const BrandName = styled.h4`
  font-size: 3vw;
  margin-top: 2vw;
  color: #333;
`;

const SegmentDropdown = () => {
  const [openSegment, setOpenSegment] = useState(null);

  const segments = [
    { title: 'For Restaurants and Cafes', brands: [ 'EcoCulinary', 'GreenEats', 'BioServe'] },
    { title: 'For Co-working Spaces & Corporate Offices', brands: ['Green Office Supply', 'ReUse Corp', 'Earth Solutions'] },
    { title: 'For Schools', brands: ['Eco Essentials', 'Green Future', 'Nature Classrooms'] },
    { title: 'For Hospitals', brands: ['GreenCare Supplies', 'BioClinic', 'EcoHosp Solutions'] },
    { title: 'For Enterprises', brands: ['Green Office Supply','Earth Solutions'] },
    { title: 'For Retail Shops', brands: ['GreenPack', 'BioRetail Solutions', 'SustainStore'] },
  ];

  const toggleSegment = (index) => {
    if (openSegment === index) {
      setOpenSegment(null);
    } else {
      setOpenSegment(index);
    }
  };

  return (
    <SegmentDropdownContainer>
    <h4 style={{marginBottom:'2vh',fontFamily:'San Francisco'}}>Segment Your Looking for ?</h4>
      {segments.map((segment, index) => (
        <div key={index}>
          <SegmentTitle onClick={() => toggleSegment(index)}>
            {segment.title}
            <ArrowIcon isOpen={openSegment === index} />  {/* Conditionally rotate the arrow */}
          </SegmentTitle>
          <BrandCardsContainer open={openSegment === index}>
            {segment.brands.map((brand, idx) => (
              <BrandCard key={idx}>
                <BrandImage src={`https://gadupathi.s3.ap-south-1.amazonaws.com/${brand}.png`} alt={brand} />
                <BrandName>{brand}</BrandName>
              </BrandCard>
            ))}
          </BrandCardsContainer>
        </div>
      ))}
    </SegmentDropdownContainer>
  );
};

export default SegmentDropdown;

