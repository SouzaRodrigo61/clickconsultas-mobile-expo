import React from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CardEspecialidades from "../components/Especialidades/CardEspecialidades";
import NavBar from "../components/NavBar";

export default function Especialidades({ route }) {
  const { especialidades } = route.params;
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollcontainer}
        showsVerticalScrollIndicator={false}
      >
        <CardEspecialidades especialidades={especialidades} />
      </ScrollView>
      <View style={styles.navcontainer}>
        <NavBar setSelected={[0, 0, 0]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },

  scrollcontainer: {
    margin: 15,
  },

  navcontainer: {
    position: "relative",
    bottom: 0,
  },
});
