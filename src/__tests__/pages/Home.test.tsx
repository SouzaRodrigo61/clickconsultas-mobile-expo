import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import Home from '../../pages/Home';
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
      addListener: jest.fn(() => jest.fn()),
    }),
  };
});

// Mock de componentes
jest.mock('../../components/NavBar', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ setSelected }: any) => <View testID="navBar" />;
});

jest.mock('../../components/StatusBar', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => <View testID="statusBar" />;
});

jest.mock('../../components/SafeAreaWrapper', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ children }: any) => <View>{children}</View>;
});

jest.mock('../../components/EncontreAgende/Especialidades', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => <View testID="especialidades" />;
});

jest.mock('../../components/Home/SolicitacaoData', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => <View testID="solicitacaoData" />;
});

describe('Página Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useProfile as jest.Mock).mockReturnValue({
      profile: {
        localidade: {
          cidade: 'São Paulo',
          estado: 'SP',
        },
      },
      setProfile: mockSetProfile,
    });
    (api.get as jest.Mock).mockClear();
  });

  it('deve renderizar corretamente', async () => {
    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: [{ especialidade: 'Cardiologia' }] })
      .mockResolvedValueOnce({ data: [] });

    const { getByText, getByTestId } = render(<Home />);

    await waitFor(() => {
      expect(getByText(/Encontre médicos/i)).toBeTruthy();
    });

    expect(getByTestId('navBar')).toBeTruthy();
  });

  it('deve carregar especialidades ao montar', async () => {
    const mockEspecialidades = [
      { especialidade: 'Cardiologia' },
      { especialidade: 'Dermatologia' },
    ];

    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: mockEspecialidades })
      .mockResolvedValueOnce({ data: [] });

    render(<Home />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/lista-especialidades');
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/pacientes/appointments');
    });
  });

  it('deve navegar para EncontreAgende ao clicar no botão de busca', async () => {
    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: [{ especialidade: 'Cardiologia' }] })
      .mockResolvedValueOnce({ data: [] });

    const { getByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText('Buscar médicos ou especialidades')).toBeTruthy();
    });

    const buscarButton = getByText('Buscar médicos ou especialidades');
    fireEvent.press(buscarButton);

    expect(mockNavigate).toHaveBeenCalledWith('EncontreAgende', {
      localidade: 'São Paulo',
      especialidades: expect.any(Array),
    });
  });

  it('deve navegar para BuscarLocalidade1 ao clicar na localidade', async () => {
    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: [{ especialidade: 'Cardiologia' }] })
      .mockResolvedValueOnce({ data: [] });

    const { getByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText('São Paulo')).toBeTruthy();
    });

    const localidadeButton = getByText('São Paulo');
    fireEvent.press(localidadeButton);

    expect(mockNavigate).toHaveBeenCalledWith('BuscarLocalidade1');
  });

  it('deve mostrar "Localidade" quando não houver localidade selecionada', async () => {
    (useProfile as jest.Mock).mockReturnValue({
      profile: {
        localidade: null,
      },
      setProfile: mockSetProfile,
    });

    (api.get as jest.Mock)
      .mockResolvedValueOnce({ data: [{ especialidade: 'Cardiologia' }] })
      .mockResolvedValueOnce({ data: [] });

    const { getByText } = render(<Home />);

    await waitFor(() => {
      expect(getByText('Localidade')).toBeTruthy();
    });
  });
});

