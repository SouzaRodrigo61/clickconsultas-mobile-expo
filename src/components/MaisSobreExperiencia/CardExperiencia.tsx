import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
import api from "../../services/api.js";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function CardExperiencia({
  experiencias,
  especialista,
  loading,
}) {
  const arrayExperiencia = [
    "Voluntário Africa 2000",
    "Programa Voluntário 2007",
  ];

  return (
    <View style={styles.container}>
      <View style={styles.firstLayer}>
        <Text style={styles.textFirstLayer}>Experiência</Text>
        <Text style={styles.textFirstLayer}> - </Text>
        <Text style={styles.textFirstLayer}>{especialista}</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.blue} />
      ) : (
        <View style={styles.secondLayer}>
          {experiencias.map((experiencia, index) => (
            <View style={styles.textContainerSecondLayer} key={index}>
              <Text style={styles.textSecondLayer}>• </Text>
              <Text style={styles.textSecondLayer}>
                {experiencia.titulo} ({experiencia.ano}) -{" "}
                {experiencia.descricao}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: screenWidth - 20,
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.softGray,
    backgroundColor: Colors.white,
    shadowColor: Colors.softGray,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0.4,
  },

  firstLayer: {
    flexDirection: "row",
    height: 60,
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.softGray,
    alignItems: "center",
  },
  textFirstLayer: {
    fontFamily: Fonts.bold,
    fontStyle: "normal",
    fontSize: 16,
    lineHeight: 19,
  },

  secondLayer: {
    marginLeft: 20,
    marginRight: 20,
    justifyContent: "center",
    paddingBottom: 20,
    flexWrap: "wrap",
  },
  textContainerSecondLayer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },
  textSecondLayer: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 19,
  },
});
