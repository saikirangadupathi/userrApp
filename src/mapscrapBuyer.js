import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import styled from 'styled-components';
import { Modal, Button } from 'react-bootstrap';

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZ3NhaXRlamEwMDEiLCJhIjoiY2x5a3MyeXViMDl3NjJqcjc2OHQ3NTVoNiJ9.b5q6xpWN2yqeaKTaySgcBQ';

const Map = ({ customerOrderInfo, scrapBuyers, selectedBuyer, setSelectedBuyer, scrapBuyerIcon, onOrderClick }) => {
  const mapContainerRef = useRef(null);
  const rotationRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const [processedBuyersWithMatches, setProcessedBuyersWithMatches] = useState('');

  useEffect(() => {


    // Function to process and match itemIds between customerOrderInfo.cart and buyer's acceptedMaterials
const matchCustomerItemsWithBuyers = (scrapBuyers, customerOrderInfo) => {
    return scrapBuyers.map(buyer => {
    //   console.log('Processing buyer:', buyer.scrapBuyerId); // Log the buyer ID
  
      if (Array.isArray(buyer.acceptedMaterials) && buyer.acceptedMaterials.length > 0) {
        // Extract all itemIds from buyer's acceptedMaterials
        const buyerItemIds = buyer.acceptedMaterials.flatMap(material => {
        //   console.log('Category:', material.category); // Log the category name
          return material.items.map(item => item.itemId);
        });
  
        // Extract all itemIds from customer's cart
        const customerCartItemIds = customerOrderInfo.cart.map(item => item.itemId);
  
        // Find the intersection of buyerItemIds and customerCartItemIds
        const matchedItemIds = customerCartItemIds.filter(itemId => buyerItemIds.includes(itemId));
  
        // console.log(`Buyer ${buyer.scrapBuyerId} - Matched Item IDs:`, matchedItemIds); // Log matched item IDs
  
        return {
          buyerId: buyer.scrapBuyerId,
          matchedItemIds: matchedItemIds,
        };
      } else {
        // console.log(`Buyer ${buyer.scrapBuyerId} has no acceptedMaterials.`);
        return {
          buyerId: buyer.scrapBuyerId,
          matchedItemIds: [],
        };
      }
    });
  };
  
  // Example usage
  const processedBuyersWithMatches = matchCustomerItemsWithBuyers(scrapBuyers, customerOrderInfo);
  setProcessedBuyersWithMatches(processedBuyersWithMatches);
  // Log the processed results with matched items
//   console.log('Processed Buyers with Matches:', processedBuyersWithMatches);
  

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [customerOrderInfo?.location.longitude || -74.0066, customerOrderInfo?.location.latitude || 40.7135],
      zoom: 16,
      pitch: 45,
      bearing: 0,
      antialias: true,
    });

    map.on('style.load', () => {
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
      ).id;

      map.addLayer(
        {
          id: 'add-3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 14,
          paint: {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.6,
          },
        },
        labelLayerId
      );

      // Add the marker for the device's location using an iframe for Lottie animation
      if (customerOrderInfo?.location) {
        const deviceMarkerElement = document.createElement('div');
        deviceMarkerElement.style.width = '50px';
        deviceMarkerElement.style.height = '80px';
        deviceMarkerElement.style.borderRadius = '50%';
        deviceMarkerElement.style.overflow = 'hidden';

        const iframe = document.createElement('iframe');
        iframe.src = 'https://lottie.host/embed/25d3eb87-e995-4dec-8a25-221ab004a6bf/AkNlvbr5bz.json';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';

        deviceMarkerElement.appendChild(iframe);

        new mapboxgl.Marker({ element: deviceMarkerElement })
          .setLngLat([customerOrderInfo.location.longitude, customerOrderInfo.location.latitude])
          .addTo(map);
      }

      // Add markers for the scrap buyers
      scrapBuyers.forEach((buyer) => {
        const markerElement = document.createElement('img');
        markerElement.src = scrapBuyerIcon;
        markerElement.style.width = '25px';
        markerElement.style.cursor = 'pointer';

        new mapboxgl.Marker({ element: markerElement })
          .setLngLat([buyer.location.longitude, buyer.location.latitude])
          .addTo(map)
          .getElement()
          .addEventListener('click', () => setSelectedBuyer(buyer));
      });

      // Add popup for selected scrap buyer
      if (selectedBuyer) {
        new mapboxgl.Popup()
          .setLngLat([selectedBuyer.location.longitude, selectedBuyer.location.latitude])
          .setHTML(`
            <div>
              <strong>${selectedBuyer.name}</strong><br />
              ${selectedBuyer.businessName ? `<div><strong>Business Name:</strong> ${selectedBuyer.businessName}</div>` : ''}
              <div><strong>Distance:</strong> ${selectedBuyer.distance.toFixed(2)} km</div>
              <div><strong>Status:</strong> ${selectedBuyer.availableStatus ? 'Available' : 'Not Available'}</div>
              <button onClick={() => onOrderClick(customerOrderInfo)}>View Order</button>
            </div>
          `)
          .addTo(map);
      }

      // Start rotating the map
      let rotationAngle = 0;
      const rotateMap = () => {
        rotationAngle += 0.1; // Adjust this value to control the rotation speed
        map.rotateTo(rotationAngle % 360, { duration: 0 });
        rotationRef.current = requestAnimationFrame(rotateMap);
      };
      rotateMap();
    });

    // Cleanup on component unmount
    return () => {
      map.remove();
      cancelAnimationFrame(rotationRef.current);
    };
  }, [customerOrderInfo, scrapBuyers, selectedBuyer, scrapBuyerIcon, onOrderClick]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <MapContainer ref={mapContainerRef} />
      <ScrapBuyersButton onClick={handleShowModal}>
        Scrap Buyers
        <BubbleCount>{3}</BubbleCount>
      </ScrapBuyersButton>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Scrap Buyers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                {scrapBuyers.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {scrapBuyers
                      .sort((a, b) => a.distance - b.distance) // Sort by distance in ascending order
                      .slice(0, 3) // Get the top 3 closest scrap buyers
                      .map((buyer) => {
                        // Find the matched items for this buyer from processedBuyersWithMatches
                        const matchedBuyer = processedBuyersWithMatches.find(pb => pb.buyerId === buyer.scrapBuyerId);
                        
                        return (
                          <div
                            key={buyer.scrapBuyerId}
                            style={{
                              border: '1px solid #ddd',
                              borderRadius: '8px',
                              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                              padding: '20px',
                              backgroundColor: '#fff',
                            }}
                          >
                            <h5 style={{ margin: '0 0 10px 0', color: '#333' }}>{buyer.name}</h5>
                            <p style={{ margin: '0 0 10px 0', color: '#666' }}>
                              {buyer.distance.toFixed(2)} km away - {buyer.availableStatus ? '✅ Available' : '❌ Not Available'}
                            </p>

                            {/* Display matched item information */}
                            {matchedBuyer && matchedBuyer.matchedItemIds.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {buyer.acceptedMaterials.flatMap(category =>
                                  category.items
                                    .filter(item => matchedBuyer.matchedItemIds.includes(item.itemId))
                                    .map(item => (
                                      <div
                                        key={item.itemId}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          border: '1px solid #ddd',
                                          borderRadius: '8px',
                                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                                          padding: '10px',
                                          backgroundColor: '#f9f9f9',
                                        }}
                                      >
                                        <img
                                          src={item.imageUrl}
                                          alt={item.name}
                                          style={{ width: '50px', height: '50px', marginRight: '15px' }}
                                        />
                                        <div>
                                          <p style={{ fontWeight: 'bold', margin: '0' }}>{item.name}</p>
                                          <p style={{ margin: '0' }}>Buyer Price: ₹{item.buyerPrice}</p>
                                        </div>
                                      </div>
                                    ))
                                )}
                                <h4 
                                  style={{ 
                                    marginTop: '16px', 
                                    color: '#333',
                                    textAlign: 'left',
                                  }}
                                >
                                  Total Price: ₹{
                                    // Calculate total price first and then format
                                    buyer.acceptedMaterials.flatMap(category =>
                                      category.items
                                        .filter(item => matchedBuyer.matchedItemIds.includes(item.itemId))
                                        .map(item => parseFloat(item.buyerPrice))
                                    ).reduce((total, price) => total + price, 0).toFixed(2)
                                  }
                                </h4>
                              </div>
                            ) : (
                              <p>No matched items.</p>
                            )}
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p>No scrap buyers available.</p>
                )}
              </Modal.Body>

      </Modal>
    </>
  );
};

export default Map;

const MapContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
`;

const ScrapBuyersButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

const BubbleCount = styled.span`
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 5px 10px;
  margin-left: 10px;
  font-size: 14px;
  display: inline-block;
`;
