import React, { useState } from "react";
import { RectButton } from "react-native-gesture-handler";
import { StyleSheet, Text, View, TextInput, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import api from "../services/api.js";

import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";
import StatusBar from "../components/StatusBar";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function RecuperarSenha3({ route }: { route: { params: { email: string; code: string } } }) {
  const [senha, setSenha] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState<boolean>(false);

  const [isVisible, setIsVisible] = useState(true);

  function showPassword() {
    setIsVisible(!isVisible);
  }

  const navigation = useNavigation();

  function handleNavigateToEntrar() {
    navigation.navigate("Entrar");
  }

  function handleNavigateToRecuperarSenha2() {
    navigation.navigate("RecuperarSenha2");
  }

  const handleSubmit = async () => {
    setLoading(true);
    await api
      .post("/reset-password/paciente", {
        email: route.params.email,
        code: route.params.code,
        senha: senha.value,
      })
      .then(() => {
        handleNavigateToEntrar();
      })
      .catch((err) => {
        setSenha((state) => ({ ...state, error: "Senha inválida!" }));
      });
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar color="#2795BF" barStyle="light-content" />

      <View style={styles.header}>
        <RectButton
          style={styles.buttonContainerIcon}
          onPress={handleNavigateToEntrar}
        >
          <AntDesign name="close" size={19.5} color={Colors.white} />
        </RectButton>
        <View style={styles.gridHeader}>
          <RectButton
            style={styles.buttonContainer}
            onPress={handleNavigateToRecuperarSenha2}
          >
            <Text style={styles.text}>Voltar</Text>
          </RectButton>
          <RectButton style={styles.buttonContainer} onPress={handleSubmit}>
            <Text style={styles.text}>Próximo</Text>
          </RectButton>
        </View>
      </View>

      <View>
        <Text style={styles.question}>Digite sua nova senha</Text>
        <TextInput
          placeholder="Senha"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          secureTextEntry={isVisible}
          style={styles.input}
          onChangeText={(e) => setSenha({ value: e, error: "" })}
          value={senha.value}
          autoCapitalize="none"
        />

        <RectButton style={styles.instruction} onPress={showPassword}>
          {isVisible ? (
            <MaterialCommunityIcons
              name="checkbox-blank-outline"
              size={24}
              color="white"
            />
          ) : (
            <MaterialCommunityIcons
              name="checkbox-marked"
              size={24}
              color="white"
            />
          )}
          <Text style={styles.instructionText}>Mostrar senha</Text>
          <Text style={styles.error}>{senha.error}</Text>
        </RectButton>
      </View>
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
  text: {
    fontFamily: Fonts.bold,
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

  error: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    marginTop: 16,
    color: "rgba(255, 255, 255, 1)",
    width: screenWidth - 40,
    maxWidth: 600,
  },
  textStyle: {
    color: "white",
    fontFamily: Fonts.bold,
    textAlign: "center",
  },

  question: {
    fontFamily: Fonts.regular,
    fontSize: 24,
    lineHeight: 28,
    color: "rgba(255, 255, 255, 1)",
    width: screenWidth - 40,
    maxWidth: 600,
  },

  input: {
    fontFamily: Fonts.bold,
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

  instruction: {
    width: 142,
    padding: 5,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  instructionText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 5,

    color: Colors.white,
  },

  visible: {
    width: 80,
    height: 30,

    backgroundColor: "white",

    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",

    marginTop: 20,
    borderRadius: 20,
  },
});
