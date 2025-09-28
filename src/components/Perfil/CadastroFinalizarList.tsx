import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
interface CadastroFinalizarListProps {
  onPress: () => void;
  title: string;
  text: string;
  editable?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function CadastroFinalizarList({
  onPress,
  title,
  text,
  editable = true,
}: CadastroFinalizarListProps) {
  return (
    <View style={styles.list}>
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>{title}</Text>
          <View style={styles.group}>
            <Text style={styles.listText}>{text}</Text>
            {editable && (
              <MaterialIcons
                name="edit"
                size={16}
                style={{
                  marginLeft: 16,
                  opacity: 0.45,
                }}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  list: {
    width: "100%",

    minHeight: 50,
    padding: 5,

    alignItems: "center",
    justifyContent: "center",

    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },

  listContainer: {
    flexDirection: "row",
    width: screenWidth - 60,
    justifyContent: "space-between",
  },
  listTitle: {
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    fontSize: 16,
    marginRight: 15,
    alignSelf: "center",

    color: Colors.black,
    opacity: 0.45,
    width: 0,
    flexGrow: 0.5,
  },
  listText: {
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    fontSize: 16,
    textAlign: "right",

    color: Colors.black,
  },
});
