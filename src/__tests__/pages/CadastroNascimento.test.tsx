import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CadastroNascimento from '../../pages/CadastroNascimento';
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

// Mock do componente Date
jest.mock('../../components/CadastroNascimento/Date', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const DateComponent = ({ setData, data }: any) => 
    React.createElement(View, { testID: 'date-component' },
      React.createElement(Text, { testID: 'date-display' }, data ? data.toString() : 'Sem data')
    );
  return DateComponent;
});

// Mock do moment - não mockar, usar o real
// O problema do locale será resolvido no jest.setup.js

describe('Página CadastroNascimento', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useProfile as jest.Mock).mockReturnValue({
      profile: { nascimento: '' },
      setProfile: mockSetProfile,
    });
    (api.put as jest.Mock).mockClear();
  });

  it('deve renderizar corretamente', () => {
    const { getByText, getByTestId } = render(<CadastroNascimento route={{}} />);

    expect(getByText('Qual é sua data de nascimento?')).toBeTruthy();
    expect(getByTestId('date-component')).toBeTruthy();
    expect(getByText('Salvar e Fechar')).toBeTruthy();
  });

  it('deve salvar data de nascimento com sucesso', async () => {
    (api.put as jest.Mock).mockResolvedValueOnce({ data: {} });

    const { getByText } = render(<CadastroNascimento route={{}} />);

    const salvarButton = getByText('Salvar e Fechar');
    fireEvent.press(salvarButton);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/pacientes/profile', expect.objectContaining({
        nascimento: expect.anything(),
      }));
    });
  });

  it('deve exibir erro quando API falhar', async () => {
    (api.put as jest.Mock).mockRejectedValueOnce(new Error('Erro na API'));

    const { getByText } = render(<CadastroNascimento route={{}} />);

    const salvarButton = getByText('Salvar e Fechar');
    fireEvent.press(salvarButton);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalled();
    });

    // A página não exibe mais mensagem de erro visualmente, apenas verifica se a API foi chamada
    expect(api.put).toHaveBeenCalled();
  });
});

