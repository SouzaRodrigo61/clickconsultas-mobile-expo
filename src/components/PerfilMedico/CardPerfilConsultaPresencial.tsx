import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface Data {
  valor: any;
  loading: boolean;
  id_medico: any;
  valor_real: any;
}

export default function CardPerfilConsultaPresencial({
  valor,
  loading,
  id_medico,
  valor_real,
}: Data) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.firstlayer}>
        <View style={styles.iconhome}>
          <Entypo name="home" size={14} color={Colors.white} />
        </View>
        <View style={styles.textFirstLayerContainer}>
          <Text style={styles.textfirstlayer}>Consulta Presencial</Text>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.blue} />
          ) : (
            <Text
              style={{
                ...styles.textfirstlayer,
                color: Colors.blue,
                fontFamily: Fonts.bold,
              }}
            >
              R$ {valor}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.secondLayer}>
        <RectButton
          style={styles.buttonContainer}
          onPress={() =>
            navigation.navigate("SelecioneData", { id_medico, valor_real })
          }
        >
          <Text style={styles.textButton}>Agendar Consulta</Text>
        </RectButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: screenWidth - 40,
    height: 133,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: Colors.softGray,
    borderRadius: 4,
    backgroundColor: Colors.white,
    shadowColor: Colors.softGray,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0.4,
    marginBottom: 21,
  },

  firstlayer: {
    backgroundColor: Colors.softBlue,
    flexDirection: "row",
    paddingTop: 5,
    alignItems: "center"
  },

  textFirstLayerContainer: {
    flexDirection: "row",
    width: screenWidth - 120,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: 'wrap',
  },
  textfirstlayer: {
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

  secondLayer: {
    marginTop: 14,
    marginBottom: 20,
  },
  buttonContainer: {
    backgroundColor: Colors.blue,
    width: screenWidth - 60,
    height: 42,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  textButton: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    lineHeight: 19,
    color: Colors.white,
  },
});
