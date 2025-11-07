import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import api from '../../services/api';
import { useProfile } from '../../contexts/profile';

// Mock do useProfile ANTES de importar o componente
jest.mock('../../contexts/profile');
const mockSetProfile = jest.fn();

// Mock do useNavigation ANTES de importar o componente
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

// Mock do componente Gender ANTES de importar
jest.mock('../../components/CadastroGenero/Gender', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ setGenero, gender }: any) => 
      React.createElement(View, { testID: 'gender-component' }),
  };
});

// Importar o componente DEPOIS dos mocks
import CadastroGenero from '../../pages/CadastroGenero';

describe('Página CadastroGenero', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useProfile as jest.Mock).mockReturnValue({
      profile: { genero: '' },
      setProfile: mockSetProfile,
    });
    (api.put as jest.Mock).mockClear();
  });

  it('deve renderizar corretamente', () => {
    const { getByText, getByTestId } = render(<CadastroGenero route={{}} />);

    expect(getByText('Qual é o seu gênero?')).toBeTruthy();
    expect(getByTestId('gender-component')).toBeTruthy();
    expect(getByText('Salvar e Fechar')).toBeTruthy();
  });

  it('deve salvar gênero com sucesso', async () => {
    (api.put as jest.Mock).mockResolvedValueOnce({ data: {} });

    const { getByText } = render(<CadastroGenero route={{}} />);

    const salvarButton = getByText('Salvar e Fechar');
    fireEvent.press(salvarButton);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/pacientes/profile', {
        genero: '',
      });
    });
  });

  it('deve exibir erro quando API falhar', async () => {
    (api.put as jest.Mock).mockRejectedValueOnce(new Error('Erro na API'));

    const { getByText } = render(<CadastroGenero route={{}} />);

    const salvarButton = getByText('Salvar e Fechar');
    fireEvent.press(salvarButton);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalled();
    });

    // Aguardar a mensagem de erro aparecer
    await waitFor(() => {
      expect(getByText('Erro ao atualizar gênero!')).toBeTruthy();
    }, { timeout: 3000 });
  });
});

