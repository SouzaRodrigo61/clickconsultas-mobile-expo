import React, { useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Button, ButtonGroup } from "@rneui/themed";

import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface GenderProps {
  setGenero: any;
  gender: string;
}

export default function Gender({ setGenero, gender }: GenderProps) {
  const buttons = ["Masculino", "Feminino"];
  const [selectedIndex, setselectedIndex] = useState(buttons.indexOf(gender));

  function handleUpdateIndex(index: any) {
    setselectedIndex(index);
    setGenero(buttons[index]);
  }

  return (
    <View style={styles.container}>
      <ButtonGroup
        buttons={buttons}
        containerStyle={{
          width: screenWidth - 40,
          maxWidth: 600,
          height: 40,
          borderColor: Colors.softGray,
          borderWidth: 2
        }}
        buttonStyle={{
          opacity: 1
        }}
        textStyle={{
          fontFamily: Fonts.bold,
          fontSize: 16,
          lineHeight: 19,
          textTransform: "uppercase",
          color: Colors.black,
          opacity: 0.25
        }}
        innerBorderStyle={{
          width: 2,
          color: Colors.softGray
        }}
        selectedButtonStyle={{
          backgroundColor: Colors.blue
        }}
        selectedTextStyle={{
          color: Colors.white,
          opacity: 1
        }}
        onPress={handleUpdateIndex}
        selectedIndex={selectedIndex}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    width: screenWidth,
    height: screenHeight / 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white
  },
  text: {
    fontFamily: Fonts.bold,
    fontStyle: "normal",
    fontSize: 14,
    lineHeight: 16,
    textTransform: "uppercase",
    color: Colors.black,
    opacity: 0.4
  }
});
