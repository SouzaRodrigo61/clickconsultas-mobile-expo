import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";
import StatusBar from "../components/StatusBar";
import SafeAreaWrapper from "../components/SafeAreaWrapper";

import { useNavigation } from "@react-navigation/native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function FormaDePagamento({ route }) {
  const convenios = ["Unimed", "Amil", "SulAmerica"];

  const navigation = useNavigation();

  function handleNavigate(convenioSelecionado) {
    navigation.navigate("SelecioneData", { convenioSelecionado });
  }

  return (
    <SafeAreaWrapper>
      <StatusBar color="#2fa8d5" barStyle="light-content" />
      <View style={styles.mainContainer}>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.notFound}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Outros</Text>
          </View>

          <TouchableOpacity
            style={styles.container}
            onPress={() => handleNavigate("Particular")}
          >
            <View style={styles.textConsultaParticular}>
              <Text>Consulta Particular</Text>
              <Text
                style={{
                  ...styles.textValorConsulta,
                  color: Colors.blue,
                  fontFamily: Fonts.bold,
                }}
              >
                R$ {route.params.valor}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Convênios</Text>
          </View>

          {route.params.convenios
            .sort((a, b) => a.localeCompare(b))
            .map((conv) => (
              <TouchableOpacity
                key={conv}
                style={styles.container}
                onPress={() => handleNavigate(conv)}
              >
                <View style={styles.text}>
                  <Text>{conv}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.softGray,
  },

  topContainer: {
    backgroundColor: Colors.blue,
    position: "relative",
    top: 0,
    paddingTop: 12,
    width: screenWidth,
  },
  titleContainer: {
    backgroundColor: "#E5E5E5",
    width: screenWidth,
    height: 38,
    justifyContent: "center",
    borderBottomColor: Colors.softGray,
  },
  container: {
    backgroundColor: Colors.white,
    width: screenWidth,
    height: 50,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.softGray,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: "#666666",
    lineHeight: 16.8,
    marginLeft: 16,
  },
  text: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: "rgba(42, 55, 72, 1)",
    lineHeight: 19,
    marginLeft: 16,
  },
  textConsultaParticular: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: 'wrap',
    marginLeft: 16,
    marginRight: 16,
  },
  textValorConsulta: {
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    fontSize: 16,
    lineHeight: 19,
  },
  iconhome: {
    backgroundColor: Colors.blue,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 1000,
    margin: 14,
  },
  notFound: {
    alignItems: "center",
    justifyContent: "center",
  },
  textNotFound: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    opacity: 0.4,
    padding: 10,
    textAlign: "center",
  },
});
