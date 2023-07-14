// authContext.js
import React, { createContext, useEffect, useState } from 'react';

import axios from 'axios';

const AuthContext = createContext();

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(-1);

  const login = async (email, password) => {
    try {
      console.log({ email, password });
      const res = await axios.post(REACT_APP_API_URL + '/api/user/login', {
        email,
        password
      });
      // console.log({res});
      if (res && res.status ===200) {
        console.log(res);
        setIsLoggedIn(() => true);
        window.localStorage.setItem('isLoggedIn', true)
        setUserId(()=>res.data.body.LoginResponse.user_id)
        window.localStorage.setItem('token', res.data.body.LoginResponse.token);
        console.log(isLoggedIn);
        return true;
      }
      return false;
    } catch (e) {
      console.log(2);
      return false;
    }

  };
  const register = async (email, password, username) => {
    console.log({ email, password });
    const res = await axios.post(REACT_APP_API_URL + '/api/user/signup', {
      email,
      password,
      username
    });
    window.location.href = '/login'
    // console.log(res);
    // setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(() => false);
    window.localStorage.removeItem('isLoggedIn');
    window.localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const authContextValue = {
    isLoggedIn,
    userId,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
