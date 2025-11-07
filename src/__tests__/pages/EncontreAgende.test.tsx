import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import api from '../../services/api';

// Mock dos componentes antes de importar a página
jest.mock('../../components/EncontreAgende/Especialidades', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => React.createElement(View, { testID: 'card-especialidades', ...props }),
  };
});

jest.mock('../../components/Localidade/HeaderLocation', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: 'header-location' }),
  };
});

jest.mock('../../components/Search/SearchDoctor', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: 'search-doctor' }),
  };
});

jest.mock('../../components/Search/CardFiltros', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: 'card-filtros' }),
  };
});

jest.mock('../../components/Search/ModalFiltro', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: 'modal-filtro' }),
  };
});

jest.mock('../../components/Search/ModalOrdem', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: 'modal-ordem' }),
  };
});

jest.mock('../../components/icons/ArrowLeft', () => {
  const React = require('react');
  const { View, TouchableOpacity } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => React.createElement(TouchableOpacity, { testID: 'arrow-left', ...props }),
  };
});

// Mock do preventTooManyRequests
jest.mock('../../utils/preventTooManyRequests.js', () => ({
  request: jest.fn((query) => {
    const api = require('../../services/api').default;
    return api.get(query);
  }),
}));

// Mock do @rneui/themed SearchBar
jest.mock('@rneui/themed', () => {
  const React = require('react');
  const { View, TextInput } = require('react-native');
  return {
    __esModule: true,
    SearchBar: (props: any) => React.createElement(TextInput, { ...props, testID: 'search-bar' }),
  };
});

// Mock dos contextos ANTES de importar a página
jest.mock('../../contexts/profile', () => ({
  useProfile: () => ({
    profile: { 
      localidade: { 
        cidade: 'São Paulo',
        lat: -23.5505,
        long: -46.6333,
      } 
    },
    setProfile: jest.fn(),
  }),
}));

jest.mock('../../contexts/auth', () => ({
  useAuth: () => ({
    user: { id: 1 },
    signed: true,
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
}));

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
    useRoute: () => ({
      params: {
        localidade: 'São Paulo',
        especialidades: ['Cardiologia'],
      },
    }),
  };
});

// Importar a página DEPOIS dos mocks
import EncontreAgende from '../../pages/EncontreAgende';

// Mock de componentes adicionais
jest.mock('../../components/NavBar', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: () => React.createElement(View, { testID: 'navBar' }),
  };
});

jest.mock('../../components/SafeAreaWrapper', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children }: any) => React.createElement(View, null, children),
  };
});

describe('Página EncontreAgende', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.get as jest.Mock).mockClear();
    (api.post as jest.Mock).mockClear();
  });

  it('deve renderizar corretamente', () => {
    const { getByTestId } = render(
      <EncontreAgende route={{ params: { localidade: 'São Paulo', especialidades: ['Cardiologia'] } }} />
    );

    expect(getByTestId('header-location')).toBeTruthy();
  });

  it('deve buscar médicos quando search não está vazio', async () => {
    const mockMedicos = [{ id: 1, nome: 'Dr. João' }];

    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockMedicos });

    const { getByTestId } = render(
      <EncontreAgende route={{ params: { localidade: 'São Paulo', especialidades: ['Cardiologia'], searchBySpec: true, spec: 'Cardiologia' } }} />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    }, { timeout: 3000 });
  });
});

