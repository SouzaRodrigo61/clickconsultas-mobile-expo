import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import api from "../services/api.js";

import CityComponent from "../components/CadastroCidade/City";
import SafeAreaWrapper from "../components/SafeAreaWrapper";

import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";
import StatusBar from "../components/StatusBar";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
import { useProfile } from "../contexts/profile";

export default function CadastroCidade({ route }) {
  const navigation = useNavigation();
  const { profile, setProfile, clearProfileCache } = useProfile();
  const [city, setCity] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Valores iniciais do perfil
  const initialUf = profile?.localidade?.estado || "";
  const initialCity = profile?.localidade?.cidade || "";

  console.log('CadastroCidade: Valores iniciais do perfil:', {
    initialUf,
    initialCity,
    profile: profile?.localidade,
    cidadeBackend: profile?.cidade
  });

  // Inicializar city quando perfil carregar
  useEffect(() => {
    if (profile?.localidade?.estado && profile?.localidade?.cidade) {
      console.log('CadastroCidade: Inicializando city com perfil:', [profile.localidade.estado, profile.localidade.cidade]);
      setCity([profile.localidade.estado, profile.localidade.cidade]);
    }
  }, [profile?.localidade]);

  function handleNavigateToPerfil() {
    navigation.navigate("Perfil");
  }

  // Função temporária para testar correção
  async function handleFixBrasilia() {
    console.log('CadastroCidade: Forçando correção de Brasília...');
    await clearProfileCache();
    // Recarregar a página
    setTimeout(() => {
      navigation.replace("CadastroCidade");
    }, 1000);
  }

  async function handleSubmit() {
    console.log('CadastroCidade: Submetendo cidade:', city);
    
    if (!city || !city[0] || !city[1]) {
      setErrorMessage("Por favor, selecione um estado e uma cidade");
      return;
    }
    
    if (profile?.cidade === city[1]) {
      console.log('CadastroCidade: Cidade já é a mesma, navegando...');
      handleNavigateToPerfil();
      return;
    }
    
    setLoading(true);
    setErrorMessage("");
    
    try {
      console.log('CadastroCidade: Salvando cidade no backend:', city[1]);
      await api.put("/pacientes/profile", { cidade: city[1] });
      
      console.log('CadastroCidade: Atualizando profile com localidade:', {
        cidade: city[1],
        estado: city[0]
      });
      
      setProfile((state: any) => ({ 
        ...state, 
        cidade: city[1],
        localidade: {
          ...state.localidade,
          cidade: city[1],
          estado: city[0],
          lat: '',
          long: ''
        }
      }));
      
      console.log('CadastroCidade: Navegando para perfil...');
      handleNavigateToPerfil();
    } catch (error) {
      console.error('CadastroCidade: Erro ao salvar cidade:', error);
      setErrorMessage("Erro ao salvar cidade. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <StatusBar color="#2795BF" barStyle="light-content" />

      <View style={styles.header}>
        <RectButton
          style={styles.buttonContainerIcon}
          onPress={handleNavigateToPerfil}
        >
          <AntDesign name="close" size={19.5} color={Colors.white} />
        </RectButton>
        <View style={styles.gridHeader}>
          {loading ? (
            <RectButton style={styles.buttonLoading}>
              <Text style={styles.headerText}>Salvando</Text>
              <ActivityIndicator color="white" />
            </RectButton>
          ) : (
            <RectButton style={styles.buttonContainer} onPress={handleSubmit}>
              <Text style={styles.headerText}>Salvar e Fechar</Text>
            </RectButton>
          )}
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text}>Em que cidade você mora?</Text>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>

      <CityComponent 
        setCidade={setCity} 
        initialUf={initialUf}
        initialCity={initialCity}
      />
      
      {/* Botão temporário para testar correção */}
      {profile?.localidade?.cidade?.toLowerCase().includes('brasília') && 
       profile?.localidade?.estado === 'SP' && (
        <RectButton style={styles.fixButton} onPress={handleFixBrasilia}>
          <Text style={styles.fixButtonText}>🔧 Corrigir Brasília para DF</Text>
        </RectButton>
      )}
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    zIndex: 1,

    height: 60,
    width: screenWidth,

    backgroundColor: "#2795BF",

    flexDirection: "row",
    justifyContent: "space-between",

    paddingLeft: 20,
    paddingRight: 20,
  },

  gridHeader: {
    flexDirection: "row",
  },

  buttonContainerIcon: {
    justifyContent: "center",
    padding: 4,
  },

  buttonContainer: {
    justifyContent: "center",
    marginLeft: 16,
  },

  buttonLoading: {
    justifyContent: "space-between",
    width: 110,
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 16,
  },

  container: {
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.blue,
  },

  textContainer: {
    width: screenWidth - 60,
    maxWidth: 600,
    height: 2 * (screenHeight / 3),
    marginLeft: 20,
    marginRight: 20,
    position: "absolute",
    top: screenHeight / 3,
  },

  text: {
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    fontSize: 24,
    lineHeight: 31,
    color: Colors.white,
    textAlign: "left",
  },

  headerText: {
    fontFamily: Fonts.bold,
    fontStyle: "normal",
    fontSize: 14,
    lineHeight: 17,
    color: Colors.white,
    textAlign: "right",
    textTransform: "uppercase",
  },

  errorText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: "#FF6B6B",
    textAlign: "center",
    marginTop: 10,
  },
  fixButton: {
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 8,
    margin: 20,
    alignItems: "center",
  },
  fixButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
});
