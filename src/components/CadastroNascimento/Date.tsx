import React, { useState } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import "moment/locale/pt-br";
import { RectButton } from "react-native-gesture-handler";

import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
interface DateProps {
  data: any;
  setData: any;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Date({ data, setData }: DateProps) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateDisplay, setDateDisplay] = useState(moment(data).clone());

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    setDateDisplay(date);
    setData(date);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      {/* WARNING ISSUE https://github.com/mmazzarolo/react-native-modal-datetime-picker/issues/502 */}
      <RectButton style={styles.buttoncontainer} onPress={showDatePicker}>
        <View style={styles.datecontainer}>
          <Text style={styles.text}>{moment(dateDisplay).format("DD")}</Text>
        </View>
        <View style={styles.datecontainer}>
          <Text style={styles.text}>{moment(dateDisplay).format("MMM")}</Text>
        </View>
        <View style={styles.datecontainer}>
          <Text style={styles.text}>{moment(dateDisplay).format("YYYY")}</Text>
        </View>
      </RectButton>
      <DateTimePickerModal
        mode="date"
        isVisible={isDatePickerVisible}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        onDateChange={setData}
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
    backgroundColor: Colors.white,
  },
  datecontainer: {
    justifyContent: "center",
    margin: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.softGray,
    width: 68,
    height: 44,
  },
  text: {
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: 21,
    color: Colors.black,
    textTransform: "uppercase",
    opacity: 0.8,
    textAlign: "center",
  },
  buttoncontainer: {
    flexDirection: "row",
    width: 280,
    height: 60,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
