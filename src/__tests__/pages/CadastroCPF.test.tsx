import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CadastroCPF from '../../pages/CadastroCPF';
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

describe('Página CadastroCPF', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useProfile as jest.Mock).mockReturnValue({
      profile: { cpf: '' },
      setProfile: mockSetProfile,
    });
    (api.put as jest.Mock).mockClear();
  });

  it('deve renderizar corretamente', () => {
    const { getByText, getByPlaceholderText } = render(<CadastroCPF route={{}} />);

    expect(getByText(/CPF/i)).toBeTruthy();
    expect(getByPlaceholderText(/CPF/i)).toBeTruthy();
    expect(getByText('Salvar e Fechar')).toBeTruthy();
  });

  it('deve permitir digitar CPF', () => {
    const { getByPlaceholderText } = render(<CadastroCPF route={{}} />);

    const cpfInput = getByPlaceholderText(/CPF/i);
    fireEvent.changeText(cpfInput, '12345678900');

    expect(cpfInput.props.value).toBe('12345678900');
  });

  it('deve validar CPF vazio', async () => {
    const { getByPlaceholderText, getByText } = render(<CadastroCPF route={{}} />);

    const cpfInput = getByPlaceholderText(/CPF/i);
    const salvarButton = getByText('Salvar e Fechar');

    fireEvent.changeText(cpfInput, '');
    fireEvent.press(salvarButton);

    await waitFor(() => {
      expect(getByText('Campo requerido!')).toBeTruthy();
    });

    expect(api.put).not.toHaveBeenCalled();
  });

  it('deve salvar CPF com sucesso', async () => {
    (api.put as jest.Mock).mockResolvedValueOnce({ data: {} });

    const { getByPlaceholderText, getByText } = render(<CadastroCPF route={{}} />);

    const cpfInput = getByPlaceholderText(/CPF/i);
    const salvarButton = getByText('Salvar e Fechar');

    fireEvent.changeText(cpfInput, '12345678900');
    fireEvent.press(salvarButton);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/pacientes/profile', {
        cpf: '12345678900',
      });
    });

    await waitFor(() => {
      expect(mockSetProfile).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('Perfil');
    });
  });
});

