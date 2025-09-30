import React, { useState } from "react";
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
  const { profile, setProfile } = useProfile();
  const [city, setCity] = useState<any>(profile?.cidade || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  function handleNavigateToPerfil() {
    navigation.navigate("Perfil");
  }

  async function handleSubmit() {
    if (profile?.cidade === city[1]) handleNavigateToPerfil();
    setLoading(true);
    await api
      .put("/pacientes/profile", { cidade: city[1] })
      .then(() => {
        setProfile((state: any) => ({ ...state, cidade: city[1] }));
        handleNavigateToPerfil();
      })
      .catch(() => setErrorMessage("Erro ao atualizar cidade!"));
    setLoading(false);
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
      </View>

      <CityComponent setCidade={setCity} />
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
});
