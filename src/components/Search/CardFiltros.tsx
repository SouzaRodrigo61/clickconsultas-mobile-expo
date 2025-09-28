import React, { useState } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface onPressProps {
  press: any;
  filter: string;
  color?: "default" | "white";
}

export default function CardFiltros({ press, filter, color = "default" }: onPressProps) {
  const fontColor = color == "default" ? Colors.white : Colors.black;

  return (
    <View style={styles.container}>
      <View
        style={{
          ...styles.buttonContainer,
          ...styles[color]
        }}
      >
        <RectButton style={{ ...styles.button }} onPress={press}>
          <Text style={{ ...styles.textButton, color: fontColor }}>{filter}</Text>
          <AntDesign name="caretdown" size={9} color={fontColor} />
        </RectButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    backgroundColor: Colors.smokeWhite,
    alignItems: "center",
    borderRadius: 25,
    paddingBottom: 5,
    alignSelf: "center"
  },
  buttonContainer: {
    minWidth: 153,
    minHeight: 35,
    padding: 3,
    borderRadius: 25,
    backgroundColor: Colors.blue,
    alignItems: "center"
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    height: 35
  },
  textButton: {
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    borderRadius: 25,
    // fontSize: 14,
    // lineHeight: 17,
    textAlignVertical: "center",
    marginRight: 10
  },
  default: {
    backgroundColor: Colors.blue,
    borderWidth: 0.5,
    borderColor: Colors.white
  },
  white: {
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.smokeWhite
  }
});
