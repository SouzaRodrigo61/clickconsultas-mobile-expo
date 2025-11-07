import api from "../services/api.js";
import axios from "axios";

const resources = {};

const makeRequestCreator = () => {
  let cancel;

  return async (query) => {
    // Check if we made a request
    if (cancel) {
      // Cancel the previous request before making a new request
      cancel.cancel();
    }
    // Create a new CancelToken
    cancel = axios.CancelToken.source();
    try {
      if (resources[query]) {
        // Return result if it exists
        return resources[query];
      }
      // Usar api.get para garantir que interceptors funcionem corretamente
      const res = await api.get(query, { cancelToken: cancel.token });

      const response = res?.data;
      // Store response
      resources[query] = res;

      return res;
    } catch (error) {
      if (axios.isCancel(error)) {
        // Se foi cancelado, não relançar o erro
        console.log('Request cancelado:', query);
        throw error; // Relançar para indicar que foi cancelado
      } else {
        // Relançar erros para que interceptors (como o de 401/403) funcionem
        console.error('Erro na requisição:', query, error.response?.status || error.message);
        throw error;
      }
    }
  };
};

export const request = makeRequestCreator();
