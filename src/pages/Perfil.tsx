import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ViewBase,
  ActivityIndicator,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";

import Cadastro from "../components/Perfil/CadastroPerfil";
import Conta from "../components/Perfil/ContaPerfil";
import SafeAreaWrapper from "../components/SafeAreaWrapper";

import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";
import StatusBar from "../components/StatusBar";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Perfil({ route }) {
  const [firstSelected, secondSelected] = useState(true);

  function select() {
    secondSelected(!firstSelected);
  }

  return (
    <SafeAreaWrapper>
      <StatusBar color="#2FA8D5" barStyle={"light-content"} />
      <View style={styles.container}>

      <View style={styles.headerBar}>
        <RectButton style={styles.headerBarButton} onPress={select}>
          {firstSelected ? (
            <Text style={styles.headerBarButtonTextSelected}>Cadastro</Text>
          ) : (
            <Text style={styles.headerBarButtonTextUnselected}>Cadastro</Text>
          )}
        </RectButton>
        <RectButton style={styles.headerBarButton} onPress={select}>
          {firstSelected ? (
            <Text style={styles.headerBarButtonTextUnselected}>Conta</Text>
          ) : (
            <Text style={styles.headerBarButtonTextSelected}>Conta</Text>
          )}
        </RectButton>
      </View>

      {firstSelected ? (
        <View style={styles.headerBarBorder}>
          <View
            style={{
              borderWidth: 2,
              borderColor: "#2A3748",
              width: screenWidth / 2,
            }}
          />
          <View
            style={{
              borderWidth: 2,
              borderColor: "#F7F7F7",
              width: screenWidth / 2,
            }}
          />
        </View>
      ) : (
        <View style={styles.headerBarBorder}>
          <View
            style={{
              borderWidth: 2,
              borderColor: "#F7F7F7",
              width: screenWidth / 2,
            }}
          />
          <View
            style={{
              borderWidth: 2,
              borderColor: "#2A3748",
              width: screenWidth / 2,
            }}
          />
        </View>
      )}

      {firstSelected ? <Cadastro route={route.params} /> : <Conta />}
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerBar: {
    width: "100%",
    height: 50,
    backgroundColor: "#F7F7F7",
    flexDirection: "row",
  },
  headerBarButton: {
    width: screenWidth / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBarButtonTextSelected: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: Fonts.bold,
    fontStyle: "normal",
    textTransform: "uppercase",

    color: "#2A3748",
  },
  headerBarButtonTextUnselected: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: Fonts.bold,
    fontStyle: "normal",
    textTransform: "uppercase",

    color: "rgba(0, 0, 0, 0.5)",
  },
  headerBarBorder: {
    flexDirection: "row",
    width: "100%",
  },

  list: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
  },

  contaListItem: {
    flexDirection: "row",
    justifyContent: "space-between",

    width: "100%",

    height: 50,
    paddingLeft: 20,

    alignItems: "center",

    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  contaListItemDisconnect: {
    flexDirection: "row",
    justifyContent: "space-between",

    width: "100%",

    height: 50,
    paddingLeft: 20,

    alignItems: "center",
  },
  contaListTitle: {
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    fontSize: 15,
    lineHeight: 21,

    color: Colors.black,
  },
  contaListTitleDisconnect: {
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    fontSize: 15,
    lineHeight: 21,

    color: Colors.blue,
  },
  contaButton: {
    height: 50,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },

  botaoAzul: {
    backgroundColor: Colors.blue,

    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",

    borderRadius: 4,
    width: screenWidth - 40,
    maxWidth: 600,
    height: 59,
    marginBottom: 20,
  },

  botaoAzulTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    fontStyle: "normal",

    color: Colors.white,
    marginBottom: 5,
  },
});
