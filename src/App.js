import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom'; // Moved useLocation into Router context
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './Login';
import LocationPicker from './LocationPicker';
import SellBuyPage from './SellBuyPage';
import CategoryPage from './CategoryPage';
import PickupOrderStatus from './pickupOrderStatus';
import PickupInfo from './pickupInfo';
import PickupList from './ordersList';
import MarketPrice from './marketPrice';
import Profile from './profile';
import EcommerceHome from './EcommerceHome';
import EcommerceWallet from './EcommerceWallet';
import CouponPage from './couponPage';
import ProductDescriptionPage from './productDescriptionPage';
import PurchasedVouchersPage from './purchasedVouchersPage';
import AccountInfo from './accountInfo';
import PreviousOrders from './previousOrders';
import ScrapBuyersList from './scrapBuyerPage';

import OrdersDashboard from './recommerceOrderList';

import WishlistProducts from './wishList';


function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [savedLocation, setSavedLocation] = useState(null);
  const [ordersList, setOrdersList] = useState([]);
  const [cart, setCart] = useState([]);
  const [purchasedVouchers, setPurchasedVouchers] = useState([]);
  const [previousRoute, setPreviousRoute] = useState(null); // To track previous route

  const location = useLocation(); // Use useLocation inside Router

  useEffect(() => {
    // Update the previous route whenever the location changes
    setPreviousRoute(location.pathname);

  }, [location]);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  const handleConfirmLocation = (location) => {
    setSavedLocation(location);
  };

  const addOrder = (newOrder) => {
    setOrdersList((prevOrders) => [...prevOrders, newOrder]);
  };

  const cancelOrder = (packageId) => {
    setOrdersList((prevOrders) => prevOrders.filter((order) => order.packageId !== packageId));
  };

  const updateCart = (newCart) => {
    setCart(newCart);
  };

  return (
    <div className="App">
      <Routes>
        {/* Default route redirects to sell-buy after authentication */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/sell-buy" />
            ) : (
              <Login onAuthenticate={handleAuthentication} />
            )
          }
        />

        {/* Route for LocationPicker (accessible directly) */}
        <Route path="/location-picker" element={<LocationPicker onConfirmLocation={handleConfirmLocation} />} />

        <Route path="/orders-dashboard" element={<OrdersDashboard />} />
        <Route path="/sell-buy" element={<SellBuyPage />} />
        <Route path="/EcommerceHome" element={<EcommerceHome previousRoute={previousRoute} />} />
        <Route path="/EcommerceWallet" element={<EcommerceWallet />} />
        <Route path="/category" element={<CategoryPage ordersList={ordersList} />} />
        <Route path="/pickup-order-status" element={<PickupOrderStatus cancelOrder={cancelOrder} />} />
        <Route path="/pickup-info" element={<PickupInfo addOrder={addOrder} cart={cart} updateCart={updateCart} />} />
        <Route path="/pickup-list" element={<PickupList ordersList={ordersList} />} />
        <Route path="/market-price" element={<MarketPrice addOrder={addOrder} updateCart={updateCart} cart={cart} previousRoute={previousRoute} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product-description/:id" element={<ProductDescriptionPage />} />
        <Route path="/couponPage" element={<CouponPage />} />
        <Route path="/purchased-Vouchers" element={<PurchasedVouchersPage />} />
        <Route path="/account-info" element={<AccountInfo />} />
        <Route path="/previous-orders" element={<PreviousOrders />} />
        <Route path="/ScrapBuyersList" element={<ScrapBuyersList />} />

        <Route path="/WishlistProducts" element={<WishlistProducts />} />
      </Routes>
    </div>
  );
}

export default AppWrapper;
