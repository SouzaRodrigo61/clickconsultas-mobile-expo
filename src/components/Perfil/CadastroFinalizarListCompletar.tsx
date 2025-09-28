import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";

interface CadastroFinalizarListProps {
  onPress: () => void;
  title: string;
  text: string;
}
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function CadastroFinalizarList({
  onPress,
  title,
  text,
}: CadastroFinalizarListProps) {
  return (
    <View style={styles.list}>
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>{title}</Text>
          <Text style={styles.listText}>{text}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    width: "100%",

    height: 50,

    alignItems: "center",
    justifyContent: "center",

    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },

  listContainer: {
    flexDirection: "row",
    width: screenWidth,
    height: 50,
    paddingLeft: 30,
    paddingRight: 30,
    alignItems: "center",
    justifyContent: "space-between",
  },
  listTitle: {
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    fontSize: 16,

    color: Colors.black,
    opacity: 0.45,
  },
  listText: {
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    fontSize: 16,

    color: Colors.blue,
  },
});
