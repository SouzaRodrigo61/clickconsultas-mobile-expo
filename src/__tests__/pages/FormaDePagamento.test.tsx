import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FormaDePagamento from '../../pages/FormaDePagamento';

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
jest.mock('../../components/SafeAreaWrapper', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ children }: any) => React.createElement(View, null, children);
});

describe('Página FormaDePagamento', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar corretamente', () => {
    const { getByText } = render(
      <FormaDePagamento
        route={{
          params: {
            valor: 150.00,
            convenios: ['Unimed', 'Amil'],
          },
        }}
      />
    );

    expect(getByText('Outros')).toBeTruthy();
    expect(getByText('Convênios')).toBeTruthy();
    expect(getByText('Consulta Particular')).toBeTruthy();
  });

  it('deve navegar para SelecioneData ao selecionar Particular', () => {
    const { getByText } = render(
      <FormaDePagamento
        route={{
          params: {
            valor: 150.00,
            convenios: ['Unimed'],
            id_medico: 1,
          },
        }}
      />
    );

    const particularButton = getByText('Consulta Particular');
    fireEvent.press(particularButton);

    expect(mockNavigate).toHaveBeenCalledWith('SelecioneData', {
      valor: 150.00,
      convenios: ['Unimed'],
      id_medico: 1,
      convenioSelecionado: 'Particular',
    });
  });

  it('deve navegar para SelecioneData ao selecionar convênio', () => {
    const { getByText } = render(
      <FormaDePagamento
        route={{
          params: {
            valor: 150.00,
            convenios: ['Amil', 'Unimed'], // Ordenado alfabeticamente
            id_medico: 1,
          },
        }}
      />
    );

    // Os convênios são ordenados alfabeticamente, então Amil vem primeiro
    const amilButton = getByText('Amil');
    fireEvent.press(amilButton);

    expect(mockNavigate).toHaveBeenCalledWith('SelecioneData', {
      valor: 150.00,
      convenios: ['Amil', 'Unimed'],
      id_medico: 1,
      convenioSelecionado: 'Amil',
    });
  });
});

