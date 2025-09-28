import React, { useState } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { RectButton } from "react-native-gesture-handler";

import { useNavigation } from "@react-navigation/native";

import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function NenhumCompromisso() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.compromissosVazio}>
        <Text style={styles.text}>Você não possui nenhum compromisso</Text>
        <RectButton
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Procurar Médicos</Text>
        </RectButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },

  compromissosVazio: {
    flex: 1,
    width: screenWidth - 40,
    maxWidth: 600,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  text: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: Fonts.regular,
    textAlign: "center",

    color: "rgba(0, 0, 0, 0.5)",
  },

  button: {
    height: 50,
    width: 180,
    borderRadius: 4,
    marginTop: 25,

    backgroundColor: Colors.blue,

    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: Fonts.bold,

    color: Colors.white,
  },
});
