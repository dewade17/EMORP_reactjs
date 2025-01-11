/* eslint-disable react/prop-types */
import MainLayout from './Main';

const PublicRoute = ({ component }) => {
  return <MainLayout> {component} </MainLayout>;
};

export default PublicRoute;
