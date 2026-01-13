// // src/services/api.ts
// import axios from 'axios';
// import { getToken, removeToken, API_URL } from '../utils/storage';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Interceptor to add Token to Headers
// api.interceptors.request.use(
//   (config) => {
//     const token = getToken();
//     if (token) {
//       // Attach the token in the standard Bearer format
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Interceptor to handle Token Expiration (401 errors)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // If the backend says the token is invalid/expired, log out
//       removeToken();
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

// src/services/api.ts
import axios from 'axios';
import { getToken, removeToken,BASE_URL } from '../utils/storage';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Identify if the request was a login attempt
    const isLoginRequest = error.config?.url?.includes('/login');

    // 2. Only redirect if it's NOT a login request
    if (error.response?.status === 401 && !isLoginRequest) {
      removeToken();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;