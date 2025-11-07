import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Compromissos from '../../pages/Compromissos';
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
      addListener: jest.fn((event, callback) => {
        // Simular o listener chamando o callback imediatamente
        if (event === 'focus' && callback) {
          // Chamar o callback de forma assíncrona
          Promise.resolve().then(() => callback());
        }
        return jest.fn(); // unsubscribe function
      }),
    }),
  };
});

// Mock de componentes
jest.mock('../../components/SafeAreaWrapper', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children }: any) => React.createElement(View, null, children),
  };
});

jest.mock('../../components/NavBar', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: 'navBar' }),
  };
});

jest.mock('../../components/StatusBar', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: 'statusBar' }),
  };
});

jest.mock('../../components/Compromissos/NenhumCompromisso', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: 'nenhum-compromisso' }),
  };
});

jest.mock('../../components/Compromissos/ProximosCompromissos', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: 'proximos-compromissos' }),
  };
});

jest.mock('../../components/Compromissos/CompromissosConcluidos', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: 'compromissos-concluidos' }),
  };
});

describe('Página Compromissos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.get as jest.Mock).mockClear();
  });

  it('deve carregar compromissos ao montar', async () => {
    const mockCompromissos = [
      {
        id: 1,
        data: '2024-01-15',
        horario: '10:00',
        medico: { nome: 'Dr. João' },
        status: 'Agendada',
      },
    ];

    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockCompromissos });

    const mockNavigation = {
      addListener: jest.fn((event, callback) => {
        // Retornar unsubscribe function sem chamar o callback
        return jest.fn();
      }),
    };

    render(<Compromissos navigation={mockNavigation} />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/pacientes/appointments');
    });
  });

  it('deve carregar compromissos vazios quando não houver', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    const mockNavigation = {
      addListener: jest.fn((event, callback) => {
        if (event === 'focus' && callback) {
          // Não chamar o callback imediatamente, apenas retornar unsubscribe
        }
        return jest.fn(); // unsubscribe function
      }),
    };

    render(<Compromissos navigation={mockNavigation} />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/pacientes/appointments');
    });
  });
});

