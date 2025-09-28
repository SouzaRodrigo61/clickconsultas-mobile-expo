import React from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  Dimensions 
} from "react-native";
import CardExperiencia from "../components/MaisSobreExperiencia/CardExperiencia";
import NavBar from "../components/NavBar";
import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function MaisSobreExperiencia({ route }) {
  const navigation = useNavigation();

  function handlePress() {
    navigation.navigate("SelecioneData", {
      id_medico: route.params.id_medico,
      valor_real: route.params.valor_real,
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollcontainer}>
        <CardExperiencia
          experiencias={route.params.experiencias}
          especialista={route.params.especialista}
          loading={route.params.loading}
        />
        <View style={styles.buttonscontainer}>
          <RectButton style={styles.buttoncontainerAzul} onPress={handlePress}>
            <Text style={styles.textButton}>Agendar Consulta</Text>
          </RectButton>
        </View>
      </ScrollView>

      <View style={styles.navcontainer}>
        <NavBar setSelected={[1, 0, 0]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },

  scrollcontainer: {},

  buttonscontainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  buttoncontainerAzul: {
    width: screenWidth - 20,
    height: 42,
    backgroundColor: Colors.blue,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    fontFamily: Fonts.bold,
    lineHeight: 16,
    fontSize: 14,
    color: Colors.white,
  },

  navcontainer: {
    position: "relative",
    bottom: 0,
  },
});
