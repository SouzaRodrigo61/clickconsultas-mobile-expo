import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { AuthProvider, useAuth } from '../../contexts/auth';

// Mock do logoutService
jest.mock('../../services/logoutService', () => ({
  __esModule: true,
  default: {
    setLogoutCallback: jest.fn(),
  },
}));

// Componente de teste para usar o hook
const TestComponent: React.FC = () => {
  const { signed, user, loading, signIn, signOut } = useAuth();
  return (
    <View>
      <Text testID="signed">{signed ? 'true' : 'false'}</Text>
      <Text testID="loading">{loading ? 'true' : 'false'}</Text>
      <Text testID="user">{user ? JSON.stringify(user) : 'null'}</Text>
      <TouchableOpacity 
        testID="signIn" 
        onPress={() => signIn({ nome: 'Test', email: 'test@test.com' }, 'token123')}
      >
        <Text>SignIn</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="signOut" onPress={() => signOut()}>
        <Text>SignOut</Text>
      </TouchableOpacity>
    </View>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  it('deve inicializar com usuário não autenticado', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading').children[0]).toBe('false');
    });

    expect(getByTestId('signed').children[0]).toBe('false');
    expect(getByTestId('user').children[0]).toBe('null');
  });

  it('deve carregar usuário do AsyncStorage se existir', async () => {
    const mockUser = { nome: 'Test User', email: 'test@test.com' };
    const mockToken = 'token123';

    await AsyncStorage.setItem('@ClickConsultas:user', JSON.stringify(mockUser));
    await AsyncStorage.setItem('@ClickConsultas:token', mockToken);

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading').children[0]).toBe('false');
    });

    await waitFor(() => {
      const userText = getByTestId('user').children[0] as string;
      expect(userText).not.toBe('null');
      const user = JSON.parse(userText);
      expect(user.email).toBe(mockUser.email);
    });

    expect(getByTestId('signed').children[0]).toBe('true');
    expect(api.defaults.headers.Authorization).toBe(`Bearer ${mockToken}`);
  });

  it('deve fazer login com sucesso', async () => {
    const mockUser = { nome: 'Test User', email: 'test@test.com' };
    const mockToken = 'token123';

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading').children[0]).toBe('false');
    });

    // Simular signIn
    const signInButton = getByTestId('signIn');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(getByTestId('signed').children[0]).toBe('true');
    });

    // Verificar se o token foi salvo
    const savedToken = await AsyncStorage.getItem('@ClickConsultas:token');
    expect(savedToken).toBe(mockToken);

    const savedUser = await AsyncStorage.getItem('@ClickConsultas:user');
    expect(savedUser).toBeTruthy();
  });

  it('deve fazer logout com sucesso', async () => {
    const mockUser = { nome: 'Test User', email: 'test@test.com' };
    const mockToken = 'token123';

    await AsyncStorage.setItem('@ClickConsultas:user', JSON.stringify(mockUser));
    await AsyncStorage.setItem('@ClickConsultas:token', mockToken);

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('signed').children[0]).toBe('true');
    });

    // Simular signOut
    const signOutButton = getByTestId('signOut');
    fireEvent.press(signOutButton);

    await waitFor(() => {
      expect(getByTestId('signed').children[0]).toBe('false');
    });

    // Verificar se os dados foram removidos
    const savedToken = await AsyncStorage.getItem('@ClickConsultas:token');
    expect(savedToken).toBeNull();

    const savedUser = await AsyncStorage.getItem('@ClickConsultas:user');
    expect(savedUser).toBeNull();
  });
});

