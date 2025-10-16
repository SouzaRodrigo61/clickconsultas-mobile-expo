import React, { useState } from "react";
import { RectButton } from "react-native-gesture-handler";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import api from "../services/api.js";

import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";
import StatusBar from "../components/StatusBar";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
import { useProfile } from "../contexts/profile";

export default function CadastroEmail({ route }) {
  const navigation = useNavigation();

  const { profile, setProfile } = useProfile();

  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState<string>(profile?.email || "");
  const [loading, setLoading] = useState<boolean>(false);

  const [required, setRequired] = useState(false as Boolean);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function handleNavigateToPerfil() {
    navigation.navigate("Perfil");
  }

  function handleNavigateToCadastroTelefone() {
    navigation.navigate("CadastroTelefone");
  }

  function handleNavigateToCadastroVerificarIdentidade() {
    navigation.navigate("CadastroVerificarIdentidade");
  }

  async function handleSubmit() {
    if (profile?.email === email) handleNavigateToPerfil();

    setLoading(true);

    const validaEmail = (text) => {
      const test = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(text);
      !test && setErrorMessage("Digite um email válido!");
      return test;
    };

    const naoVazia = (text) => {
      const test = text.trim() !== "";
      !test && setErrorMessage("Campo requerido!");
      return test;
    };

    let valid = [
      validaEmail(email), // ! Valida o email
      naoVazia(email), // ! Não permite vazio
    ].every((e) => e === true);

    if (valid)
      await api
        .put("/pacientes/profile", { email })
        .then(() => {
          setProfile((state: any) => ({ ...state, email }));
          handleNavigateToPerfil();
        })
        .catch(() => setErrorMessage("Erro ao atualizar email!"));
    else {
      setRequired(true);
    }
    setLoading(false);
  }

  function handleEmail(text: string) {
    setRequired(false);
    setEmail(text);
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

      <Modal animationType="none" transparent={true} visible={modalVisible}>
        <View style={styles.containermodal}>
          <View style={styles.modalView}>
            <Text style={styles.modalViewText}>
              Por favor verifique seu email
            </Text>
          </View>

          <View style={styles.modalView2}>
            <Text style={styles.modalViewText2}>
              Enviamos um código para{" "}
              <Text style={styles.modalViewText2Bold}>{email}</Text>
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
              onPressIn={handleNavigateToCadastroVerificarIdentidade}
            >
              <Text style={styles.modalButtonText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View>
        <View style={styles.questionContainer}>
          <Text style={styles.question}>Qual é seu email?</Text>
        </View>
        <TextInput
          placeholder="Digite seu email"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          style={styles.input}
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          onChangeText={handleEmail}
          value={email}
        />

        {required && (
          <View style={styles.requiredContainer}>
            <AntDesign
              name="warning"
              size={12}
              color={Colors.white}
            />
            <Text style={styles.textRequired}>{errorMessage}</Text>
          </View>
        )}

        <Text style={styles.instruction}>
          Pressione “SALVAR” e verifique seu email
        </Text>
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
  buttonLoading: {
    justifyContent: "space-between",
    width: 110,
    alignItems: "center",
    flexDirection: "row",
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
    fontSize: 16,
    fontFamily: Fonts.bold,
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
    fontFamily: Fonts.bold,
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
    fontFamily: Fonts.bold,
    fontSize: 24,
    lineHeight: 28,
    color: "rgba(255, 255, 255, 1)",
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

  instruction: {
    fontFamily: Fonts.regular,
    fontStyle: "normal",
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
