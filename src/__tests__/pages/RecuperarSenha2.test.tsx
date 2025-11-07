import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RecuperarSenha2 from '../../pages/RecuperarSenha2';
import api from '../../services/api';

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

// Mock do moment
jest.mock('moment', () => {
  const moment = jest.requireActual('moment');
  return {
    ...moment,
    utc: jest.fn((time) => ({
      format: jest.fn(() => '01:00'),
    })),
  };
});

describe('Página RecuperarSenha2', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.post as jest.Mock).mockClear();
  });

  it('deve renderizar corretamente', () => {
    const { getByText, getByPlaceholderText } = render(
      <RecuperarSenha2 route={{ params: { email: 'test@test.com' } }} />
    );

    expect(getByText('Recuperação de senha')).toBeTruthy();
    expect(getByPlaceholderText('Entre com o código')).toBeTruthy();
    expect(getByText('Próximo')).toBeTruthy();
  });

  it('deve permitir digitar código', () => {
    const { getByPlaceholderText } = render(
      <RecuperarSenha2 route={{ params: { email: 'test@test.com' } }} />
    );

    const codigoInput = getByPlaceholderText('Entre com o código');
    fireEvent.changeText(codigoInput, '123456');

    expect(codigoInput.props.value).toBe('123456');
  });

  it('deve validar tamanho do código', async () => {
    const { getByPlaceholderText, getByText } = render(
      <RecuperarSenha2 route={{ params: { email: 'test@test.com' } }} />
    );

    const codigoInput = getByPlaceholderText('Entre com o código');
    const proximoButton = getByText('Próximo');

    fireEvent.changeText(codigoInput, '123');
    fireEvent.press(proximoButton);

    await waitFor(() => {
      expect(getByText('Código inválido!')).toBeTruthy();
    });

    expect(api.post).not.toHaveBeenCalled();
  });

  it('deve validar código com sucesso', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: {} });

    const { getByPlaceholderText, getByText } = render(
      <RecuperarSenha2 route={{ params: { email: 'test@test.com' } }} />
    );

    const codigoInput = getByPlaceholderText('Entre com o código');
    const proximoButton = getByText('Próximo');

    fireEvent.changeText(codigoInput, '123456');
    fireEvent.press(proximoButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/code-validation/paciente', {
        email: 'test@test.com',
        code: '123456',
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('RecuperarSenha3', {
        email: 'test@test.com',
        code: '123456',
      });
    });
  });

  it('deve reenviar código', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: {} });

    const { getByText } = render(
      <RecuperarSenha2 route={{ params: { email: 'test@test.com' } }} />
    );

    const reenviarLink = getByText('Não recebeu um código? Clique aqui para reenviar');
    fireEvent.press(reenviarLink);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/forgot-password/paciente', {
        email: 'test@test.com',
      });
    });
  });
});

