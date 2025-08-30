import { jwtDecode } from 'jwt-decode';

export function getUserRole() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch (err) {
    return null;
  }
}
export function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000); // Thời gian hiện tại tính bằng giây
    return payload.exp && payload.exp < now;
  } catch (e) {
    return true; // Nếu parse lỗi => coi như token hết hạn
  }
}


// src/services/authService.js
export const getUserFromToken = () => {
  try {
    const token = getToken();
    if (!token) return null;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );

    return JSON.parse(jsonPayload); // chứa các thông tin như id, username, role, ...
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
};

// Helper để lấy token từ cookie hoặc localStorage
export const getToken = () => {
  // Nếu bạn dùng localStorage:
  return localStorage.getItem('token');

  // Nếu bạn dùng HttpOnly Cookie thì không thể lấy ở phía frontend
  // return null;
};


