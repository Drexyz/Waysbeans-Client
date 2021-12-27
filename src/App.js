import './styles/App.css';

import React, { useContext, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";

import { UserContext } from './context/userContext';

import Home from './pages/Home';
import DetailProduct from './pages/DetailProduct';
import Cart from './pages/Cart';
import Shipment from './pages/Shipment';
import Profile from './pages/Profile';
import AddProduct from './pages/AddProduct';
import EditProfile from './pages/EditProfile';
import DetailTransaction from './pages/DetailTransaction';

// Get API config & setAuthToken
import { API, setAuthToken } from './config/api';

// Init token on axios every time the app is refreshed here ...
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  // Init user context
  const [state, dispatch] = useContext(UserContext);

  //for check user
  const checkUser = async () => {
    try {
      const response = await API.get('/user');

      if (response.status === 404) {
        return dispatch({
          type: 'AUTH_ERROR',
        });
      }

      let payload = response.data.data.user;

      payload.token = localStorage.token;

      dispatch({
        type: 'USER_SUCCESS',
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  //did mount -> check user
  useEffect(() => {
    checkUser();
  }, []);

  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="detailproduct/:productId" element={<DetailProduct />} />
        <Route path="cart" element={<Cart />} />
        <Route path="shipment" element={<Shipment />} />
        <Route path="profile" element={<Profile />} />
        <Route path="addproduct" element={<AddProduct />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="transaction/:transactionId" element={<DetailTransaction />} />
    </Routes>
  );
}

export default App;
