import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const RECAPTCHA_TOKEN = '6LcDvHEaAAAAADExXf46EMayH7sxiPcyxMm9Cjrl';

const api = axios.create({
  baseURL: `http://uo04sc8488480wcsck0s0448.72.60.12.76.sslip.io`,
  timeout: 15000
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@ClickConsultas:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para logout automático em caso de erro de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Sessão expirada. Executando logout automático...');
      
      // Importar e executar logout automático
      const logoutService = await import('./logoutService');
      await logoutService.default.executeLogout();
    }
    return Promise.reject(error);
  },
);

export default api;
