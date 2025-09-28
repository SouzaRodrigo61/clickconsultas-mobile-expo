import React, { useState } from "react";
import { RectButton } from "react-native-gesture-handler";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import CountDown from "react-native-countdown-component";
import axios from "axios";

import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";
import StatusBar from "../components/StatusBar";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function CadastroVerificarIdentidade({ route }) {
  const navigation = useNavigation();

  const { nome, telefone, emailvar, cpfvar, genero, data_nascimento, cidade } =
    route.params;

  const [codigo, setCodigo] = useState("" as string);
  const [loading, setLoading] = useState(false as Boolean);
  const [required, setRequired] = useState(false as Boolean);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function handleNavigateToPerfil() {
    navigation.navigate("Perfil");
  }

  function handleNavigateToCadastroTelefone() {
    navigation.navigate("CadastroTelefone");
  }

  async function handleNavigateToCadastroCPF() {
    setLoading(true);
    const validaCodigo = async (codigo) => {
      const test = await new Promise((resolve) =>
        setTimeout(() => resolve(true), 5000)
      );
      !test && setErrorMessage("Código Inválido!");
      return test;
    };

    const naoVazia = (text) => {
      const test = text.trim() !== "";
      !test && setErrorMessage("Campo requerido!");
      return test;
    };

    let valid = [
      await validaCodigo(codigo), // ? BACKEND - Verifica se o código é válido
      naoVazia(codigo), // ! Não permite vazio
    ].every((e) => e === true);

    valid
      ? navigation.navigate("CadastroCPF", {
          nome: nome,
          telefone: telefone,
          emailvar: emailvar,
          cpfvar: cpfvar,
          genero: genero,
          data_nascimento: data_nascimento,
          cidade: cidade,
        })
      : setRequired(true);
    setLoading(false);
  }

  const [timer, setButton] = useState(true);

  function timerButton() {
    setButton(!timer);
  }

  function handleCodigo(text: string) {
    setRequired(false);
    setCodigo(text);
  }

  return (
    <View style={styles.container}>
      <StatusBar />

      <View style={styles.header}>
        <RectButton
          style={styles.buttonContainerIcon}
          onPress={handleNavigateToPerfil}
        >
          <AntDesign name="close" size={19.5} color={Colors.white} />
        </RectButton>
        <View style={styles.gridHeader}>
          <RectButton
            style={styles.buttonContainer}
            onPress={handleNavigateToCadastroTelefone}
          >
            <Text style={styles.text}>Voltar</Text>
          </RectButton>
          <RectButton
            style={styles.buttonContainer}
            onPress={handleNavigateToCadastroCPF}
          >
            {loading ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
              >
                <Text style={styles.text}>Verificando...</Text>
                <ActivityIndicator size="small" color={Colors.white} />
              </View>
            ) : (
              <Text style={styles.text}>Verificar</Text>
            )}
          </RectButton>
        </View>
      </View>

      <View>
        <View style={styles.questionContainer}>
          <Text style={styles.question}>Verificar sua identidade</Text>
        </View>
        <TextInput
          placeholder="Entre com o código"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          style={styles.input}
          keyboardType="number-pad"
          onChangeText={handleCodigo}
          maxLength={6}
        />

        {required && (
          <View style={styles.requiredContainer}>
            <AntDesign name="exclamationcircleo" size={12} color="#F24822" />
            <Text style={styles.textRequired}>{errorMessage}</Text>
          </View>
        )}

        {timer ? (
          <View style={styles.gridTimer}>
            <Text style={styles.instruction}>Reenviar código em </Text>
            <CountDown
              size={9}
              until={30}
              onFinish={setButton}
              digitStyle={{ backgroundColor: Colors.blue }}
              digitTxtStyle={styles.timer}
              separatorStyle={styles.timer}
              timeToShow={["M", "S"]}
              timeLabels={{ m: null, s: null }}
              showSeparator
            />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.timerReenviarButton}
            onPress={timerButton}
          >
            <Text style={styles.timerReenviarText}>Reenviar</Text>
          </TouchableOpacity>
        )}
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

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
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
    color: "#F24822",
    marginLeft: 6,
  },

  questionContainer: {
    width: screenWidth - 40,
    maxWidth: 600,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  question: {
    fontWeight: "500",
    fontSize: 24,
    lineHeight: 28,
    color: "rgba(255, 255, 255, 1)",
  },

  input: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    lineHeight: 28,

    marginTop: 35,

    color: Colors.white,

    borderBottomColor: "rgba(255, 255, 255, 0.5)",
    paddingBottom: 5,
    borderBottomWidth: 2,
  },

  instruction: {
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    fontSize: 16,
    lineHeight: 20,

    color: Colors.white,
  },

  gridTimer: {
    marginTop: 25,
    flexDirection: "row",
  },

  timer: {
    fontFamily: Fonts.bold,
    fontStyle: "normal",
    fontSize: 16,
    lineHeight: 20,

    color: Colors.white,
  },

  timerReenviarButton: {
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    marginTop: 25,
    paddingBottom: 1,
    width: 90,

    alignItems: "center",

    backgroundColor: Colors.blue,
  },

  timerReenviarText: {
    fontFamily: Fonts.bold,
    fontStyle: "normal",
    fontSize: 16,
    lineHeight: 20,

    color: "rgba(255,255,255,0.7)",
  },
});
