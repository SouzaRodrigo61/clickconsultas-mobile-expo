import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface ArrowLeftIconProps {
  colorIcon: string;
}

export default function ArrowLeft({ colorIcon }: ArrowLeftIconProps) {
  const navigation = useNavigation();

  return (
    <RectButton style={styles.buttoncontainer} onPress={() => navigation.goBack()}>
      <AntDesign name="arrowleft" size={19.5} color={colorIcon} />
    </RectButton>
  );
}

const styles = StyleSheet.create({
  buttoncontainer: {
    justifyContent: "center",
    marginLeft: 24,
    padding: 4
  }
});
