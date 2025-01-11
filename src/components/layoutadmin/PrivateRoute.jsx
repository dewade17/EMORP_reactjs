/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import LoginPage from '../../pages/Login';

import MainLayout from './Main';

const PrivateRoute = ({ component }) => {
  const { isLoggedIn } = useContext(AuthContext);
  console.log('PrivateRoute -> isLoggedIn', isLoggedIn);

  if (isLoggedIn) {
    // Redirect to login page or any other public route
    return <MainLayout> {component} </MainLayout>;
  }
  // return <Navigate to="/login" replace />;
  return <LoginPage />;

  // Render the child component or outlet
};

export default PrivateRoute;
