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
  console.log('AuthProvider: Componente inicializado');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Auth: useEffect executado');
    async function loadStorageData() {
      try {
        console.log('Auth: Carregando dados do AsyncStorage...');
        const storagedUser = await AsyncStorage.getItem("@ClickConsultas:user");
        const storagedToken = await AsyncStorage.getItem("@ClickConsultas:token");

        console.log('Auth: Dados encontrados:', { 
          hasUser: !!storagedUser, 
          hasToken: !!storagedToken 
        });

        if (storagedUser && storagedToken) {
          setUser(JSON.parse(storagedUser));
          api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
          console.log('Auth: Usuário autenticado');
        } else {
          console.log('Auth: Nenhum usuário autenticado');
        }
      } catch (error) {
        console.error('Auth: Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
        console.log('Auth: Loading finalizado');
      }
    }

    // Registrar callback para logout automático
    logoutService.setLogoutCallback(() => {
      console.log('Auth: Logout automático executado');
      setUser(null);
    });

    loadStorageData();
  }, []); // Adicionar array de dependências vazio

  async function signIn(user, token) {
    console.log('Auth: SignIn executado com user:', user);
    setUser(user);

    api.defaults.headers.Authorization = `Bearer ${token}`;

    await AsyncStorage.setItem("@ClickConsultas:user", JSON.stringify(user));
    await AsyncStorage.setItem("@ClickConsultas:token", token);
    
    console.log('Auth: Login concluído com sucesso');
  }

  async function signOut() {
    try {
      console.log('Auth: Iniciando signOut...');
      
      // Limpar estado do usuário primeiro (mais rápido)
      setUser(null);
      console.log('Auth: Estado do usuário limpo');
      
      // Limpar headers de autorização da API
      delete api.defaults.headers.Authorization;
      console.log('Auth: Headers de autorização limpos');
      
      // Limpar dados do AsyncStorage
      await AsyncStorage.clear();
      console.log('Auth: AsyncStorage limpo');
      
      // Pequeno delay para garantir que o estado foi atualizado
      await new Promise(resolve => setTimeout(resolve, 50));
      
      console.log('Auth: SignOut concluído com sucesso');
    } catch (error) {
      console.error('Auth: Erro durante signOut:', error);
      // Mesmo com erro, garantir que o estado local está limpo
      setUser(null);
      delete api.defaults.headers.Authorization;
    }
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

export { AuthProvider, useAuth, AuthContext };
