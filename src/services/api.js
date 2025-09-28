import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const RECAPTCHA_TOKEN = '6LcDvHEaAAAAADExXf46EMayH7sxiPcyxMm9Cjrl';

const api = axios.create({
  baseURL: `http://uo04sc8488480wcsck0s0448.72.60.12.76.sslip.io`,
  timeout: 5000
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@ClickConsultas:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 403) {
//       alert('Sua sessão expirou! Faça login novamente para continuar.');
//       logout();
//       return window.location.reload();
//     }
//     return Promise.reject(error);
//   },
// );

export default api;
