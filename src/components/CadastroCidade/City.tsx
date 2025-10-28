import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
import { Picker } from "@react-native-picker/picker";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface CityProps {
  setCidade: any;
  initialUf?: string;
  initialCity?: string;
}

export default function City({ setCidade, initialUf = "", initialCity = "" }: CityProps) {
  const [cities, setCities] = useState([] as any);
  const [ufs, setUfs] = useState([] as any);
  const [pickerCity, setPickerCity] = useState(initialCity as any);
  const [pickerUf, setPickerUf] = useState(initialUf as any);
  const [enableCityPicker, setEnableCityPicker] = useState(!!initialUf);

  // Inicializar valores quando receber props
  useEffect(() => {
    console.log('City: Inicializando com valores:', { initialUf, initialCity });
    
    if (initialUf && initialUf !== "") {
      console.log('City: Definindo UF inicial:', initialUf);
      setPickerUf(initialUf);
      setEnableCityPicker(true);
      
      // Carregar cidades para o UF inicial
      console.log('City: Carregando cidades para UF inicial:', initialUf);
      axios
        .get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${initialUf}/municipios`)
        .then((resp) => {
          const sortedCities = [...resp.data.sort((a, b) => a.nome.localeCompare(b.nome))];
          console.log('City: Cidades carregadas para UF inicial:', sortedCities.length);
          setCities(sortedCities);
          
          // Definir cidade inicial após carregar as cidades
          if (initialCity && initialCity !== "") {
            console.log('City: Definindo cidade inicial:', initialCity);
            setPickerCity(initialCity);
          }
        }).catch(error => {
          console.error('City: Erro ao carregar cidades para UF inicial:', error);
        });
    } else if (initialCity && initialCity !== "") {
      // Se só tem cidade mas não tem UF, tentar inferir
      console.log('City: Apenas cidade inicial fornecida:', initialCity);
      setPickerCity(initialCity);
    }
  }, [initialUf, initialCity]);

  useEffect(() => {
    console.log('City: Carregando UFs...');
    axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados").then((resp) => {
      const sortedUfs = [...resp.data.sort((a, b) => a.sigla.localeCompare(b.sigla))];
      console.log('City: UFs carregadas:', sortedUfs.length);
      setUfs(sortedUfs);
    }).catch(error => {
      console.error('City: Erro ao carregar UFs:', error);
    });
  }, []);

  useEffect(() => {
    if (pickerUf && pickerUf !== "") {
      console.log('City: Carregando cidades para UF:', pickerUf);
      axios
        .get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${pickerUf}/municipios`)
        .then((resp) => {
          const sortedCities = [...resp.data.sort((a, b) => a.nome.localeCompare(b.nome))];
          console.log('City: Cidades carregadas:', sortedCities.length);
          setCities(sortedCities);
        }).catch(error => {
          console.error('City: Erro ao carregar cidades:', error);
        });
    } else {
      console.log('City: Limpando cidades');
      setCities([]);
    }
  }, [pickerUf]);

  useEffect(() => {
    console.log('City: Atualizando cidade selecionada:', [pickerUf, pickerCity]);
    setCidade([pickerUf, pickerCity]);
  }, [pickerCity, pickerUf]);

  function handleUf(itemValue) {
    console.log('City: UF selecionada:', itemValue);
    setPickerUf(itemValue);
    setPickerCity(""); // Limpar cidade quando mudar UF
    if (itemValue && itemValue !== "") {
      setEnableCityPicker(true);
    } else {
      setEnableCityPicker(false);
    }
  }

  function handleCity(itemValue) {
    console.log('City: Cidade selecionada:', itemValue);
    setPickerCity(itemValue);
  }

  console.log('City: Renderizando com UFs:', ufs.length, 'Cidades:', cities.length);
  console.log('City: Estado atual - pickerUf:', pickerUf, 'pickerCity:', pickerCity, 'enableCityPicker:', enableCityPicker);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        
        <View style={styles.pickersContainer}>
          {/* Picker de UF */}
          <View style={styles.pickerWrapper}>
            <Text style={styles.label}>Estado (UF):</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={pickerUf}
                onValueChange={handleUf}
                style={styles.picker}
              >
                <Picker.Item label="Selecione o estado" value="" />
                {ufs.map((uf) => (
                  <Picker.Item key={uf.sigla} label={uf.sigla} value={uf.sigla} />
                ))}
              </Picker>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={20}
                color="black"
                style={styles.pickerIcon}
              />
            </View>
          </View>

          {/* Picker de Cidade */}
          <View style={styles.pickerWrapper}>
            <Text style={styles.label}>Cidade:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={pickerCity}
                onValueChange={handleCity}
                style={[styles.picker, !enableCityPicker && styles.pickerDisabled]}
                enabled={enableCityPicker}
              >
                <Picker.Item label="Selecione a cidade" value="" />
                {cities.map((city) => (
                  <Picker.Item key={city.nome} label={city.nome} value={city.nome} />
                ))}
              </Picker>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={20}
                color={enableCityPicker ? "black" : "#ccc"}
                style={styles.pickerIcon}
              />
            </View>
          </View>
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {pickerUf && pickerCity ? 
              `Selecionado: ${pickerCity} - ${pickerUf}` : 
              'Selecione um estado e uma cidade'
            }
          </Text>
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
    height: screenHeight / 2.5,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 20,
  },
  pickersContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  pickerWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.black,
    marginBottom: 8,
    fontWeight: '600',
  },
  pickerContainer: {
    position: 'relative',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
    color: 'black',
    fontSize: 16,
  },
  pickerDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  pickerIcon: {
    position: 'absolute',
    right: 12,
    top: 15,
  },
  statusContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statusText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.black,
    textAlign: 'center',
  },
});