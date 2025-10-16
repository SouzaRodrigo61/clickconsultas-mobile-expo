import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../services/api";
import logoutService from "../services/logoutService";

interface User {
  nome: string;
  email: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn(user: any, token: any): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storagedUser = await AsyncStorage.getItem("@ClickConsultas:user");
      const storagedToken = await AsyncStorage.getItem("@ClickConsultas:token");

      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser));
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
      }

      setLoading(false);
    }

    // Registrar callback para logout automático
    logoutService.setLogoutCallback(() => {
      setUser(null);
    });

    loadStorageData();
  });

  async function signIn(user, token) {
    setUser(user);

    api.defaults.headers.Authorization = `Bearer ${token}`;

    await AsyncStorage.setItem("@ClickConsultas:user", JSON.stringify(user));
    await AsyncStorage.setItem("@ClickConsultas:token", token);
  }

  async function signOut() {
    // Limpar dados do AsyncStorage
    await AsyncStorage.clear();
    
    // Limpar headers de autorização da API
    delete api.defaults.headers.Authorization;
    
    // Limpar estado do usuário
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}

export { AuthProvider, useAuth };
