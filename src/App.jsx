import { Routes, Route } from 'react-router-dom';

import 'antd/dist/reset.css';
import './assets/styles/main.css';
import './assets/styles/responsive.css';
import './assets/styles/adaptive.css';

import PrivateRouteAdmin from './components/layoutadmin/PrivateRoute';
import PrivateRouteUser from './components/layoutuser/PrivateRoute';
import Kategori from './pages/admin/Kategori/kategori';
import Produk from './pages/admin/Produk/produk';
import Layananproduk from './pages//admin/layananproduk/layanan_produk';
import Order from './pages/admin/Order/Order';
import Layanantertinggi from './pages/admin/Layanan_tertinggi/Layanantertinggi';
import Layananpengaduan from './pages/admin/Layananpengaduan/Layananpengaduan';
import AuthProvider from './providers/AuthProvider';
import Dashboardadmin from './pages/admin/Dashboard';
import RegisterPage from './pages/Login/register';

import Dashboardcustomer from './pages/customer/Dashboard';
import LoginPage from './pages/Login';
import PublicRoute from './components/layoutuser/PublicRoutes';
import Nonzone from './pages/customer/Topup/nonzone';
import Zone from './pages/customer/Topup/zone';
import Invoice from './pages/customer/invoice/invoice';
import Resetpassword from './pages/Login/resetpassword';
import ErrorPage from './pages/error/404';
import ProfilePage from './pages/customer/profile/profile';
import RiwayatTransaksi from './pages/customer/riwayat_transaksi/riwayat';

function App() {
  return (
    <div className='App'>
      {/* start-admin */}
      <AuthProvider>
        <Routes>
          <Route
            exact
            path='/'
            element={<PublicRoute component={<Dashboardcustomer />} />}
            errorElement={<ErrorPage />}
          />
          <Route
            exact
            path='/login'
            element={<LoginPage />}
            errorElement={<ErrorPage />}
          />
          <Route
            exact
            path='/dashboard-admin'
            element={<PrivateRouteAdmin component={<Dashboardadmin />} />}
            errorElement={<ErrorPage />}
          />
          <Route
            exact
            path='/dashboard-customer'
            element={<PrivateRouteUser component={<Dashboardcustomer />} />}
            errorElement={<ErrorPage />}
          />
          <Route
            exact
            path='/riwayat-transaksi'
            element={<PrivateRouteUser component={<RiwayatTransaksi />} />}
            errorElement={<ErrorPage />}
          />
          <Route
            exact
            path='/layanan-pengaduan'
            element={<PrivateRouteAdmin component={<Layananpengaduan />} />}
            errorElement={<ErrorPage />}
          />
          <Route
            exact
            path='/categories'
            element={<PrivateRouteAdmin component={<Kategori />} />}
            errorElement={<ErrorPage />}
          />
          <Route
            exact
            path='/produk'
            element={<PrivateRouteAdmin component={<Produk />} />}
            errorElement={<ErrorPage />}
          />
          <Route
            exact
            path='/layanan-produk'
            element={<PrivateRouteAdmin component={<Layananproduk />} />}
            errorElement={<ErrorPage />}
          />
          <Route
            exact
            path='/order'
            element={<PrivateRouteAdmin component={<Order />} />}
            errorElement={<ErrorPage />}
          />
          <Route
            exact
            path='/layanan-tertinggi'
            element={<PrivateRouteAdmin component={<Layanantertinggi />} />}
            errorElement={<ErrorPage />}
          />
          <Route
            exact
            path='/profile'
            element={<PrivateRouteUser component={<ProfilePage />} />}
            errorElement={<ErrorPage />}
          />
          <Route
            exact
            path='/register'
            element={<RegisterPage />}
            errorElement={<ErrorPage />}
          />
          <Route
            exact
            path='/reset-password'
            element={<Resetpassword />}
            errorElement={<ErrorPage />}
          />
          <Route
            exact
            path='/invoice'
            element={<PublicRoute component={<Invoice />} />}
            errorElement={<ErrorPage />}
          />
          <Route
            exact
            path='/detail/nonzona/:id'
            element={<PublicRoute component={<Nonzone />} />}
            errorElement={<ErrorPage />}
          />
          <Route
            exact
            path='/detail/zona/:id'
            element={<PublicRoute component={<Zone />} />}
            errorElement={<ErrorPage />}
          />
        </Routes>
      </AuthProvider>
      {/* end-admin */}
    </div>
  );
}

export default App;
