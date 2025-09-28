import moment from "moment";
import React from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  Dimensions 
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { TextInputMask } from "react-native-masked-text";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface Data {
  paciente: {
    cidade: string;
    cpf: string;
    email: string;
    genero: string;
    nascimento: string;
    nome: string;
    telefone: string;
  };
}

export default function FirstSelected({ paciente }: Data) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoText}>
        Por favor, informe as seguintes informações
      </Text>

      <Text style={styles.titleText}>Nome completo</Text>
      <Text style={styles.text}>{paciente.nome}</Text>

      <Text style={styles.titleText}>Celular</Text>
      <TextInputMask
        style={{ ...styles.text, color: Colors.black }}
        type={"cel-phone"}
        options={{
          maskType: "BRL",
          withDDD: true,
          dddMask: "(99) ",
        }}
        value={paciente.telefone}
        editable={false}
      />

      <View style={styles.grid}>
        <View>
          <Text style={styles.titleText}>Gênero</Text>
          <Text style={styles.gridText}>
            {paciente.genero === null ? (
              <>
                <Text style={styles.textNull}>Sem gênero cadastrado</Text>
              </>
            ) : (
              <>
                <Text>{paciente.genero}</Text>
              </>
            )}
          </Text>
        </View>

        <View>
          <Text style={styles.titleText}>Data de nascimento</Text>
          <Text style={styles.gridText}>
            {paciente.nascimento === null ? (
              <>
                <Text style={styles.textNull}>Sem data cadastrada</Text>
              </>
            ) : (
              <>
                <Text>{moment(paciente.nascimento).format("DD/MM/YYYY")}</Text>
              </>
            )}
          </Text>
        </View>
      </View>

      <Text style={styles.titleText}>Email</Text>
      <TextInput
        placeholder="Entre com seu e-mail (opcional)"
        placeholderTextColor={Colors.softGray}
        value={paciente.email}
        style={styles.input}
        keyboardType="email-address"
      />
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
  text: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    width: screenWidth-40,
    paddingTop: 12,
    paddingBottom: 8,
    marginBottom: 16,
    fontSize: 18,
    lineHeight: 21,
    fontFamily: Fonts.regular,
  },
  gridText: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    width: (screenWidth/2)-45,
    paddingTop: 12,
    paddingBottom: 8,
    marginBottom: 16,
    fontSize: 18,
    lineHeight: 21,
    fontFamily: Fonts.regular,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    width: screenWidth-4,
    paddingBottom: 8,
    marginBottom: 16,
    fontSize: 18,
    lineHeight: 21,
    marginTop: 5,
    fontFamily: Fonts.regular,
  },

  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  textNull: {
    color: Colors.red,
  },
});
