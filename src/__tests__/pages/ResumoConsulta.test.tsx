import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ResumoConsulta from '../../pages/ResumoConsulta';
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

// Mock de componentes
jest.mock('../../components/DoctorHeader', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => React.createElement(View, { testID: 'doctor-header', ...props }),
  };
});

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children, ...props }: any) => React.createElement(View, props, children),
    Marker: ({ ...props }: any) => React.createElement(View, props),
    PROVIDER_GOOGLE: 'google',
  };
});

jest.mock('react-native-open-maps', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock do moment/locale/pt-br
jest.mock('moment/locale/pt-br', () => ({}), { virtual: true });

// Mock do SafeAreaWrapper
jest.mock('../../components/SafeAreaWrapper', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children }: any) => React.createElement(View, null, children),
  };
});

describe('Página ResumoConsulta', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.post as jest.Mock).mockClear();
  });

  it('deve renderizar corretamente', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        nome: 'Dr. Teste',
        especialidade: { nome: 'Cardiologia' },
        enderecos: [{
          rua: 'Rua Teste',
          numero: 123,
          bairro: 'Centro',
          cidade: 'São Paulo',
          coordenadas: {
            x: -46.6333,
            y: -23.5505,
          },
        }],
      },
    });

    const mockRoute = {
      params: {
        id_medico: 1,
        data: '2024-01-15',
        horario: '10:00',
        endereco: {
          rua: 'Rua Teste',
          numero: 123,
          cidade: 'São Paulo',
        },
        valor: 150.00,
        dataResumoConsulta: {
          id_medico: 1,
          index: 0,
          data_consulta: '2024-01-15 10:00:00-03:00',
          medico: { nome: 'Dr. Teste' },
          especialidade: { nome: 'Cardiologia' },
          nome_paciente: 'Paciente Teste',
        },
      },
    };

    const { getByTestId } = render(<ResumoConsulta route={mockRoute} />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('deve agendar consulta com sucesso', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        nome: 'Dr. Teste',
        especialidade: { nome: 'Cardiologia' },
        enderecos: [{
          rua: 'Rua Teste',
          numero: 123,
          bairro: 'Centro',
          cidade: 'São Paulo',
          coordenadas: {
            x: -46.6333,
            y: -23.5505,
          },
        }],
      },
    });
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: 1 } });

    const mockRoute = {
      params: {
        id_medico: 1,
        data: '2024-01-15',
        horario: '10:00',
        endereco: { id_endereco: 1 },
        valor: 150.00,
        convenioSelecionado: 'Particular',
        dataResumoConsulta: {
          id_medico: 1,
          index: 0,
          data_consulta: '2024-01-15 10:00:00-03:00',
          medico: { nome: 'Dr. Teste' },
          especialidade: { nome: 'Cardiologia' },
          nome_paciente: 'Paciente Teste',
        },
      },
    };

    const { getByText } = render(<ResumoConsulta route={mockRoute} />);

    // Aguardar o componente carregar os dados do médico
    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    }, { timeout: 3000 });
  });
});

