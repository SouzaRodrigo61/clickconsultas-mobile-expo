import React, { useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";

import { useProfile } from "../../contexts/profile";

interface Props {
  slice: number;
  especialidades: string[];
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Especialidades({ slice, especialidades }: Props) {
  const { profile, setProfile } = useProfile();
  const navigation = useNavigation();

  const localSelected = profile?.localidade?.cidade || "";

  return (
    <View style={styles.container}>
      <View style={styles.cardcontainer}>
        {especialidades.length > 0 &&
          especialidades.slice(0, slice).map((tipoEspecialidade, index) => (
            <View style={styles.buttonContainer} key={index}>
              <RectButton
                style={styles.card}
                onPress={() =>
                  navigation.navigate("EncontreAgende", {
                    searchBySpec: true,
                    spec: tipoEspecialidade,
                    localidade: localSelected,
                    especialidades: [...especialidades],
                  })
                }
              >
                <View style={styles.cardContent}>
                  {index % 2 ? (
                    <View style={styles.darkBlueIcon}>
                      <FontAwesome name="stethoscope" size={24} color="white" />
                    </View>
                  ) : (
                    <View style={styles.blueIcon}>
                      <FontAwesome name="stethoscope" size={24} color="white" />
                    </View>
                  )}
                  <Text style={styles.text}>{tipoEspecialidade}</Text>
                </View>
              </RectButton>
            </View>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  cardcontainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: screenWidth - 40,
    maxWidth: 600,
  },
  buttonContainer: {
    backgroundColor: "#FDFDFD",
    width: (screenWidth - 40) / 2 - 5,
    maxWidth: 290,
    height: 65,
    marginTop: 5,
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#DADADA",
  },
  card: {
    width: (screenWidth - 40) / 2 - 5,
    maxWidth: 290,
    height: 65,
    margin: 11,
    alignItems: "center",
    borderRadius: 4,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    textAlign: "left",
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    fontSize: 14,
    lineHeight: 17,
    opacity: 0.7,
    color: Colors.black,
    marginRight: 10,
    flex: 1,
  },

  darkBlueIcon: {
    marginLeft: 10,
    marginRight: 10,
    margin: 5,

    width: 41,
    height: 41,

    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.titleBlue,
  },

  blueIcon: {
    marginLeft: 10,
    marginRight: 10,
    margin: 5,

    width: 41,
    height: 41,

    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.blue,
  },
});
