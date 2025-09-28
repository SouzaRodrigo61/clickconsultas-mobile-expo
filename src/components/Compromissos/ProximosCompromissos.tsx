import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";

import Colors, { getColor } from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
import moment from "moment";
moment.locale("pt-BR");

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ProximosCompromissos({ compromissos = [] }: any) {
  const navigation = useNavigation();
  const [newCompromissos, setNewCompromissos] = useState<any[]>([]);

  useEffect(() => {
    if (compromissos.length > 0) {
      const sortedCompromissos = [...compromissos];

      sortedCompromissos.sort((a, b) => {
        const dateA = a.nova_data_consulta ?? a.data_consulta;
        const dateB = b.nova_data_consulta ?? b.data_consulta;

        return new Date(dateA).getTime() - new Date(dateB).getTime();
      });

      setNewCompromissos(sortedCompromissos);
    }
  }, [compromissos]);

  function handleNavigateToCompromissosResumoConsulta(
    idConsulta,
    isRemarcação?: false
  ) {
    if (isRemarcação) {
      return navigation.navigate("SolicitarAlteracao", { idConsulta });
    }
    return navigation.navigate("CompromissosResumoConsulta", { idConsulta });
  }

  return (
    <View style={styles.container}>
      {newCompromissos.length > 0 ? (
        newCompromissos.map((compromisso: any) => (
          <TouchableOpacity
            key={compromisso.id_consulta}
            style={styles.mainCardContent}
            activeOpacity={0.7}
            onPress={() =>
              handleNavigateToCompromissosResumoConsulta(
                compromisso.id_consulta,
                compromisso.is_remarcacao
              )
            }
          >
            <View style={{ width: 0, flexGrow: 1 }}>
              <View style={styles.gridMainCardDate}>
                <Feather
                  name="calendar"
                  size={20}
                  color="#111111"
                  style={{ marginRight: 12 }}
                />
                {/* 21 de jan. 2021 às 14h00 */}
                <Text style={styles.cardText}>
                  {compromisso.nova_data_consulta
                    ? moment(compromisso.nova_data_consulta).format(
                      "D [de] MMM[.] YYYY [às] HH[h]mm"
                    )
                    : moment(compromisso.data_consulta).format(
                      "D [de] MMM[.] YYYY [às] HH[h]mm"
                    )}
                </Text>
              </View>
              <View style={styles.gridMainCard}>
                <AntDesign
                  name="user"
                  size={20}
                  color="#111111"
                  style={{ marginRight: 12 }}
                />
                <Text style={styles.cardText}>
                  Dr(a). {compromisso.nome_completo}
                </Text>
              </View>
              <View style={styles.gridMainCard}>
                <View
                  style={{
                    height: 10,
                    width: 10,
                    backgroundColor: getColor(compromisso.status_consulta),
                    borderRadius: 25,
                    marginLeft: 7,
                  }}
                />
                <Text
                  style={{
                    ...styles.statusAgendado,
                    color: getColor(compromisso.status_consulta),
                  }}
                >
                  {compromisso.status_consulta}
                </Text>
              </View>
            </View>

            <AntDesign name="right" size={24} color="rgba(0, 0, 0, 0.7)" style={styles.button} />
          </TouchableOpacity>
        ))
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: screenHeight - 250,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              lineHeight: 18,
              fontFamily: Fonts.regular,
              textAlign: "center",

              opacity: 0.4,
              color: Colors.black,
            }}
          >
            Nenhum compromisso a ser exibido!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },

  mainCardContent: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,

    width: screenWidth - 40,
    padding: 20,
    marginBottom: 10,
    borderRadius: 4,
    flexWrap: "wrap",
  },

  imgDoctor: {
    marginRight: 12,
    width: 22,
    height: 22,
    borderRadius: 70 / 2,
  },

  gridMainCardDate: {
    flexDirection: "row",
    alignItems: "center",
  },

  gridMainCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  cardText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: Fonts.regular,

    color: Colors.black,
  },

  statusAgendado: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: Fonts.bold,

    color: "#37D363",

    marginLeft: 15,
  },

  statusSolicitado: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: Fonts.bold,

    color: "#FD9800",

    marginLeft: 15,
  },

  button: {
    alignSelf: 'center'
  },
});
