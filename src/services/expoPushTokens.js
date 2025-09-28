import api from "./api";

export const register = (pushToken) => {
  return api.put("/expoPushTokens", { token: pushToken });
};
