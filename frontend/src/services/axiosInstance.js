import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // gửi cookie HttpOnly (refresh token)
});

let isRefreshing = false;
let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

instance.interceptors.request.use(
  config => {
    // Không thêm header Authorization cho request refresh token, login, register
    if (
      !config.url.includes('api/refresh-access-token') &&
      !config.url.includes('api/login') &&
      !config.url.includes('api/register')
    ) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Đang refresh token, queue lại request chờ token mới
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return instance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // try {
      //   // Gọi API refresh token
      //   console.log("ss");
      //   const res = await instance.post('/api/refresh-access-token');
      //   const newToken = res.data.accessToken;

      //   // Lưu token mới
      //   localStorage.setItem('accessToken', newToken);
      //   processQueue(null, newToken);

      //   // Retry request cũ với token mới
      //   originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
      //   console.log("ss1");
      //   return instance(originalRequest);
      // } catch (err) {
      //   processQueue(err, null);
      //   localStorage.removeItem('accessToken');
      //   localStorage.setItem('isLoggedIn', 'false');
      //   console.log("dd");
      //   // window.location.href = '/login'; // hoặc xử lý redirect login phù hợp
      //   return Promise.reject(err);
      // } finally {
      //   isRefreshing = false;
      // }
    }

    return Promise.reject(error);
  }
);

export default instance;
