import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CadastroEmail from '../../pages/CadastroEmail';
import api from '../../services/api';
import { useProfile } from '../../contexts/profile';

// Mock do useProfile
jest.mock('../../contexts/profile');
const mockSetProfile = jest.fn();

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

describe('Página CadastroEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useProfile as jest.Mock).mockReturnValue({
      profile: { email: '' },
      setProfile: mockSetProfile,
    });
    (api.put as jest.Mock).mockClear();
  });

  it('deve renderizar corretamente', () => {
    const { getByText, getByPlaceholderText } = render(<CadastroEmail route={{}} />);

    expect(getByText('Qual é seu email?')).toBeTruthy();
    expect(getByPlaceholderText('Digite seu email')).toBeTruthy();
    expect(getByText('Salvar e Fechar')).toBeTruthy();
  });

  it('deve permitir digitar email', () => {
    const { getByPlaceholderText } = render(<CadastroEmail route={{}} />);

    const emailInput = getByPlaceholderText('Digite seu email');
    fireEvent.changeText(emailInput, 'test@test.com');

    expect(emailInput.props.value).toBe('test@test.com');
  });

  it('deve validar email vazio', async () => {
    const { getByPlaceholderText, getByText } = render(<CadastroEmail route={{}} />);

    const emailInput = getByPlaceholderText('Digite seu email');
    const salvarButton = getByText('Salvar e Fechar');

    fireEvent.changeText(emailInput, '');
    fireEvent.press(salvarButton);

    await waitFor(() => {
      expect(getByText('Campo requerido!')).toBeTruthy();
    });

    expect(api.put).not.toHaveBeenCalled();
  });

  it('deve validar formato de email', async () => {
    const { getByPlaceholderText, getByText } = render(<CadastroEmail route={{}} />);

    const emailInput = getByPlaceholderText('Digite seu email');
    const salvarButton = getByText('Salvar e Fechar');

    fireEvent.changeText(emailInput, 'emailinvalido');
    fireEvent.press(salvarButton);

    await waitFor(() => {
      expect(getByText('Digite um email válido!')).toBeTruthy();
    });

    expect(api.put).not.toHaveBeenCalled();
  });

  it('deve salvar email com sucesso', async () => {
    (api.put as jest.Mock).mockResolvedValueOnce({ data: {} });

    const { getByPlaceholderText, getByText } = render(<CadastroEmail route={{}} />);

    const emailInput = getByPlaceholderText('Digite seu email');
    const salvarButton = getByText('Salvar e Fechar');

    fireEvent.changeText(emailInput, 'test@test.com');
    fireEvent.press(salvarButton);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/pacientes/profile', { email: 'test@test.com' });
    });

    await waitFor(() => {
      expect(mockSetProfile).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('Perfil');
    });
  });
});

