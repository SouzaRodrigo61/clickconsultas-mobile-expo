import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CadastroCidade from '../../pages/CadastroCidade';
import api from '../../services/api';
import { useProfile } from '../../contexts/profile';

// Mock do useProfile
jest.mock('../../contexts/profile');
const mockSetProfile = jest.fn();
const mockClearProfileCache = jest.fn();

// Mock do useNavigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
      replace: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

// Mock do componente City
jest.mock('../../components/CadastroCidade/City', () => {
  const React = require('react');
  const { View, TouchableOpacity, Text } = require('react-native');
  const City = ({ setCidade, initialUf, initialCity }: any) => 
    React.createElement(View, { testID: 'city-component' },
      React.createElement(TouchableOpacity, { onPress: () => setCidade(['SP', 'São Paulo']) },
        React.createElement(Text, null, 'Selecionar São Paulo')
      )
    );
  return City;
});

describe('Página CadastroCidade', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useProfile as jest.Mock).mockReturnValue({
      profile: { cidade: '', localidade: null },
      setProfile: mockSetProfile,
      clearProfileCache: mockClearProfileCache,
    });
    (api.put as jest.Mock).mockClear();
  });

  it('deve renderizar corretamente', () => {
    const { getByText, getByTestId } = render(<CadastroCidade route={{}} />);

    expect(getByText('Em que cidade você mora?')).toBeTruthy();
    expect(getByTestId('city-component')).toBeTruthy();
    expect(getByText('Salvar e Fechar')).toBeTruthy();
  });

  it('deve validar cidade vazia', async () => {
    const { getByText } = render(<CadastroCidade route={{}} />);

    const salvarButton = getByText('Salvar e Fechar');
    fireEvent.press(salvarButton);

    await waitFor(() => {
      expect(getByText('Por favor, selecione um estado e uma cidade')).toBeTruthy();
    });

    expect(api.put).not.toHaveBeenCalled();
  });

  it('deve salvar cidade com sucesso', async () => {
    (api.put as jest.Mock).mockResolvedValueOnce({ data: {} });

    const { getByText, getByTestId } = render(<CadastroCidade route={{}} />);

    const cityComponent = getByTestId('city-component');
    const selectButton = getByText('Selecionar São Paulo');
    fireEvent.press(selectButton);

    const salvarButton = getByText('Salvar e Fechar');
    fireEvent.press(salvarButton);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/pacientes/profile', {
        cidade: 'São Paulo',
      });
    });

    await waitFor(() => {
      expect(mockSetProfile).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('Perfil');
    });
  });
});

