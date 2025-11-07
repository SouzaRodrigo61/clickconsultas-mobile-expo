import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Entrar from '../../pages/Entrar';
import api from '../../services/api';
import { useAuth } from '../../contexts/auth';

// Mock do useAuth
jest.mock('../../contexts/auth');
const mockSignIn = jest.fn();

// Mock do useNavigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
      addListener: jest.fn(() => jest.fn()),
    }),
  };
});

// Mock de MaterialIcons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

describe('Página Entrar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
    });
    (api.post as jest.Mock).mockClear();
  });

  it('deve renderizar corretamente', () => {
    const { getByPlaceholderText, getByText } = render(<Entrar />);

    expect(getByPlaceholderText('E-mail')).toBeTruthy();
    expect(getByPlaceholderText('Senha')).toBeTruthy();
    expect(getByText('Bem-vindo')).toBeTruthy();
    expect(getByText('Entrar')).toBeTruthy();
  });

  it('deve permitir digitar email e senha', () => {
    const { getByPlaceholderText } = render(<Entrar />);

    const emailInput = getByPlaceholderText('E-mail');
    const senhaInput = getByPlaceholderText('Senha');

    fireEvent.changeText(emailInput, 'test@test.com');
    fireEvent.changeText(senhaInput, 'senha123');

    expect(emailInput.props.value).toBe('test@test.com');
    expect(senhaInput.props.value).toBe('senha123');
  });

  it('deve alternar visibilidade da senha', () => {
    const { getByPlaceholderText, getByText } = render(<Entrar />);

    const senhaInput = getByPlaceholderText('Senha');
    const mostrarButton = getByText('Mostrar');

    // Inicialmente a senha está oculta
    expect(senhaInput.props.secureTextEntry).toBe(true);

    // Clicar em mostrar
    fireEvent.press(mostrarButton);

    // Agora deve mostrar "Não Mostrar" e a senha deve estar visível
    expect(getByText('Não Mostrar')).toBeTruthy();
    expect(senhaInput.props.secureTextEntry).toBe(false);
  });

  it('deve fazer login com sucesso', async () => {
    const mockUser = { nome: 'Test User', email: 'test@test.com' };
    const mockToken = 'token123';

    (api.post as jest.Mock).mockResolvedValueOnce({
      data: {
        user: mockUser,
        token: mockToken,
      },
    });

    const { getByPlaceholderText, getByText } = render(<Entrar />);

    const emailInput = getByPlaceholderText('E-mail');
    const senhaInput = getByPlaceholderText('Senha');
    const entrarButton = getByText('Entrar');

    fireEvent.changeText(emailInput, 'test@test.com');
    fireEvent.changeText(senhaInput, 'senha123');
    fireEvent.press(entrarButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/login/paciente', {
        email: 'test@test.com',
        senha: 'senha123',
        mobile: true,
      });
    });

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(mockUser, mockToken);
    });
  });

  it('deve exibir erro quando login falhar', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce({
      response: {
        data: { message: 'Credenciais inválidas' },
      },
    });

    const { getByPlaceholderText, getByText, findByText } = render(<Entrar />);

    const emailInput = getByPlaceholderText('E-mail');
    const senhaInput = getByPlaceholderText('Senha');
    const entrarButton = getByText('Entrar');

    fireEvent.changeText(emailInput, 'test@test.com');
    fireEvent.changeText(senhaInput, 'senhaerrada');
    fireEvent.press(entrarButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });

    const errorMessage = await findByText('Verifique suas informações e tente novamente.');
    expect(errorMessage).toBeTruthy();
  });

  it('deve navegar para página de cadastro', () => {
    const { getByText } = render(<Entrar />);

    const cadastroButton = getByText('Não tem conta? Cadastre-se');
    fireEvent.press(cadastroButton);

    expect(mockNavigate).toHaveBeenCalledWith('Cadastro');
  });

  it('deve navegar para recuperar senha', () => {
    const { getByText } = render(<Entrar />);

    const recuperarSenhaLink = getByText('Esqueci minha senha');
    fireEvent.press(recuperarSenhaLink);

    expect(mockNavigate).toHaveBeenCalledWith('RecuperarSenha1');
  });

  it('deve mostrar loading durante o login', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (api.post as jest.Mock).mockReturnValueOnce(promise);

    const { getByPlaceholderText, getByText, queryByText } = render(<Entrar />);

    const emailInput = getByPlaceholderText('E-mail');
    const senhaInput = getByPlaceholderText('Senha');
    const entrarButton = getByText('Entrar');

    fireEvent.changeText(emailInput, 'test@test.com');
    fireEvent.changeText(senhaInput, 'senha123');
    fireEvent.press(entrarButton);

    // Deve mostrar "Verificando..."
    await waitFor(() => {
      expect(getByText('Verificando...')).toBeTruthy();
    });

    // Resolver a promise
    resolvePromise!({
      data: {
        user: { nome: 'Test', email: 'test@test.com' },
        token: 'token123',
      },
    });

    await waitFor(() => {
      expect(queryByText('Verificando...')).toBeNull();
    });
  });
});
