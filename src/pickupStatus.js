import React from "react";
import styled from "styled-components";
import { MDBContainer, MDBIcon } from "mdb-react-ui-kit";

export default function OrderDetails6() {
  return (
    <Section>
      <StyledContainer>

        <ProgressBar>
          <Step active>
            <StepIcon><MDBIcon fas icon="clipboard-list" /></StepIcon>
            <StepLabel>Pickup Processed</StepLabel>
          </Step>
          <StepLine />
          <Step active>
            <StepIcon><MDBIcon fas icon="box-open" /></StepIcon>
            <StepLabel>Agent Assigned</StepLabel>
          </Step>
          <StepLine />
          <Step>
            <StepIcon><MDBIcon fas icon="shipping-fast" /></StepIcon>
            <StepLabel>Pickup En Route</StepLabel>
          </Step>
          <StepLine inactive />
          <Step>
            <StepIcon><MDBIcon fas icon="home" /></StepIcon>
            <StepLabel>PickupAgent Arrived</StepLabel>
          </Step>
        </ProgressBar>
      </StyledContainer>
    </Section>
  );
}

const Section = styled.section`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledContainer = styled(MDBContainer)`
  background-color: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 90vw;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
`;

const InvoiceText = styled.p`
  font-weight: bold;
  span {
    color: #6520ff;
  }
`;

const ArrivalDetails = styled.p`
  text-align: right;
  font-size: 0.9rem;
  color: #666;
`;

const ProgressBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Step = styled.div`
  text-align: center;
  flex: 1;
  opacity: ${props => (props.active ? '1' : '0.5')};
`;

const StepIcon = styled.div`
  font-size: 2rem;
  color: ${props => (props.active ? '#6520ff' : '#c5cae9')};
  margin-bottom: 0.5rem;
`;

const StepLabel = styled.p`
  font-size: 0.6rem;
  font-weight: bold;
  color: #333;
`;

const StepLine = styled.div`
  width: 100%;
  height: 5px;
  background-color: ${props => (props.inactive ? '#e0e0e0' : '#6520ff')};
  margin: 0 0.5rem;
`;

