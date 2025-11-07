import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import api from '../../services/api';

// Mock dos componentes antes de importar a página
jest.mock('../../components/StatusBar', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: 'statusBar' }),
  };
});

// Mock do MaterialCommunityIcons (usado na página)
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  function Icon({ name, ...props }: any) {
    return React.createElement(Text, props, name);
  }
  Icon.displayName = 'Icon';
  return {
    MaterialCommunityIcons: Icon,
    AntDesign: Icon,
  };
});

// Importar a página DEPOIS dos mocks
import RecuperarSenha3 from '../../pages/RecuperarSenha3';

// Mock do useNavigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
    }),
  };
});

describe('Página RecuperarSenha3', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.post as jest.Mock).mockClear();
  });

  it('deve renderizar corretamente', () => {
    const { getByText, getByPlaceholderText } = render(
      <RecuperarSenha3 route={{ params: { email: 'test@test.com', code: '123456' } }} />
    );

    expect(getByText('Digite sua nova senha')).toBeTruthy();
    expect(getByPlaceholderText('Senha')).toBeTruthy();
    expect(getByText('Próximo')).toBeTruthy();
  });

  it('deve permitir digitar senha', () => {
    const { getByPlaceholderText } = render(
      <RecuperarSenha3 route={{ params: { email: 'test@test.com', code: '123456' } }} />
    );

    const senhaInput = getByPlaceholderText('Senha');
    fireEvent.changeText(senhaInput, 'novaSenha123');

    expect(senhaInput.props.value).toBe('novaSenha123');
  });

  it('deve alternar visibilidade da senha', () => {
    const { getByPlaceholderText, getByText } = render(
      <RecuperarSenha3 route={{ params: { email: 'test@test.com', code: '123456' } }} />
    );

    const senhaInput = getByPlaceholderText('Senha');
    const mostrarButton = getByText('Mostrar senha');

    expect(senhaInput.props.secureTextEntry).toBe(true);

    fireEvent.press(mostrarButton);

    expect(senhaInput.props.secureTextEntry).toBe(false);
  });

  it('deve resetar senha com sucesso', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: {} });

    const { getByPlaceholderText, getByText } = render(
      <RecuperarSenha3 route={{ params: { email: 'test@test.com', code: '123456' } }} />
    );

    const senhaInput = getByPlaceholderText('Senha');
    const proximoButton = getByText('Próximo');

    fireEvent.changeText(senhaInput, 'novaSenha123');
    fireEvent.press(proximoButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/reset-password/paciente', {
        email: 'test@test.com',
        code: '123456',
        senha: 'novaSenha123',
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Entrar');
    });
  });

  it('deve exibir erro quando resetar senha falhar', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('Erro na API'));

    const { getByPlaceholderText, getByText, findByText } = render(
      <RecuperarSenha3 route={{ params: { email: 'test@test.com', code: '123456' } }} />
    );

    const senhaInput = getByPlaceholderText('Senha');
    const proximoButton = getByText('Próximo');

    fireEvent.changeText(senhaInput, 'novaSenha123');
    fireEvent.press(proximoButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });

    const errorMessage = await findByText('Senha inválida!');
    expect(errorMessage).toBeTruthy();
  });
});

