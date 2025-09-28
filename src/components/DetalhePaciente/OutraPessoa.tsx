import React, { useState, useEffect, createRef } from "react";
import { StyleSheet, View, Text, Modal, Dimensions } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { TextInputMask } from "react-native-masked-text";
import RNPickerSelect from "react-native-picker-select";
import { AntDesign } from "@expo/vector-icons";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";

interface Paciente {
  id_paciente: string;
  cidade: string;
  cpf: string;
  email: string;
  genero: string;
  nascimento: string;
  nome: string;
  telefone: string;
}

interface Erro {
  error: boolean;
  message: string;
}

interface ErrorMessage {
  nome: Erro;
  telefone: Erro;
  genero: Erro;
  nascimento: Erro;
  email: Erro;
}

interface Props {
  infoNovoPaciente: Paciente;
  setInfoNovoPaciente: React.Dispatch<React.SetStateAction<Paciente>>;
  error: ErrorMessage;
  setError: React.Dispatch<React.SetStateAction<ErrorMessage>>;
}

export default function SecondSelected({
  infoNovoPaciente,
  setInfoNovoPaciente,
  error,
  setError,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleChange = (value, type) => {
    setInfoNovoPaciente((state) => ({ ...state, [type]: value }));
    setError((state) => ({
      ...state,
      [type]: { error: false, message: "" },
    }));
  };

  return (
    <View style={styles.info}>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
      ></Modal>

      <Text style={styles.infoText}>
        Por favor, informe as seguintes informações
      </Text>

      <Text style={styles.titleText}>Nome completo</Text>
      <TextInput
        placeholder="Entre com seu nome completo"
        placeholderTextColor={Colors.softGray}
        style={styles.input}
        onChangeText={(name) => handleChange(name, "nome")}
        value={infoNovoPaciente.nome}
      />
      {error.nome.error && (
        <View style={styles.requiredContainer}>
          <AntDesign name="exclamationcircleo" size={14} color={Colors.red} />
          <Text style={styles.textRequired}>{error.nome.message}</Text>
        </View>
      )}

      <Text style={styles.titleText}>Celular</Text>
      <TextInputMask
        type={"cel-phone"}
        options={{
          maskType: "BRL",
          withDDD: true,
          dddMask: "(99) ",
        }}
        value={infoNovoPaciente.telefone}
        includeRawValueInChangeText
        onChangeText={(maskedPhone, phone) => handleChange(phone, "telefone")}
        placeholder={"(__)______-______"}
        placeholderTextColor={Colors.softGray}
        maxLength={15}
        style={styles.maskInput}
      />

      {error.telefone.error && (
        <View style={styles.requiredContainer}>
          <AntDesign name="exclamationcircleo" size={14} color={Colors.red} />
          <Text style={styles.textRequired}>{error.telefone.message}</Text>
        </View>
      )}

      <View style={styles.grid}>
        <View>
          <Text style={styles.titleTextGenero}>Gênero</Text>
          <RNPickerSelect
            placeholder={{
              label: "Selecione",
              value: null,
              color: Colors.black,
            }}
            onValueChange={(genero) => handleChange(genero, "genero")}
            items={[
              { label: "Feminino", value: "Feminino", color: "black" },
              { label: "Masculino", value: "Masculino" },
            ]}
            style={{
              ...pickerSelectStyles,
              placeholder: {
                color: Colors.softGray,
                fontSize: 18,
              },
              iconContainer: {
                top: 12,
                right: 2,
              },
            }}
            Icon={() => {
              return (
                <AntDesign name="down" size={15} color="rgba(0, 0, 0, 0.3)" />
              );
            }}
            useNativeAndroidPickerStyle={false}
            value={infoNovoPaciente.genero}
          />
          {error.genero.error && (
            <View style={styles.requiredContainer}>
              <AntDesign
                name="exclamationcircleo"
                size={14}
                color={Colors.red}
              />
              <Text style={styles.textRequired}>{error.genero.message}</Text>
            </View>
          )}
        </View>

        <View>
          <Text style={styles.titleText}>Data de nascimento</Text>
          <TextInputMask
            type={"datetime"}
            options={{
              format: "DD/MM/YYYY",
            }}
            value={infoNovoPaciente.nascimento}
            onChangeText={(nascimento) =>
              handleChange(nascimento, "nascimento")
            }
            placeholder={"DD/MM/AAAA"}
            placeholderTextColor={Colors.softGray}
            style={styles.dateInput}
          />
          {error.nascimento.error && (
            <View style={styles.requiredContainer}>
              <AntDesign
                name="exclamationcircleo"
                size={14}
                color={Colors.red}
              />
              <Text style={styles.textRequired}>
                {error.nascimento.message}
              </Text>
            </View>
          )}
        </View>
      </View>
      <Text style={styles.titleText}>Email</Text>
      <TextInput
        placeholder="Entre com o e-mail (opcional)"
        placeholderTextColor={Colors.softGray}
        style={styles.input}
        keyboardType="email-address"
        autoCompleteType="email"
        value={infoNovoPaciente.email}
        onChangeText={(value) => handleChange(value, "email")}
      />
      {error.email.error && (
        <View style={styles.requiredContainer}>
          <AntDesign name="exclamationcircleo" size={14} color={Colors.red} />
          <Text style={styles.textRequired}>{error.email.message}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    justifyContent: "center",
    alignContent: "center",
    marginTop: 3,
    paddingTop: 20,
    paddingBottom: 20,
    width: "100%",
    backgroundColor: Colors.white,
  },

  infoText: {
    fontSize: 16,
    lineHeight: 19,
    color: "black",
    fontFamily: Fonts.regular,

    marginBottom: 20,
  },

  titleText: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: Fonts.regular,
    color: Colors.black,
    opacity: 0.5,
  },

  titleTextGenero: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: Fonts.regular,
    marginBottom: 2.8,
    color: Colors.black,
    opacity: 0.5,
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",

    width: screenWidth - 40,
    paddingBottom: 8,
    marginTop: 5,
    marginBottom: 16,

    fontSize: 18,
    lineHeight: 21,
    fontFamily: Fonts.regular,
  },

  maskInput: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",

    width: screenWidth - 40,
    paddingTop: 8,
    paddingBottom: 5,
    marginBottom: 16,

    fontSize: 18,
    lineHeight: 21,
    fontFamily: Fonts.regular,
  },

  dateInput: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",

    width: (screenWidth / 2) - 50,
    paddingTop: 8,
    paddingBottom: 5,
    marginBottom: 10,

    fontSize: 18,
    lineHeight: 21,
    fontFamily: Fonts.regular,
  },

  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  requiredContainer: {
    maxWidth: 600,
    flexDirection: "row",
    // backgroundColor: Colors.red,
    marginBottom: 10,
  },

  textRequired: {
    fontFamily: Fonts.bold,
    fontStyle: "normal",
    fontSize: 16,
    lineHeight: 19,
    marginLeft: 5,
    color: Colors.red,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 18,
    lineHeight: 21,
    fontFamily: Fonts.regular,

    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",

    color: "black",

    width: (screenWidth / 2) - 50,
    paddingTop: 5,
    paddingBottom: 5, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 18,
    lineHeight: 21,
    fontFamily: Fonts.regular,

    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",

    color: "black",
    marginBottom: 10,

    width: (screenWidth / 2) - 50,
    paddingTop: 5,
    paddingBottom: 5, // to ensure the text is never behind the icon
  },
});
