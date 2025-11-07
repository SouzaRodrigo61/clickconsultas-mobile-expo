import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import SelecioneData from '../../pages/SelecioneData';
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
      addListener: jest.fn(() => jest.fn()),
    }),
    useRoute: () => ({
      params: {
        id_medico: 1,
        valor: 150.00,
      },
    }),
  };
});

// Mock de componentes
jest.mock('../../components/SelecioneData/CardHorariosDisponiveis', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => React.createElement(View, { testID: 'horarios' });
});

jest.mock('../../components/SelecioneData/CardAlternarEndereco', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => React.createElement(View, { testID: 'endereco' });
});

jest.mock('../../components/SelecioneData/ModalSelecionaEndereco', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => React.createElement(View, { testID: 'modal-endereco' });
});

describe('Página SelecioneData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.get as jest.Mock).mockClear();
    (api.post as jest.Mock).mockClear();
  });

  it('deve carregar dados do médico ao montar', async () => {
    const mockMedico = {
      id: 1,
      nome_completo: 'Dr. João',
      valor: 150.00,
      especialidades: [],
      enderecos: [],
    };

    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockMedico });

    render(<SelecioneData route={{ params: { id_medico: 1 } }} />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
  });
});

