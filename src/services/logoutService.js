import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

// Serviço para logout automático
class LogoutService {
  constructor() {
    this.logoutCallback = null;
  }

  // Registrar callback de logout
  setLogoutCallback(callback) {
    this.logoutCallback = callback;
  }

  // Executar logout
  async executeLogout() {
    try {
      // Limpar AsyncStorage
      await AsyncStorage.clear();
      
      // Limpar headers da API
      delete api.defaults.headers.Authorization;
      
      // Executar callback se existir
      if (this.logoutCallback) {
        this.logoutCallback();
      }
      
      console.log('Logout automático executado com sucesso');
    } catch (error) {
      console.log('Erro ao executar logout automático:', error);
    }
  }
}

export default new LogoutService();
