import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  Dimensions,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";

import Colors, { getColor } from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
import moment from "moment";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Card({ compromisso = [] }: any) {
  const navigation = useNavigation();

  function handleNavigateToCompromissosResumoConsulta() {
    navigation.navigate("CompromissosResumoConsulta");
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainCardContent}>
        <View>
          <View style={styles.gridMainCardDate}>
            <Feather
              name="calendar"
              size={20}
              color="#111111"
              style={{ marginRight: 12 }}
            />
            <Text style={styles.cardText}>
              {compromisso.nova_data_consulta
                ? moment(compromisso.nova_data_consulta).format(
                    "D [de] MMM[.] YYYY [às] H[h]mm"
                  )
                : moment(compromisso.data_consulta).format(
                    "D [de] MMM[.] YYYY [às] H[h]mm"
                  )}
            </Text>
          </View>
          <View style={styles.gridMainCard}>
            <AntDesign
              name="user"
              size={20}
              color="#111111"
              style={{ marginRight: 12 }}
            />
            <Text style={styles.cardText}>
              Dr(a). {compromisso.nome_completo}
            </Text>
          </View>
          <View style={styles.gridMainCard}>
            <View
              style={{
                height: 10,
                width: 10,
                backgroundColor: getColor(compromisso.status_consulta),
                borderRadius: 25,
                marginLeft: 7,
              }}
            />
            <Text
              style={{
                ...styles.statusAgendado,
                color: getColor(compromisso.status_consulta),
              }}
            >
              {compromisso.status_consulta}
            </Text>
          </View>
        </View>
        {["Solicitada", "Agendada", "Pendente"].includes(
          compromisso.status_consulta
        ) && (
          <RectButton
            style={styles.button}
            onPress={handleNavigateToCompromissosResumoConsulta}
          >
            <AntDesign name="right" size={24} color="rgba(0, 0, 0, 0.7)" />
          </RectButton>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },

  mainCardContent: {
    
    alignSelf: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,

    width: screenWidth - 40,
    padding: 20,
    marginBottom: 10,
    borderRadius: 4,
  },

  gridMainCardDate: {
    flexDirection: "row",
    alignItems: "center",
  },

  gridMainCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  cardText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: Fonts.regular,

    color: Colors.black,
    width: 0,
    flexGrow: 1,
  },

  statusAgendado: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: Fonts.bold,

    color: "#37D363",

    marginLeft: 15,
  },

  statusSolicitado: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: Fonts.bold,

    color: "#FD9800",

    marginLeft: 15,
  },

  button: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 4,
  },
});
