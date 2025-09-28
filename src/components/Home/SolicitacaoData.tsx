import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function SolicitacaoData() {
  const navigation = useNavigation();

  function handleNavigateCompromissos() {
    navigation.navigate("Compromissos");
  }

  return (
    <View style={styles.solicitar}>
      <Text style={styles.solicitarTitle}>Solicitação de Data</Text>
      <Text style={styles.solicitarText}>
        Seu médico solicitou uma alteração na data de uma de suas consultas
      </Text>
      <TouchableOpacity
        style={styles.solicitarButton}
        activeOpacity={0.7}
        onPress={handleNavigateCompromissos}
      >
        <Text style={styles.solicitarButtonText}>Ver meus compromissos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  solicitar: {
    width: screenWidth - 40,
    maxWidth: 600,
    backgroundColor: Colors.blue,
    padding: 15,
    borderRadius: 4,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  solicitarTitle: {
    fontSize: 15,
    lineHeight: 17,
    fontFamily: Fonts.regular,

    color: Colors.white,
    opacity: 0.7,
  },
  solicitarText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: Fonts.bold,

    color: Colors.white,
    marginTop: 7,
  },
  solicitarButton: {
    backgroundColor: Colors.white,
    height: 40,
    marginTop: 12,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  solicitarButtonText: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: Fonts.regular,
    fontWeight: "bold",

    color: Colors.blue,
  },
});
