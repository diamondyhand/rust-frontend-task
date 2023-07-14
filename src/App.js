import React from 'react';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import MyOrder from './pages/MyOrder'

import Login from './pages/Login';
import SignUp from './pages/Register';


const App = () => {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/my-order" element={<MyOrder />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
};

export default App;

