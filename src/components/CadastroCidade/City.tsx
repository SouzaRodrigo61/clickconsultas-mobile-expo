import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
import { Picker } from "@react-native-picker/picker";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface CityProps {
  setCidade: any;
}

export default function City({ setCidade }: CityProps) {
  const [cities, setCities] = useState([] as any);
  const [ufs, setUfs] = useState([] as any);
  const [pickerCity, setPickerCity] = useState("" as any);
  const [pickerUf, setPickerUf] = useState("" as any);
  const [enableCityPicker, setEnableCityPicker] = useState(false);

  useEffect(() => {
    axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados").then((resp) => {
      setUfs([...resp.data.sort((a, b) => a.sigla.localeCompare(b.sigla))]);
    });
  }, []);

  useEffect(() => {
    axios
      .get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${pickerUf}/municipios`)
      .then((resp) => {
        setCities([...resp.data.sort((a, b) => a.nome.localeCompare(b.nome))]);
      });
  }, [pickerUf]);

  useEffect(() => {
    setCidade([pickerUf, pickerCity]);
  }, [pickerCity]);

  function handleUf(itemValue) {
    setPickerUf(itemValue);
    if (pickerUf !== undefined) {
      setEnableCityPicker(true);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={pickerUf}
            onValueChange={handleUf}
            style={styles.picker}
          >
            <Picker.Item label="UF" value="" />
            {ufs.map((uf) => (
              <Picker.Item key={uf.sigla} label={uf.sigla} value={uf.sigla} />
            ))}
          </Picker>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={20}
            color="black"
            style={styles.pickerIcon}
          />
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={pickerCity}
            onValueChange={(itemValue) => setPickerCity(itemValue)}
            style={[styles.picker, styles.cityPicker]}
            enabled={enableCityPicker}
          >
            <Picker.Item label="Cidade" value="" />
            {cities.map((city) => (
              <Picker.Item key={city.nome} label={city.nome} value={city.nome} />
            ))}
          </Picker>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={20}
            color="black"
            style={styles.pickerIcon}
          />
        </View>
      </View>
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
    padding: 20
  },
  grid: {
    flexDirection: "row",
    width: screenWidth - 40,
    maxWidth: 600,
    height: 65,
    borderColor: Colors.softGray,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: "center",
    padding: 5
  },
  text: {
    fontFamily: Fonts.light,
    fontSize: 14,
    lineHeight: 16.41,
    color: "rgba(0,0,0,0)",
    marginLeft: 8,
    marginRight: 4,
    textAlign: "right"
  },
  onePickerItemUf: {
    height: 50,
    width: (screenWidth - 40) / 3,
    maxWidth: 200,
    color: "black",
    margin: 0
  },
  onePickerItemCity: {
    height: 50,
    width: ((screenWidth - 40) / 3) * 2,
    maxWidth: 330,
    color: "black",
    margin: 0
  },
  pickerContainer: {
    height: 50,
    justifyContent: 'center',
    position: 'relative',
  },
  picker: {
    height: 50,
    color: 'black',
    fontSize: 16,
  },
  cityPicker: {
    width: ((screenWidth - 60) / 3) * 2,
  },
  pickerIcon: {
    position: 'absolute',
    right: 8,
    top: 15,
    transform: [{ rotate: '90deg' }],
  },
});
