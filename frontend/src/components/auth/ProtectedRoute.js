import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserRole, isTokenExpired } from '../../utils/jwtUtils';
// import axios from '../../services/axiosInstance'; // hoặc đường dẫn đúng
import { refreshAccessToken } from '../../services/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = React.useState(true);
  const [authorized, setAuthorized] = React.useState(false);

  React.useEffect(() => {
    async function checkAuth() {
      let token = localStorage.getItem('accessToken');

      // Nếu không có hoặc hết hạn
      if (!token || isTokenExpired(token)) {
        try {
          // Gọi API refresh-access-token để lấy token mới
          const newToken = await refreshAccessToken();
          token = newToken;
        } catch (err) {
          // Refresh thất bại => logout hoặc navigate
          setAuthorized(false);
          setLoading(false);
          return;
        }
      }

      // Kiểm tra quyền
      const role = getUserRole();
      if (requiredRole && role !== requiredRole) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      setAuthorized(true);
      setLoading(false);
    }

    checkAuth();
  }, [requiredRole]);

  if (loading) return <div>Loading...</div>;
  // if (!authorized) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
