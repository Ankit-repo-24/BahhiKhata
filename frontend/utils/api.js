import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

/* ✅ ATTACH TOKEN TO EVERY REQUEST */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Something went wrong';

    /* ✅ GLOBAL AUTH FAILURE HANDLING */
    if (status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');

      // prevent redirect loop
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject({ status, message });
  }
);


export default api;
