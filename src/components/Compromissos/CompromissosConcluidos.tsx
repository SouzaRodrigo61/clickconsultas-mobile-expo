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

import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
import Card from "../../components/Compromissos/Card";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Compromissos({ compromissos = [] }) {
  const navigation = useNavigation();

  function handleNavigateToCompromissosResumoConsulta() {
    navigation.navigate("CompromissosResumoConsulta");
  }

  const [isVisible, setIsVisible] = useState(true);
  function Filtro() {
    setIsVisible(!isVisible);
  }

  return (
    <View style={styles.container}>
      {compromissos.length > 0 ? (
        compromissos.map((compromisso: any) => (
          <Card key={compromisso.id_consulta} compromisso={compromisso} />
        ))
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: screenHeight - 250,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              lineHeight: 18,
              fontFamily: Fonts.regular,
              textAlign: "center",

              opacity: 0.4,
              color: Colors.black,
            }}
          >
            Nenhum compromisso a ser exibido!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },

  mainCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.white,

    padding: 20,
    marginBottom: 10,
  },

  imgDoctor: {
    marginRight: 12,
    width: 22,
    height: 22,
    borderRadius: 70 / 2,
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
});
