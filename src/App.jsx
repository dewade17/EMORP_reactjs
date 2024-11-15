import { Routes, Route } from 'react-router-dom';

import 'antd/dist/reset.css';
import './assets/styles/main.css';
import './assets/styles/responsive.css';
import './assets/styles/adaptive.css';

import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/layout/PrivateRoute';
import Blank from './pages/Blank';
import Order from './pages/Blank/order';
import Kategori from './pages/Kategori/kategori';
import Produk from './pages/Produk/produk';
import Layananproduk from './pages/layananproduk/layanan_produk';
import Playlist from './pages/playlist/playlist';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route
          exact
          path='/'
          element={<LoginPage />}
        />
        <Route
          exact
          path='/login'
          element={<LoginPage />}
        />
        <Route
          exact
          path='/dashboard'
          element={<PrivateRoute component={<Dashboard />} />}
        />
        <Route
          exact
          path='/orders'
          element={<PrivateRoute component={<Order />} />}
        />
        <Route
          exact
          path='/categories'
          element={<PrivateRoute component={<Kategori />} />}
        />

        <Route
          exact
          path='/products'
          element={<PrivateRoute component={<Produk />} />}
        />
        <Route
          exact
          path='/layananproduk'
          element={<PrivateRoute component={<Layananproduk />} />}
        />
        <Route
          exact
          path='/playlist'
          element={<PrivateRoute component={<Playlist />} />}
        />
        <Route
          exact
          path='/report-orders'
          element={<PrivateRoute component={<Blank />} />}
        />
        <Route
          exact
          path='/summary'
          element={<PrivateRoute component={<Blank />} />}
        />
        <Route
          exact
          path='/product-sales-report'
          element={<PrivateRoute component={<Blank />} />}
        />
        <Route
          exact
          path='/profile'
          element={<PrivateRoute component={<Blank />} />}
        />
        <Route
          exact
          path='/membership'
          element={<PrivateRoute component={<Blank />} />}
        />
      </Routes>
    </div>
  );
}

export default App;
