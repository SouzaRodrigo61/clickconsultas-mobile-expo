import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from "react-native";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface Props {
  press: any;
  enderecoSelecionado: any;
  index: number;
  loading: boolean;
  pagamento: boolean;
  endereco: boolean;
}

export default function CardAlternarEndereco({
  press,
  enderecoSelecionado,
  index,
  loading,
  pagamento,
  endereco
}: Props) {
  const navigation = useNavigation();

  function handleMultiplesEnderecos() {
    navigation.navigate("MultiplosEnderecos");
  }

  return (
    <View style={styles.container}>
      <View style={{ opacity: pagamento ? 1 : 0.4 }}>
        <Text style={styles.textTitle}>Alterar endereço</Text>
        <View style={styles.containerEndereco}>
          <MaterialIcons name="location-pin" size={24} color={Colors.blue} />
          {loading ? (
            <ActivityIndicator size="small" color={Colors.blue} />
          ) : (
            <TouchableOpacity activeOpacity={0.7} disabled={!pagamento} onPress={press}>
              {endereco ? (
                <Text style={styles.textEndereco}>
                  {enderecoSelecionado[index].rua}, {enderecoSelecionado[index].numero},{" "}
                  {enderecoSelecionado[index].bairro} - {enderecoSelecionado[index].cidade},{" "}
                  {enderecoSelecionado[index].uf} - {enderecoSelecionado[index].cep}
                </Text>
              ) : (
                <Text style={styles.textEndereco}>Selecione o endereço</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: screenWidth - 20,
    borderWidth: 1.5,
    borderRadius: 4,
    backgroundColor: Colors.white,
    borderColor: Colors.softGray,
    padding: 20,
    marginTop: 8,
    shadowColor: Colors.softGray,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0.4
  },

  textTitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 17,
    color: Colors.black
  },

  containerEndereco: {
    flexDirection: "row",
    marginTop: 7,
    alignItems: "center"
  },

  textEndereco: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    lineHeight: 22,
    marginLeft: 6,
    color: Colors.blue
  }
});
