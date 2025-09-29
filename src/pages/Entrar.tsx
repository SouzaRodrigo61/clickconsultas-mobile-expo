import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

import api from "../services/api";

import { useAuth } from "../contexts/auth";

import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";
import ColorfulLogo from "../images/logo-bem-vindo.png";
import { MaterialIcons } from "@expo/vector-icons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Entrar() {
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const [data, setData] = useState({
    email: { value: "" },
    senha: { value: "" },
  });

  const [error, setError] = useState("");

  const [isVisible, setIsVisible] = useState(true);

  function showPassword() {
    setIsVisible(!isVisible);
  }

  const navigation = useNavigation();

  function handleNavigateToCadastro() {
    navigation.navigate("Cadastro");
  }

  function handleNavigateToRecuperarSenha1() {
    navigation.navigate("RecuperarSenha1");
  }

  const login = async () => {
    setLoading(true);
    console.log("Tentando fazer login com:", data.email.value);
    await api
      .post("/login/paciente", {
        email: data.email.value,
        senha: data.senha.value,
        mobile: true,
      })
      .then((res) => {
        console.log("Login bem-sucedido:", res.data);
        setLoading(false);
        signIn(res.data.user, res.data.token);
      })
      .catch((error) => {
        console.log("Erro no login:", error.response?.data || error.message);
        setLoading(false);
        return setError("Verifique suas informações e tente novamente.");
      });
  };

  function handleChange(field, text) {
    setData((state) => ({ ...state, [field]: { value: text } }));
    setError("");
  }

  return (
    <ScrollView style={styles.color}>
      <View style={styles.image}>
        <Image
          source={ColorfulLogo}
          style={{ margin: 15, width: 160, resizeMode: "contain" }}
        />
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo</Text>

        <TextInput
          placeholder="E-mail"
          secureTextEntry={false}
          placeholderTextColor="rgba(0, 0, 0, 0.4)"
          style={styles.input}
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          onChangeText={(e) => handleChange("email", e)}
          value={data.email.value}
          autoCapitalize="none"
        />

        <View style={styles.grid}>
          <TextInput
            placeholder="Senha"
            secureTextEntry={isVisible}
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            style={styles.passwordInput}
            autoCompleteType="password"
            textContentType="password"
            onChangeText={(e) => handleChange("senha", e)}
            value={data.senha.value}
            autoCapitalize="none"
          />
          <View style={styles.inputVisibleContainer}>
            <RectButton onPress={showPassword} style={styles.inputVisible}>
              {isVisible ? (
                <Text style={styles.inputVisibleText}>Mostrar</Text>
              ) : (
                <Text style={styles.inputVisibleText}> Não Mostrar</Text>
              )}
            </RectButton>
          </View>
        </View>

        <View style={styles.linkcontainer}>
          <Text style={styles.link} onPress={handleNavigateToRecuperarSenha1}>
            Esqueci minha senha
          </Text>
        </View>

        {error.trim() !== "" && (
          <View style={styles.warningContainer}>
            <MaterialIcons
              size={20}
              name="error-outline"
              color={Colors.red}
              style={{ opacity: 0.8 }}
            />
            <Text style={styles.warning}>{error}</Text>
          </View>
        )}

        <View style={styles.lightBlueCircle}>
          <RectButton onPress={login} style={styles.botaoAzul}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.botaoAzulText}>Verificando...</Text>
                <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
              </View>
            ) : (
              <Text style={styles.botaoAzulText}>Entrar</Text>
            )}
          </RectButton>

          <RectButton
            onPress={handleNavigateToCadastro}
            style={styles.botaoBranco}
          >
            <Text style={styles.botaoBrancoText}>
              Não tem conta? Cadastre-se
            </Text>
          </RectButton>

          <View style={styles.mediumBlueCircle}>
            <View style={styles.blueCircle}></View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  color: {
    backgroundColor: "#FCFCFC",
  },

  image: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    height: screenHeight * 0.25,
  },

  title: {
    fontFamily: Fonts.bold,
    fontStyle: "normal",
    fontSize: 30,
    lineHeight: 38,

    marginBottom: 50,

    textAlign: "left",
    color: Colors.titleBlue,
  },

  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.white,

    alignItems: "center",
    alignSelf: "center",
    zIndex: 2,
    paddingTop: 50,

    width: screenHeight,
    height: screenHeight * 0.75,
    borderTopLeftRadius: screenHeight / 2,
    borderTopRightRadius: screenHeight / 2,

    shadowColor: Colors.softGray,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 15,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.input,
    borderRadius: 4,

    width: screenWidth - 50,
    maxWidth: 600,
    height: 50,
    paddingHorizontal: 14,
    marginBottom: 16,

    textAlignVertical: "center",

    fontSize: 16,
    fontFamily: Fonts.regular,
    fontStyle: "normal",
  },

  grid: {
    flexDirection: "row",
    width: screenWidth - 50,
    maxWidth: 600,
  },

  passwordInput: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomColor: Colors.input,
    borderTopColor: Colors.input,
    borderLeftColor: Colors.input,
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
    color: "#000", // Adicionar cor do texto
    width: screenWidth - 180,
    maxWidth: 470,
    height: 50,
    paddingHorizontal: 14,
    marginBottom: 14,

    textAlignVertical: "center",

    fontSize: 16,
    fontFamily: Fonts.regular,
    fontStyle: "normal",
  },

  inputVisibleContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: Colors.input,
    borderTopColor: Colors.input,
    borderRightColor: Colors.input,
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,

    padding: 5,
    height: 50,
    width: 130,
    paddingLeft: 10,
    marginBottom: 16,

    fontSize: 16,
    fontFamily: Fonts.regular,
    fontStyle: "normal",

    justifyContent: "center",
  },

  inputVisible: {
    padding: 5,
  },

  inputVisibleText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    textAlign: "right",
    textTransform: "uppercase",
    opacity: 0.3,
    color: Colors.black,
  },

  link: {
    color: "rgba(0, 0, 0, 0.4)",
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    fontSize: 16,
    lineHeight: 22,

    textAlign: "right",

    alignSelf: "flex-end",
    marginBottom: 30,
    width: screenWidth - 50,
  },

  linkcontainer: {
    width: screenWidth - 50,
    maxWidth: 600,
  },

  loadingContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  warning: {
    color: Colors.red,
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    fontSize: 16,
    lineHeight: 22,
    marginLeft: 8,
    opacity: 0.8,
  },

  warningContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    width: screenWidth - 50,
    maxWidth: 600,
    marginTop: -10,
    marginBottom: 15,
  },

  botaoAzul: {
    backgroundColor: Colors.blue,
    borderRadius: 25,

    justifyContent: "center",
    alignItems: "center",

    width: screenWidth - 50,
    maxWidth: 600,
    height: 50,

    shadowColor: Colors.softGray,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 3,
  },
  botaoAzulText: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: Fonts.bold,

    color: Colors.white,
  },

  botaoBranco: {
    marginTop: 15,
    marginBottom: 30,

    borderRadius: 25,

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(238, 248, 252, 0)",

    width: screenWidth - 50,
    maxWidth: 600,
    height: 50,
  },
  botaoBrancoText: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: Fonts.bold,

    color: Colors.blue,
  },

  lightBlueCircle: {
    width: screenHeight,
    height: screenHeight,
    borderRadius: screenHeight / 2,
    paddingTop: 180,
    backgroundColor: "rgba(238, 248, 252, 0.5)",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  mediumBlueCircle: {
    width: screenHeight,
    height: screenHeight,
    borderRadius: screenHeight / 2,
    backgroundColor: "rgba(208, 235, 246, 0.5)",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  blueCircle: {
    width: screenHeight - 25,
    height: screenHeight - 25,
    borderRadius: (screenHeight - 25) / 2,
    backgroundColor: "#C4E6F3",
  },
});
