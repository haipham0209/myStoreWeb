import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Footer from './components/layout/Footer';
import CustomerHeader from './components/layout/Header';

import LoginPage from './pages/LoginPage';
import Unauthorized from './pages/Unauthorized';
import RegisterPage from './pages/RegisterPage';

import AdminHomePage from './pages/admin/AdminHomePage';
import AdminProductList from './pages/admin/AdminProductList';
import AdminCategoryProducts from './pages/admin/AdminProductsByCategory';
import AdminCategoryList from './pages/admin/AdminCategoryList';
import AdminOnSalesList from './pages/admin/AdminOnSalesList';
import AdminCustomersManager from './pages/admin/AdminCustomersManager';

import CustomerHomePage from './pages/CustomerHomePage';

import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';

import { isTokenExpired } from './utils/jwtUtils';
// import { refreshAccessToken } from './services/authService';

function AppWrapper() {
  // BrowserRouter phải bọc App để useNavigate và useLocation hoạt động
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Lấy path hiện tại

  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const checkLogin = async () => {
      const hasLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!hasLoggedIn) {
        setAuthChecked(true);
        return;
      }

      const token = localStorage.getItem('accessToken');
      if (!token || isTokenExpired(token)) {
        try {
          // Nếu bạn dùng refresh token, gọi ở đây
          // await refreshAccessToken();
        } catch (err) {
          localStorage.removeItem('isLoggedIn');
          setAuthChecked(true);
          navigate('/login');
          return;
        }
      }

      setAuthChecked(true);
    };

    checkLogin();
  }, [navigate]);

  // Nếu muốn, có thể hiển thị loading trước khi authChecked
  if (!authChecked) return <p>Checking authentication...</p>;

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Chỉ hiển thị CustomerHeader nếu không phải route admin */}
      {!isAdminRoute && <CustomerHeader />}

      <main className="flex-grow-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<CustomerHomePage />} />

          {/* Admin routes với nested layout */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="home" element={<AdminHomePage />} />
            <Route path="users" element={<AdminCustomersManager />} />
            <Route path="products" element={<AdminProductList />} />
            <Route path="products/on-sales" element={<AdminOnSalesList />} />
            <Route path="products/categories" element={<AdminCategoryList />} />
            <Route path="products/categories/:id" element={<AdminCategoryProducts />} />
          </Route>

          {/* Redirect hoặc 404 có thể thêm ở đây */}
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default AppWrapper;
