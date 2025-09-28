import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useProfile } from "../../contexts/profile";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function CardEspecialidades({ especialidades }) {
  const { profile, setProfile } = useProfile();
  const navigation = useNavigation();

  const localSelected = profile?.localidade?.cidade || "";

  return (
    <View style={styles.container}>
      <View style={styles.cardcontainer}>
        {especialidades?.map((tipoEspecialidade, index) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            key={index}
            onPress={() => {
              navigation.navigate("EncontreAgende", {
                searchBySpec: true,
                spec: tipoEspecialidade,
                localidade: localSelected,
                especialidades: [...especialidades],
              });
            }}
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
              <Text
                textBreakStrategy="balanced"
                style={styles.text}
                numberOfLines={3}
                adjustsFontSizeToFit
              >
                {tipoEspecialidade}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.softGray,
    backgroundColor: Colors.white,
  },

  cardcontainer: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    backgroundColor: Colors.white,
    justifyContent: "center",
    width: screenWidth - 20,
  },
  card: {
    width: 162,
    height: 65,
    margin: 11,
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#DADADA",
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    textAlign: "left",
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 16,
    opacity: 0.7,
    color: Colors.black,
    marginRight: 10,
    flex: 1,
    flexWrap: "wrap",
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
