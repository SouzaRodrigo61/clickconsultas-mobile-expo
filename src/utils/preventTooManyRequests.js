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
      const res = await api(query, { cancelToken: cancel.token });

      const response = await res?.data;
      // Store response
      resources[query] = response;

      return response;
    } catch (error) {
      if (axios.isCancel(error)) {
        // Handle if request was cancelled
      } else {
        // Handle usual errors
      }
    }
  };
};

export const request = makeRequestCreator();
