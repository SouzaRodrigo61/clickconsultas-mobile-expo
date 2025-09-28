import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

import HomeIcon from "./icons/Home";
import CalendarIcon from "./icons/Calendar";
import UserIcon from "./icons/User";

import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface SelectedProps {
  setSelected: any;
}

export default function NavBar({ setSelected }: SelectedProps) {
  const [select, setSelect] = useState<any>(setSelected);

  const navigation = useNavigation();

  function handleNavigateToHome() {
    navigation.navigate("Home");
  }
  function handleNavigateToCompromissos() {
    navigation.navigate("Compromissos");
  }
  function handleNavigateToPerfil() {
    navigation.navigate("Perfil");
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconscontainer}>
        <RectButton style={styles.iconcontainer} onPress={handleNavigateToHome}>
          <HomeIcon
            colorIcon={select[0] === 1 ? Colors.blue : Colors.gray}
            sizeIcon={20}
          />
          <Text
            style={
              select[0] === 1
                ? { ...styles.text, color: Colors.blue }
                : { ...styles.text, color: Colors.gray }
            }
          >
            Inicio
          </Text>
        </RectButton>
        <RectButton
          style={styles.iconcontainer}
          onPress={handleNavigateToCompromissos}
        >
          <CalendarIcon
            colorIcon={select[1] === 1 ? Colors.blue : Colors.gray}
            sizeIcon={20}
          />
          <Text
            style={
              select[1] === 1
                ? { ...styles.text, color: Colors.blue }
                : { ...styles.text, color: Colors.gray }
            }
          >
            Compromissos
          </Text>
        </RectButton>
        <RectButton
          style={styles.iconcontainer}
          onPress={handleNavigateToPerfil}
        >
          <UserIcon
            colorIcon={select[2] === 1 ? Colors.blue : Colors.gray}
            sizeIcon={20}
          />
          <Text
            style={
              select[2] === 1
                ? { ...styles.text, color: Colors.blue }
                : { ...styles.text, color: Colors.gray }
            }
          >
            Perfil
          </Text>
        </RectButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // position:'absolute',
    // left:0,
    // bottom:0,
    // right:0,
    width: screenWidth,
    height: 60,
    justifyContent: "flex-end",
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: "rgba(167, 187, 194, 0.2)",
  },
  iconscontainer: {
    flex: 1,
    flexDirection: "row",
  },
  iconcontainer: {
    justifyContent: "center",
    alignItems: "center",
    width: screenWidth / 3,
  },
  text: {
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    fontSize: 12,
    lineHeight: 14,
    color: Colors.gray,
    marginBottom: 8,
  },
});
