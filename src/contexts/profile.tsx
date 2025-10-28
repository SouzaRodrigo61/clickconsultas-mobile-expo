import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth';

export interface Profile {
  nome: string;
  telefone: string;
  email: string;
  cpf: string;
  genero: string;
  nascimento: string;
  cidade: string;
  localidade?: {
    cidade: string;
    estado: string;
    lat: string;
    long: string;
  } | null;
}

interface ProfileContextData {
  profile: Profile | null;
  setProfile: (profile: Profile | null | ((prev: Profile | null) => Profile | null)) => void;
  loading: boolean;
  clearProfileCache: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextData>(
  {} as ProfileContextData
);

const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('ProfileProvider: ===== COMPONENTE INICIALIZADO =====');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { signed } = useAuth();
  console.log('ProfileProvider: Estado inicial - signed:', signed, 'profile:', !!profile);

  // Função para limpar cache do perfil
  const clearProfileCache = async () => {
    console.log('Profile: Limpando cache do perfil...');
    await AsyncStorage.removeItem("@ClickConsultas:profile");
    await AsyncStorage.removeItem("@ClickConsultas:localidade");
    setProfile(null);
    setLoading(true);
  };

  // Monitorar mudanças no status de autenticação
  useEffect(() => {
    console.log('Profile: Monitorando mudanças na autenticação - signed:', signed, 'profile:', !!profile, 'localidade:', !!profile?.localidade);
    
    if (signed && (!profile || !profile.localidade)) {
      console.log('Profile: Usuário autenticado sem perfil completo, carregando do backend...');
      loadProfileFromBackend();
    }
  }, [signed, profile]);

  // Função para carregar perfil do backend
  const loadProfileFromBackend = async () => {
    console.log('Profile: ===== INICIANDO CARREGAMENTO DO BACKEND =====');
    console.log('Profile: Carregando perfil do backend...');
    setLoading(true);
    
    try {
      const { default: api } = await import('../services/api');
      const { data: profileData } = await api.get('/pacientes/profile');
      console.log('Profile: Dados do backend obtidos:', profileData);
      
      // Criar localidade com geocoding
      let localidade = null;
      if (profileData.cidade) {
        try {
          console.log('Profile: Buscando UF para cidade:', profileData.cidade);
          const { data: geoData } = await api.post('/city-uf', {
            search: `${profileData.cidade}, brazil`
          });
          
          localidade = {
            cidade: profileData.cidade,
            estado: geoData.estado || 'SP',
            lat: '',
            long: ''
          };
          
          console.log('Profile: Localidade obtida via geocoding:', localidade);
        } catch (geoError) {
          console.log('Profile: Erro ao obter UF via geocoding, usando mapeamento local:', geoError);
          
          // Mapeamento local para cidades conhecidas
          let estadoPadrao = 'SP';
          const cidadeLower = profileData.cidade.toLowerCase();
          
          if (cidadeLower.includes('brasília') || cidadeLower.includes('brasilia')) {
            estadoPadrao = 'DF';
          } else if (cidadeLower.includes('rio de janeiro') || cidadeLower.includes('niterói')) {
            estadoPadrao = 'RJ';
          } else if (cidadeLower.includes('são paulo') || cidadeLower.includes('sao paulo')) {
            estadoPadrao = 'SP';
          } else if (cidadeLower.includes('belo horizonte')) {
            estadoPadrao = 'MG';
          } else if (cidadeLower.includes('salvador')) {
            estadoPadrao = 'BA';
          } else if (cidadeLower.includes('fortaleza')) {
            estadoPadrao = 'CE';
          } else if (cidadeLower.includes('recife')) {
            estadoPadrao = 'PE';
          } else if (cidadeLower.includes('porto alegre')) {
            estadoPadrao = 'RS';
          } else if (cidadeLower.includes('curitiba')) {
            estadoPadrao = 'PR';
          } else if (cidadeLower.includes('goiânia') || cidadeLower.includes('goiania')) {
            estadoPadrao = 'GO';
          }
          
          localidade = {
            cidade: profileData.cidade,
            estado: estadoPadrao,
            lat: '',
            long: ''
          };
          
          console.log('Profile: Localidade criada com mapeamento local:', localidade);
        }
      }
      
      const fullProfile = { ...profileData, localidade };
      console.log('Profile: Profile completo criado:', fullProfile);
      
      setProfile(fullProfile);
      await AsyncStorage.setItem("@ClickConsultas:profile", JSON.stringify(fullProfile));
      if (localidade) {
        await AsyncStorage.setItem("@ClickConsultas:localidade", JSON.stringify(localidade));
      }
      
      console.log('Profile: ===== PERFIL CARREGADO E SALVO COM SUCESSO =====');
    } catch (error) {
      console.error('Profile: ===== ERRO AO CARREGAR DO BACKEND =====');
      console.error('Profile: Erro ao carregar do backend:', error);
      setProfile({
        nome: "",
        telefone: "",
        email: "",
        cpf: "",
        genero: "",
        nascimento: "",
        cidade: "",
        localidade: null,
      });
    } finally {
      setLoading(false);
      console.log('Profile: ===== FINALIZANDO CARREGAMENTO DO BACKEND =====');
    }
  };

  useEffect(() => {
    console.log('Profile: useEffect executado');
    
    const loadStorageData = async () => {
      try {
        console.log('Profile: Iniciando carregamento de dados...');
        
        const storagedProfile = await AsyncStorage.getItem("@ClickConsultas:profile");
        const storagedLocalidade = await AsyncStorage.getItem("@ClickConsultas:localidade");
        const storagedToken = await AsyncStorage.getItem("@ClickConsultas:token");
        
        console.log('Profile: Dados encontrados:', {
          hasProfile: !!storagedProfile,
          hasLocalidade: !!storagedLocalidade,
          hasToken: !!storagedToken
        });
        
        if (storagedProfile) {
          console.log('Profile: Carregando profile do AsyncStorage');
          const parsedProfile = JSON.parse(storagedProfile);
          if (storagedLocalidade) {
            const parsedLocalidade = JSON.parse(storagedLocalidade);
            parsedProfile.localidade = parsedLocalidade;
          }
          
          // Verificar se Brasília está com UF errada e corrigir
          if (parsedProfile.localidade && 
              parsedProfile.localidade.cidade && 
              parsedProfile.localidade.cidade.toLowerCase().includes('brasília') && 
              parsedProfile.localidade.estado === 'SP') {
            console.log('Profile: Detectado Brasília com UF errada (SP), corrigindo para DF');
            parsedProfile.localidade.estado = 'DF';
            
            // Salvar correção no AsyncStorage
            AsyncStorage.setItem("@ClickConsultas:localidade", JSON.stringify(parsedProfile.localidade));
            AsyncStorage.setItem("@ClickConsultas:profile", JSON.stringify(parsedProfile));
          }
          
          setProfile(parsedProfile);
        } else if (storagedLocalidade) {
          console.log('Profile: Carregando apenas localidade do AsyncStorage');
          const parsedLocalidade = JSON.parse(storagedLocalidade);
          
          // Verificar se Brasília está com UF errada e corrigir
          if (parsedLocalidade.cidade && 
              parsedLocalidade.cidade.toLowerCase().includes('brasília') && 
              parsedLocalidade.estado === 'SP') {
            console.log('Profile: Detectado Brasília com UF errada (SP) na localidade, corrigindo para DF');
            parsedLocalidade.estado = 'DF';
            
            // Salvar correção no AsyncStorage
            AsyncStorage.setItem("@ClickConsultas:localidade", JSON.stringify(parsedLocalidade));
          }
          
          setProfile({
            nome: "",
            telefone: "",
            email: "",
            cpf: "",
            genero: "",
            nascimento: "",
            cidade: "",
            localidade: parsedLocalidade,
          });
        } else {
          console.log('Profile: Nenhum token, criando profile vazio');
          setProfile({
            nome: "",
            telefone: "",
            email: "",
            cpf: "",
            genero: "",
            nascimento: "",
            cidade: "",
            localidade: null,
          });
        }
      } catch (error) {
        console.error("Profile: Erro geral:", error);
        setProfile({
          nome: "",
          telefone: "",
          email: "",
          cpf: "",
          genero: "",
          nascimento: "",
          cidade: "",
          localidade: null,
        });
      } finally {
        setLoading(false);
        console.log('Profile: Loading finalizado');
      }
    };

    loadStorageData();
  }, []);

  const setProfileWithStorage = async (newProfile: Profile | null | ((prev: Profile | null) => Profile | null)) => {
    try {
      let updatedProfile: Profile | null;
      
      if (typeof newProfile === 'function') {
        updatedProfile = newProfile(profile);
      } else {
        updatedProfile = newProfile;
      }
      
      console.log('Atualizando profile:', updatedProfile ? 'dados carregados' : 'profile limpo');
      setProfile(updatedProfile);
      
      if (updatedProfile) {
        await AsyncStorage.setItem("@ClickConsultas:profile", JSON.stringify(updatedProfile));
        
        // Salvar localidade separadamente também para compatibilidade
        if (updatedProfile.localidade) {
          await AsyncStorage.setItem("@ClickConsultas:localidade", JSON.stringify(updatedProfile.localidade));
        }
        console.log('Profile salvo no AsyncStorage');
      } else {
        await AsyncStorage.removeItem("@ClickConsultas:profile");
        await AsyncStorage.removeItem("@ClickConsultas:localidade");
        console.log('Profile removido do AsyncStorage');
      }
    } catch (error) {
      console.error("Erro ao salvar profile:", error);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile: setProfileWithStorage,
        loading,
        clearProfileCache,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

function useProfile(): ProfileContextData {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error('useProfile must be used within an ProfileProvider');
  }

  return context;
}

export { ProfileProvider, useProfile };