import axiosInstance from './axiosInstance';

export const login = async (email, password, remember) => {
  // Với login, vì chưa có access token, nên bạn có thể dùng axios mặc định hoặc instance không thêm Authorization cũng được.
  // Nếu muốn đồng bộ, có thể dùng axiosInstance nhưng phải đảm bảo instance không tự thêm header khi login.

  const response = await axiosInstance.post('/api/login', {
    email,
    password,
    remember,
  }, { withCredentials: true });

  localStorage.setItem('accessToken', response.data.accessToken);
  return response.data;
};

export const refreshAccessToken = async () => {
  try {
    const response = await axiosInstance.post('/api/refresh-access-token', null, {
      withCredentials: true,
    });

    const newAccessToken = response.data.accessToken;
    localStorage.setItem('accessToken', newAccessToken);

    return newAccessToken;
  } catch (err) {
      // refresh token expired hoặc bị revoke
    if (err.response?.status === 401) {
      window.location.href = '/login'; // hoặc navigate('/login')
      //ko co token
    } else if (err.response?.status === 400) {
      window.location.href = '/unauthorized';
    }
    localStorage.removeItem('accessToken');
    localStorage.setItem('isLoggedIn', 'false');
    throw err;
  }
};

export const register = async ({ userName, email, password }) => {
  try {
    const response = await axiosInstance.post('/api/register', {
      userName,
      email,
      password,
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post('/api/logout', null, {
      withCredentials: true, // gửi cookie refreshToken lên server
    });
    localStorage.setItem('isLoggedIn', 'false');
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    localStorage.removeItem('accessToken'); // xoá access token trên FE

    // Optional: cũng xoá cookies nếu bạn lưu refreshToken trong JS cookie (nếu không dùng HttpOnly)
    // document.cookie = "refreshToken=; Max-Age=0; path=/";

    // window.location.href = '/login';
  }
};
