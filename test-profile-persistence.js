// Teste para verificar se os dados de uf e cidade estão sendo persistidos
// Este arquivo pode ser removido após confirmar que a solução funciona

import AsyncStorage from '@react-native-async-storage/async-storage';

// Função para testar se os dados estão sendo salvos corretamente
export const testProfilePersistence = async () => {
  try {
    // Verificar se existe profile salvo
    const profile = await AsyncStorage.getItem("@ClickConsultas:profile");
    const localidade = await AsyncStorage.getItem("@ClickConsultas:localidade");
    
    console.log("=== TESTE DE PERSISTÊNCIA DO PROFILE ===");
    console.log("Profile salvo:", profile ? JSON.parse(profile) : "Nenhum");
    console.log("Localidade salva:", localidade ? JSON.parse(localidade) : "Nenhuma");
    
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      console.log("UF no profile:", parsedProfile.localidade?.estado || "Não definido");
      console.log("Cidade no profile:", parsedProfile.localidade?.cidade || "Não definida");
    }
    
    return {
      profile: profile ? JSON.parse(profile) : null,
      localidade: localidade ? JSON.parse(localidade) : null
    };
  } catch (error) {
    console.error("Erro ao testar persistência:", error);
    return null;
  }
};

// Função para simular o salvamento de uma localidade
export const simulateLocationSave = async (uf, cidade) => {
  try {
    const localidade = {
      cidade: cidade,
      estado: uf,
      lat: "-23.5505",
      long: "-46.6333"
    };
    
    const profile = {
      nome: "Usuário Teste",
      telefone: "",
      email: "",
      cpf: "",
      genero: "",
      nascimento: "",
      cidade: cidade,
      localidade: localidade
    };
    
    await AsyncStorage.setItem("@ClickConsultas:profile", JSON.stringify(profile));
    await AsyncStorage.setItem("@ClickConsultas:localidade", JSON.stringify(localidade));
    
    console.log("Localidade simulada salva:", localidade);
    return true;
  } catch (error) {
    console.error("Erro ao simular salvamento:", error);
    return false;
  }
};

