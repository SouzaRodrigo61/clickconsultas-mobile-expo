import React, { useState } from "react";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";

import api from "../services/api.js";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";
import StatusBar from "../components/StatusBar";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function RecuperarSenha1() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState({ value: "", error: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProp<any>>();

  function handleNavigateToEntrar() {
    navigation.navigate("Entrar");
  }

  function handleNavigateToRecuperarSenha2() {
    navigation.navigate("RecuperarSenha2", { email: email.value });
  }

  const handleSubmit = async () => {
    // Validation
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.value))
      return setEmail((state) => ({
        ...state,
        error: "Digite um email válido!",
      }));

    // API Integration
    setLoading(true);
    setModalVisible(true);
    await api
      .post("/forgot-password/paciente", {
        email: email.value,
        token: null,
      })
      .catch((err) => setModalVisible(false));
    setLoading(false);
  };

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
            onPress={handleNavigateToEntrar}
          >
            <Text style={styles.text}>Voltar</Text>
          </RectButton>
          <RectButton style={styles.buttonContainer} onPress={handleSubmit}>
            <Text style={styles.text}>Próximo</Text>
          </RectButton>
        </View>
      </View>

      <Modal animationType="none" transparent={true} visible={modalVisible}>
        <View style={styles.containermodal}>
          {loading ? (
            <View style={styles.modalView}>
              <Text style={styles.modalViewText}>Enviando...</Text>
            </View>
          ) : (
            <>
              <View style={styles.modalView}>
                <Text style={styles.modalViewText}>
                  Por favor verifique seu email
                </Text>
              </View>

              <View style={styles.modalView2}>
                <Text style={styles.modalViewText2}>
                  Enviamos um código para{" "}
                  <Text style={styles.modalViewText2Bold}>"{email.value}"</Text>
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                  onPressIn={handleNavigateToRecuperarSenha2}
                >
                  <Text style={styles.modalButtonText}>Entendi</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>

      <View>
        <Text style={styles.question}>Recuperação de senha</Text>
        <TextInput
          placeholder="Entre com seu email"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          style={styles.input}
          autoComplete="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          onChangeText={(e) => setEmail({ value: e, error: "" })}
          value={email.value}
          autoCapitalize="none"
        />
        <Text style={styles.error}>{email.error}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,

    backgroundColor: "#2795BF",

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 0,
    paddingBottom: 10,
    minHeight: 60,
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

  error: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    marginTop: 16,
    color: "rgba(255, 255, 255, 1)",
    width: screenWidth - 40,
    maxWidth: 600,
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

  savebutton: {
    position: "absolute",
  },

  containermodal: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.65)",
  },

  modalView: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    justifyContent: "center",
    width: screenWidth - 40,
    maxWidth: 600,
    height: 50,

    backgroundColor: "rgba(47, 168, 213, 1)",
  },

  modalViewText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 19,
    color: "white",
    textAlign: "left",
    marginLeft: 18,
  },

  modalView2: {
    backgroundColor: "white",
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    alignItems: "center",
    width: screenWidth - 40,
    maxWidth: 600,
    padding: 18,
  },

  modalViewText2: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: "rgba(0, 0, 0, 1)",
    textAlign: "left",
  },

  modalViewText2Bold: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    lineHeight: 24,
    color: "rgba(0, 0, 0, 1)",
    textAlign: "justify",
  },

  modalButton: {
    width: 80,
    height: 25,
    alignSelf: "flex-end",
    marginTop: 25,
  },

  modalButtonText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: "rgba(47, 168, 213, 1)",
    textAlign: "right",
    textTransform: "uppercase",
    bottom: 0,
  },

  textStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: Fonts.bold,
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
