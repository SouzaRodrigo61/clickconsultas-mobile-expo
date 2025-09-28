import React, { useState, useEffect } from "react";
import api from "../services/api.js";

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import { formatPhoneNumber } from "../scripts/formatters";
import Fonts from "../styles/Fonts";
import Colors from "../styles/Colors";
import moment from "moment";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function SolicitarAlteracao({ route }) {
  const [loading, setLoading] = useState(true);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [consulta, setConsulta] = useState<any>({});

  const navigation = useNavigation();

  function handleNavigateToHome() {
    navigation.navigate("Home");
  }

  function handleNavigateToSolicitarAlteracaoAceitar() {
    navigation.navigate("SolicitarAlteracaoAceitar");
  }

  function handleNavigateToSolicitarAlteracaoRecusar() {
    navigation.navigate("SolicitarAlteracaoRecusar");
  }

  const handleAccept = async () => {
    setLoadingAccept(true);
    await api.put(`/consult/confirmar/${route.params.idConsulta}`).then(() => {
      handleNavigateToSolicitarAlteracaoAceitar();
    });
    setLoadingAccept(false);
  };

  const handleCancel = async () => {
    setLoadingCancel(true);
    await api.put(`/consult/cancelar/${route.params.idConsulta}`).then(() => {
      handleNavigateToSolicitarAlteracaoRecusar();
    });
    setLoadingCancel(false);
  };

  const fetch = async () => {
    setLoading(true);
    await api
      .get(`/pacientes/reschedule-detail/${route.params.idConsulta}`)
      .then(({ data: consulta }) => {
        setConsulta(consulta);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#2fa8d5" size="large" />
        </View>
      ) : (
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <View style={styles.doctorContent}>
                <Text style={styles.title}>
                  O médico solicitou uma alteração na sua consulta:
                </Text>

                <View style={styles.card}>
                  <AntDesign name="user" size={18} color="#111111" />
                  <View>
                    <Text style={styles.bold}>
                      Dr(a). {consulta.nome_completo}
                    </Text>
                    <Text style={styles.text}>
                      {consulta.especialidade.nome}
                    </Text>
                  </View>
                </View>
              </View>

              <View>
                <Text style={styles.title}>Detalhes antigos</Text>

                <View style={styles.cardAntigo}>
                  <View style={styles.grid}>
                    <Feather name="user" size={18} color="#2A3748" />
                    <Text style={styles.text}>
                      {consulta.nome_paciente}
                    </Text>
                  </View>
                  <View style={styles.grid}>
                    <Feather name="calendar" size={18} color="#2A3748" />
                    <Text style={styles.text}>
                      {moment(consulta.data_consulta).format(
                        "DD [de] MMM[.] YYYY[, às] HH[h]mm"
                      )}
                    </Text>
                  </View>
                  <View style={styles.grid}>
                    <Feather name="map-pin" size={18} color="#2A3748" />
                    <Text style={styles.text}>
                      {`${consulta.rua}, ${consulta.numero}, ${consulta.bairro}, ${consulta.cidade}, ${consulta.cep}`}
                    </Text>
                  </View>
                  <View style={styles.grid}>
                    <AntDesign name="phone" size={18} color="#2A3748" />
                    {consulta.telefone_fixo?.trim() !== "" && (
                      <Text style={styles.text}>
                        {formatPhoneNumber(consulta.telefone_fixo)}
                      </Text>
                    )}

                    {consulta.telefone_cel?.trim() !== "" && (
                      <Text style={styles.text}>
                        {formatPhoneNumber(consulta.telefone_cel)}
                      </Text>
                    )}
                  </View>
                </View>

                <Text style={styles.title}>Detalhes novos</Text>

                <View style={styles.cardNovo}>
                  <View style={styles.grid}>
                    <Feather name="user" size={18} color="#2A3748" />
                    <Text style={styles.text}>
                      {consulta.nome_paciente}
                    </Text>
                  </View>
                  <View style={styles.grid}>
                    <Feather name="calendar" size={18} color="#2A3748" />
                    <Text style={styles.text}>
                      {" "}
                      {moment(consulta.nova_data_consulta).format(
                        "DD [de] MMM[.] YYYY[, às] HH[h]mm"
                      )}
                    </Text>
                  </View>
                  <View style={styles.grid}>
                    <Feather name="map-pin" size={18} color="#2A3748" />
                    <Text style={styles.text}>
                      {`${consulta.endereco_remarcacao.rua}, ${consulta.endereco_remarcacao.numero}, ${consulta.endereco_remarcacao.bairro}, ${consulta.endereco_remarcacao.cidade}, ${consulta.endereco_remarcacao.cep}`}
                    </Text>
                  </View>
                  <View style={styles.grid}>
                    <AntDesign name="phone" size={18} color="#2A3748" />
                    {consulta.endereco_remarcacao.telefone_fixo?.trim() !==
                      "" && (
                        <Text style={styles.text}>
                          {formatPhoneNumber(
                            consulta.endereco_remarcacao.telefone_fixo
                          )}
                        </Text>
                      )}

                    {consulta.endereco_remarcacao.telefone_cel?.trim() !==
                      "" && (
                        <Text style={styles.text}>
                          {formatPhoneNumber(
                            consulta.endereco_remarcacao.telefone_cel
                          )}
                        </Text>
                      )}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <RectButton style={styles.blueButton} onPress={handleAccept}>
              {loadingAccept ? (
                <ActivityIndicator color="white" size="large" />
              ) : (
                <Text style={styles.blueButtonText}>Aceitar Alteração</Text>
              )}
            </RectButton>

            <RectButton style={styles.whiteButton} onPress={handleCancel}>
              {loadingCancel ? (
                <ActivityIndicator color={Colors.red} size="large" />
              ) : (
                <Text style={styles.whiteButtonText}>Cancelar Consulta</Text>
              )}
            </RectButton>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    width: screenWidth - 40,
  },

  doctorContent: {
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(42, 55, 72, 0.1)",
  },

  title: {
    fontSize: 15,
    lineHeight: 25,
    fontFamily: Fonts.bold,

    color: "#2A3748",

    marginBottom: 10,
  },

  text: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: Fonts.regular,

    color: "#2A3748",
    marginBottom: 13,
    marginLeft: 14,
  },

  bold: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: Fonts.bold,

    color: "#2A3748",
    marginLeft: 14,
  },

  grid: {
    flexDirection: "row",
  },

  icon: {
    marginRight: 14,
  },

  card: {
    backgroundColor: Colors.white,
    borderColor: "#DEDEDE",
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    paddingBottom: 3,
    marginBottom: 20,
    flexDirection: "row",
  },

  cardAntigo: {
    backgroundColor: "#FCFCFC",
    borderColor: "#DEDEDE",
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    paddingBottom: 3,
    marginBottom: 20,
  },

  cardNovo: {
    backgroundColor: "#E6FAEB",
    borderColor: "#37D363",
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    paddingBottom: 3,
    marginBottom: 20,
  },

  buttonContainer: {
    borderTopWidth: 2,
    borderTopColor: "rgba(42, 55, 72, 0.1)",

    width: screenWidth,
    alignItems: "center",
  },

  blueButton: {
    backgroundColor: Colors.blue,
    height: 50,
    width: screenWidth - 40,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    marginBottom: 10,
  },

  blueButtonText: {
    fontSize: 16,
    lineHeight: 19,
    fontFamily: Fonts.bold,

    color: Colors.white,
  },

  whiteButton: {
    backgroundColor: Colors.white,
    height: 50,
    width: screenWidth - 40,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  whiteButtonText: {
    fontSize: 16,
    lineHeight: 19,
    fontFamily: Fonts.bold,

    color: Colors.red,
  },
});
