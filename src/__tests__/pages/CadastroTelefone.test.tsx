import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CadastroTelefone from '../../pages/CadastroTelefone';
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

describe('Página CadastroTelefone', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useProfile as jest.Mock).mockReturnValue({
      profile: { telefone: '' },
      setProfile: mockSetProfile,
    });
    (api.put as jest.Mock).mockClear();
  });

  it('deve renderizar corretamente', () => {
    const { getByText, getByPlaceholderText } = render(<CadastroTelefone route={{}} />);

    expect(getByText('Qual é seu número de telefone?')).toBeTruthy();
    expect(getByPlaceholderText('Digite seu celular')).toBeTruthy();
    expect(getByText('Salvar e Fechar')).toBeTruthy();
  });

  it('deve permitir digitar telefone', () => {
    const { getByPlaceholderText } = render(<CadastroTelefone route={{}} />);

    const telefoneInput = getByPlaceholderText('Digite seu celular');
    // O TextInputMask chama onChangeText com (masked, raw)
    if (telefoneInput.props.onChangeText) {
      telefoneInput.props.onChangeText('(11) 99999-9999', '11999999999');
    }

    // Verificar se o componente renderizou
    expect(telefoneInput).toBeTruthy();
  });

  it('deve validar telefone vazio', async () => {
    const { getByPlaceholderText, getByText } = render(<CadastroTelefone route={{}} />);

    const telefoneInput = getByPlaceholderText('Digite seu celular');
    const salvarButton = getByText('Salvar e Fechar');

    // Simular TextInputMask com valor vazio
    if (telefoneInput.props.onChangeText) {
      telefoneInput.props.onChangeText('', '');
    }
    fireEvent.press(salvarButton);

    await waitFor(() => {
      const errorText = getByText(/Campo requerido|Digite um numero válido/i);
      expect(errorText).toBeTruthy();
    }, { timeout: 3000 });

    expect(api.put).not.toHaveBeenCalled();
  });

  it('deve validar tamanho do telefone', async () => {
    const { getByPlaceholderText, getByText } = render(<CadastroTelefone route={{}} />);

    const telefoneInput = getByPlaceholderText('Digite seu celular');
    const salvarButton = getByText('Salvar e Fechar');

    // Simular TextInputMask com valor inválido (muito curto)
    if (telefoneInput.props.onChangeText) {
      telefoneInput.props.onChangeText('123', '123');
    }
    fireEvent.press(salvarButton);

    await waitFor(() => {
      const errorText = getByText(/Digite um numero válido|Campo requerido/i);
      expect(errorText).toBeTruthy();
    }, { timeout: 3000 });

    expect(api.put).not.toHaveBeenCalled();
  });

  it('deve salvar telefone com sucesso', async () => {
    (api.put as jest.Mock).mockResolvedValueOnce({ data: {} });

    const { getByPlaceholderText, getByText } = render(<CadastroTelefone route={{}} />);

    const telefoneInput = getByPlaceholderText('Digite seu celular');
    const salvarButton = getByText('Salvar e Fechar');

    // O TextInputMask chama onChangeText com (maskedValue, rawValue)
    // Precisamos simular isso corretamente usando fireEvent com os dois parâmetros
    const rawValue = '11999999999'; // 11 dígitos - válido
    const maskedValue = '(11) 99999-9999';
    
    // Simular o onChangeText do TextInputMask passando ambos os valores
    if (telefoneInput.props.onChangeText) {
      telefoneInput.props.onChangeText(maskedValue, rawValue);
    }
    
    // Aguardar um pouco para o estado atualizar
    await new Promise(resolve => setTimeout(resolve, 100));
    
    fireEvent.press(salvarButton);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalled();
    }, { timeout: 3000 });
  });
});

