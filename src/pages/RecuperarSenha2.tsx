import React, { useEffect, useState } from "react";
import { RectButton } from "react-native-gesture-handler";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import api from "../services/api.js";
import moment from "moment";

import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";
import StatusBar from "../components/StatusBar";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function RecuperarSenha2({ route }: { route: { params: { email: string } } }) {
  const insets = useSafeAreaInsets();
  const [codigo, setCodigo] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [time, setTime] = useState<any>({
    active: false,
    requestedTime: null,
    timeLeft: 0,
  });

  const navigation = useNavigation();

  function handleNavigateToEntrar() {
    navigation.navigate("Entrar");
  }

  function handleNavigateToRecuperarSenha1() {
    navigation.navigate("RecuperarSenha1");
  }

  function handleNavigateToRecuperarSenha3() {
    navigation.navigate("RecuperarSenha3", {
      email: route.params.email,
      code: codigo.value,
    });
  }

  const handleSubmit = async () => {
    // Validation
    if (codigo.value.length !== 6)
      return setCodigo((state) => ({ ...state, error: "Código inválido!" }));

    // API Integration
    setLoading(true);
    await api
      .post("/code-validation/paciente", {
        email: route.params.email,
        code: codigo.value,
      })
      .then(() => {
        handleNavigateToRecuperarSenha3();
      })
      .catch(() => {
        setCodigo((state) => ({ ...state, error: "Código inválido!" }));
      });
    setLoading(false);
  };

  const resend = async () => {
    await api.post("/forgot-password/paciente", {
      email: route.params.email,
    });

    setTime({
      active: true,
      timeLeft: 60,
    });
    setTimeout(() => {
      setTime({
        active: false,
        timeLeft: 0,
      });
    }, 60 * 1000);
  };

  useEffect(() => {
    if (time.timeLeft > 0) {
      const timer = setTimeout(() => {
        setTime((state) => ({
          ...state,
          timeLeft: time.timeLeft - 1,
        }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  });

  return (
    <View style={styles.container}>

      <StatusBar color="#2795BF" barStyle="light-content" />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <RectButton
          style={styles.buttonContainerIcon}
          onPress={handleNavigateToEntrar}
        >
          <AntDesign name="close" size={19.5} color={Colors.white} />
        </RectButton>
        <View style={styles.gridHeader}>
          <RectButton
            style={styles.buttonContainer}
            onPress={handleNavigateToRecuperarSenha1}
          >
            <Text style={styles.text}>Voltar</Text>
          </RectButton>
          <RectButton style={styles.buttonContainer} onPress={handleSubmit}>
            <Text style={styles.text}>Próximo</Text>
          </RectButton>
        </View>
      </View>

      <View>
        <Text style={styles.question}>Recuperação de senha</Text>
        <TextInput
          placeholder="Entre com o código"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          style={styles.input}
          keyboardType="number-pad"
          onChangeText={(e) => setCodigo({ value: e, error: "" })}
          value={codigo.value}
        />
        <Text style={styles.error}>{codigo.error}</Text>

        {!time.active ? (
          <Text style={styles.instruction} onPress={resend}>
            Não recebeu um código? Clique aqui para reenviar
          </Text>
        ) : (
          <Text style={styles.instruction}>
            Aguarde para reenviar novamente:{" "}
            {moment.utc(time.timeLeft * 1000).format("mm:ss")}
          </Text>
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
  error: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    marginTop: 16,
    color: "rgba(255, 255, 255, 1)",
    width: screenWidth - 40,
    maxWidth: 600,
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
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 20,

    color: Colors.white,

    width: 300,
    marginTop: 20,
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
