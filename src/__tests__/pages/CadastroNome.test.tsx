import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CadastroNome from '../../pages/CadastroNome';
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

describe('Página CadastroNome', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useProfile as jest.Mock).mockReturnValue({
      profile: { nome: '' },
      setProfile: mockSetProfile,
    });
    (api.put as jest.Mock).mockClear();
  });

  it('deve renderizar corretamente', () => {
    const { getByText, getByPlaceholderText } = render(<CadastroNome route={{}} />);

    expect(getByText('Digite seu nome')).toBeTruthy();
    expect(getByPlaceholderText('Entre com nome completo')).toBeTruthy();
    expect(getByText('Salvar e Fechar')).toBeTruthy();
  });

  it('deve permitir digitar nome', () => {
    const { getByPlaceholderText } = render(<CadastroNome route={{}} />);

    const nomeInput = getByPlaceholderText('Entre com nome completo');
    fireEvent.changeText(nomeInput, 'João Silva');

    expect(nomeInput.props.value).toBe('João Silva');
  });

  it('deve validar nome vazio', async () => {
    const { getByPlaceholderText, getByText } = render(<CadastroNome route={{}} />);

    const nomeInput = getByPlaceholderText('Entre com nome completo');
    const salvarButton = getByText('Salvar e Fechar');

    fireEvent.changeText(nomeInput, '');
    fireEvent.press(salvarButton);

    await waitFor(() => {
      expect(getByText('Campo requerido!')).toBeTruthy();
    });

    expect(api.put).not.toHaveBeenCalled();
  });

  it('deve validar nome com números', async () => {
    const { getByPlaceholderText, getByText } = render(<CadastroNome route={{}} />);

    const nomeInput = getByPlaceholderText('Entre com nome completo');
    const salvarButton = getByText('Salvar e Fechar');

    fireEvent.changeText(nomeInput, 'João123');
    fireEvent.press(salvarButton);

    await waitFor(() => {
      expect(getByText('Digite apenas letras, maiúsculas ou minúsculas!')).toBeTruthy();
    });

    expect(api.put).not.toHaveBeenCalled();
  });

  it('deve salvar nome com sucesso', async () => {
    (api.put as jest.Mock).mockResolvedValueOnce({ data: {} });

    const { getByPlaceholderText, getByText } = render(<CadastroNome route={{}} />);

    const nomeInput = getByPlaceholderText('Entre com nome completo');
    const salvarButton = getByText('Salvar e Fechar');

    fireEvent.changeText(nomeInput, 'João Silva');
    fireEvent.press(salvarButton);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/pacientes/profile', { nome: 'João Silva' });
    });

    await waitFor(() => {
      expect(mockSetProfile).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('Perfil');
    });
  });

  it('deve exibir erro quando API falhar', async () => {
    (api.put as jest.Mock).mockRejectedValueOnce(new Error('Erro na API'));

    const { getByPlaceholderText, getByText, findByText } = render(<CadastroNome route={{}} />);

    const nomeInput = getByPlaceholderText('Entre com nome completo');
    const salvarButton = getByText('Salvar e Fechar');

    fireEvent.changeText(nomeInput, 'João Silva');
    fireEvent.press(salvarButton);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalled();
    });

    // Aguardar a mensagem de erro aparecer
    await waitFor(() => {
      expect(getByText('Erro ao atualizar nome!')).toBeTruthy();
    }, { timeout: 3000 });
  });

  it('deve mostrar loading durante salvamento', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (api.put as jest.Mock).mockReturnValueOnce(promise);

    const { getByPlaceholderText, getByText, queryByText } = render(<CadastroNome route={{}} />);

    const nomeInput = getByPlaceholderText('Entre com nome completo');
    const salvarButton = getByText('Salvar e Fechar');

    fireEvent.changeText(nomeInput, 'João Silva');
    fireEvent.press(salvarButton);

    await waitFor(() => {
      expect(getByText('Salvando')).toBeTruthy();
    });

    resolvePromise!({ data: {} });

    await waitFor(() => {
      expect(queryByText('Salvando')).toBeNull();
    });
  });
});

