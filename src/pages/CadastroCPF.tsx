import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { TextInputMask } from "react-native-masked-text";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import api from "../services/api.js";

import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";
import StatusBar from "../components/StatusBar";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
import { useProfile } from "../contexts/profile";
export default function CadastroCPF({ route }) {
  const navigation = useNavigation();
  const { profile, setProfile } = useProfile();
  const [cpf, setCPF] = useState<string>(profile?.cpf || "");
  const [loading, setLoading] = useState<boolean>(false);

  const [required, setRequired] = useState(false as Boolean);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function handleNavigateToPerfil() {
    navigation.navigate("Perfil");
  }

  async function handleSubmit() {
    if (profile?.cpf === cpf) handleNavigateToPerfil();

    setLoading(true);
    const validaCPF = (text) => {
      const test = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/.test(text);
      !test && setErrorMessage("Digite um CPF válido!");
      return test;
    };

    const naoVazia = (text) => {
      const test = text.trim() !== "";
      !test && setErrorMessage("Campo requerido!");
      return test;
    };

    let valid = [
      validaCPF(cpf), // ! Valida o CPF no formato ###.###.###-##
      naoVazia(cpf), // ! Não permite vazio
    ].every((e) => e === true);

    if (valid)
      await api
        .put("/pacientes/profile", { cpf })
        .then(() => {
          setProfile((state: any) => ({ ...state, cpf }));
          handleNavigateToPerfil();
        })
        .catch(() => setErrorMessage("Erro ao atualizar CPF!"));
    else {
      setRequired(true);
    }
    setLoading(false);
  }

  function handleCPF(text: string) {
    setRequired(false);
    setCPF(text);
  }

  return (
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
              <Text style={styles.text}>Salvando</Text>
              <ActivityIndicator color="white" />
            </RectButton>
          ) : (
            <>
              <RectButton
                style={styles.buttonContainer}
                onPress={handleNavigateToPerfil}
              >
                <Text style={styles.text}>Voltar</Text>
              </RectButton>
              <RectButton style={styles.buttonContainer} onPress={handleSubmit}>
                <Text style={styles.text}>Salvar e Fechar</Text>
              </RectButton>
            </>
          )}
        </View>
      </View>
      <View style={styles.questionContainer}>
        <Text style={styles.question}>Qual é seu CPF?</Text>
      </View>
      <TextInputMask
        type={"cpf"}
        value={cpf}
        onChangeText={handleCPF}
        placeholder="Digite seu CPF"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        style={styles.input}
      />

      {required && (
        <View style={styles.requiredContainer}>
          <AntDesign name="warning" size={12} color={Colors.white} />
          <Text style={styles.textRequired}>{errorMessage}</Text>
        </View>
      )}
    </View>
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
  text: {
    fontFamily: Fonts.bold,
    fontStyle: "normal",
    fontSize: 14,
    lineHeight: 17,
    color: Colors.white,
    textAlign: "right",
    textTransform: "uppercase",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: Colors.blue,
  },

  requiredContainer: {
    width: screenWidth - 40,
    maxWidth: 600,
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },

  textRequired: {
    fontFamily: Fonts.bold,
    fontStyle: "normal",
    fontSize: 16,
    lineHeight: 19,
    color: Colors.white,
    marginLeft: 6,
  },

  questionContainer: {
    width: screenWidth - 40,
    maxWidth: 600,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  question: {
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    fontSize: 24,
    lineHeight: 28,

    color: Colors.white,
  },
  input: {
    fontFamily: Fonts.bold,
    fontStyle: "normal",
    fontSize: 24,
    lineHeight: 28,

    marginTop: 35,
    width: screenWidth - 40,
    maxWidth: 600,

    color: Colors.white,

    borderBottomColor: "rgba(255, 255, 255, 0.5)",
    paddingBottom: 5,
    borderBottomWidth: 2,
  },
});
