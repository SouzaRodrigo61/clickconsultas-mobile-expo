import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RecuperarSenha1 from '../../pages/RecuperarSenha1';
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

describe('Página RecuperarSenha1', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.post as jest.Mock).mockClear();
  });

  it('deve renderizar corretamente', () => {
    const { getByText, getByPlaceholderText } = render(<RecuperarSenha1 />);

    expect(getByPlaceholderText('Entre com seu email')).toBeTruthy();
    expect(getByText('Próximo')).toBeTruthy();
    expect(getByText('Recuperação de senha')).toBeTruthy();
  });

  it('deve permitir digitar email', () => {
    const { getByPlaceholderText } = render(<RecuperarSenha1 />);

    const emailInput = getByPlaceholderText('Entre com seu email');
    fireEvent.changeText(emailInput, 'test@test.com');

    expect(emailInput.props.value).toBe('test@test.com');
  });

  it('deve enviar código de recuperação com sucesso', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { message: 'Código enviado' } });

    const { getByPlaceholderText, getByText } = render(<RecuperarSenha1 />);

    const emailInput = getByPlaceholderText('Entre com seu email');
    const enviarButton = getByText('Próximo');

    fireEvent.changeText(emailInput, 'test@test.com');
    fireEvent.press(enviarButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/forgot-password/paciente', {
        email: 'test@test.com',
        token: null,
      });
    });
  });

  it('deve validar formato de email', async () => {
    const { getByPlaceholderText, getByText } = render(<RecuperarSenha1 />);

    const emailInput = getByPlaceholderText('Entre com seu email');
    const enviarButton = getByText('Próximo');

    fireEvent.changeText(emailInput, 'emailinvalido');
    fireEvent.press(enviarButton);

    await waitFor(() => {
      expect(getByText('Digite um email válido!')).toBeTruthy();
    });

    expect(api.post).not.toHaveBeenCalled();
  });
});

