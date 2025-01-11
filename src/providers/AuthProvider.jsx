/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getDataPrivate, logoutAPI } from '../utils/api';
import { jwtStorage } from '../utils/jwt_storage';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const navigate = useNavigate();

  const getDataProfile = () => {
    getDataPrivate(`user/data`)
      .then((resp) => {
        console.log('API Response:', resp);
        if (resp?.user_logged) {
          setUserProfile(resp);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((err) => {
        setIsLoggedIn(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getDataProfile();
  }, []);

  const login = (access_token) => {
    jwtStorage.storeToken(access_token);
    getDataProfile();

    // Redirect based on role
    getDataPrivate(`user/data`).then((resp) => {
      if (resp?.role === 'admin') {
        navigate('/dashboard-admin', { replace: true });
      } else if (resp?.role === 'user') {
        navigate('/dashboard-customer', { replace: true });
      } else {
        console.log('Unknown role:', resp?.role);
        setIsLoggedIn(false);
      }
    });
  };

  const logout = () => {
    logoutAPI()
      .then((resp) => {
        if (resp?.isLoggedOut) {
          jwtStorage.removeItem();
          setIsLoggedIn(false);
          navigate('/login', { replace: true });
        }
      })
      .catch((err) => console.log(err));
  };

  return <AuthContext.Provider value={{ isLoggedIn, login, logout, userProfile }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
