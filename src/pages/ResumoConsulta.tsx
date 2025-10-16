import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { RectButton, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { AntDesign, Feather } from "@expo/vector-icons";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { TextInputMask } from "react-native-masked-text";
import openMap from "react-native-open-maps";
import moment from "moment";
import "moment/locale/pt-br";

import api from "../services/api.js";

import { useNavigation } from "@react-navigation/native";

import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";
import DoctorHeader from "../components/DoctorHeader";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ResumoConsulta({ route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialRegion = {
    latitude: -23.1862746,
    longitude: -50.6573834,
    latitudeDelta: 0.01,
    longitudeDelta: 0.05
  };

  const navigation = useNavigation();

  function handleNavigateToHome() {
    navigation.navigate("Home");
  }

  function handleNavigateToCompromissos() {
    navigation.navigate("Compromissos");
  }

  function _goToMap() {
    //* latitude: initialRegion.latitude | longitude: initialRegion.longitude
    openMap({
      provider: "google",
      query: `${infoMedico.endereco.coordenadas.y}, ${infoMedico.endereco.coordenadas.x}`
    });
  }

  const defaultOptions = {
    significantDigits: 2,
    thousandsSeparator: ".",
    decimalSeparator: ",",
    symbol: "R$"
  };

  const currencyFormatter = (value, options = defaultOptions) => {
    if (typeof value !== "number") value = 0.0;
    options = { ...defaultOptions, ...options };
    value = value.toFixed(options.significantDigits);

    const [currency, decimal] = value.split(".");
    return `${options.symbol} ${currency.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      options.thousandsSeparator
    )}${options.decimalSeparator}${decimal}`;
  };

  const [infoMedico, setInfoMedico] = useState({
    conselho: "",
    estado: "",
    numeroRegistro: 0,
    nomeCompleto: "",
    is_active: false,
    is_pending: false,
    dataInclusao: new Date(),
    valor: 0.0,
    dom: false,
    seg: false,
    ter: false,
    qua: false,
    qui: false,
    sex: false,
    sab: false,
    from: "",
    to: "",
    duration: 0,
    experiencias: [{ titulo: "", descricao: "", ano: 0 }],
    formacoes: [{ instituicao: "", curso: "", ano: 0 }],
    especialidades: [{ especialidade: "", rqe: 0, favorita: false }],
    convenios: [""],
    endereco: {
      id_endereco: 0,
      rua: "",
      numero: 0,
      bairro: "",
      uf: "",
      cidade: "",
      cep: "",
      telefone_cel: "",
      telefone_fixo: "",
      coordenadas: {
        x: 0.0,
        y: 0.0
      },
      id_gerente: 0
    }
  });

  const fetch = async () => {
    setLoading(true);
    api
      .get(`/medicos/${route.params.dataResumoConsulta.id_medico}`)
      .then(({ data: medico }) => {
        setInfoMedico({
          ...medico,
          endereco: medico.enderecos[route.params.dataResumoConsulta.index]
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar resumo da consulta:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) fetch();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={Colors.blue} size="large" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Modal animationType="fade" transparent={true} visible={modalVisible}>
            <View style={styles.containermodal}>
              <View style={styles.modal}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <View style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseButtonText}>Fechar mapa</Text>
                    <AntDesign name="closecircle" size={20} color={Colors.blue} />
                  </View>
                </TouchableOpacity>

                <View style={styles.mapcontainer}>
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    toolbarEnabled={false}
                    onPress={_goToMap}
                    region={{
                      latitude: +infoMedico.endereco.coordenadas.y,
                      longitude: +infoMedico.endereco.coordenadas.x,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.05
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: +infoMedico.endereco.coordenadas.y,
                        longitude: +infoMedico.endereco.coordenadas.x
                      }}
                    />
                  </MapView>

                  <View style={styles.mapfooter}>
                    <Text style={styles.textMapFooter}>Toque no mapa para ver</Text>
                  </View>
                </View>
              </View>
            </View>
          </Modal>

          {/* <DoctorHeader /> */}

          <View style={styles.wrapper}>
            <View style={styles.width}>
              <View style={styles.grid}>
                <Feather
                  name="check-circle"
                  size={36}
                  color="#37D363"
                  style={{ marginRight: 12 }}
                />
                <View>
                  <Text style={styles.sendTitle}>Solicitação foi enviada com sucesso!</Text>
                  <Text style={styles.sendText}>Aguarde o contato do médico</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.wrapper}>
            <View style={styles.width}>
              <Text style={styles.titleText}>Data e horário</Text>
              <View style={styles.grid}>
                <Text style={styles.boldText}>
                  {moment(
                    route.params.dataResumoConsulta.data_consulta,
                    "YYYY-MM-DD HH:mm:ssZZ"
                  ).format("LLLL")}
                </Text>
              </View>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size={"large"} color={Colors.blue} style={{ margin: 50 }} />
          ) : (
            <>
              <View style={styles.wrapper}>
                <View style={styles.width}>
                  <Text style={styles.titleText}>Detalhes do consultório</Text>

                  <Text
                    style={styles.boldText}
                  >{`${infoMedico.endereco.rua}, ${infoMedico.endereco.numero}, ${infoMedico.endereco.bairro} - ${infoMedico.endereco.cidade}`}</Text>
                  <Text
                    style={styles.linkText}
                    onPress={() => {
                      setModalVisible(true);
                    }}
                  >
                    Ver no mapa
                  </Text>
                </View>
              </View>

              <View style={styles.wrapper}>
                <View style={styles.width}>
                  <Text style={styles.titleText}>Telefones</Text>
                  <View style={styles.grid}>
                    {infoMedico.endereco.telefone_fixo !== "" &&
                      infoMedico.endereco.telefone_fixo !== null && (
                        <View>
                          <Text
                            style={{
                              ...styles.boldTelefoneText,
                              marginRight: 2
                            }}
                          >
                            Tel. Fixo:{" "}
                          </Text>
                          <TextInputMask
                            style={{
                              ...styles.boldTelefoneText,
                              color: Colors.black
                            }}
                            type={"cel-phone"}
                            options={{
                              maskType: "BRL",
                              withDDD: true,
                              dddMask: "(99) "
                            }}
                            value={infoMedico.endereco.telefone_fixo}
                            editable={false}
                          />
                        </View>
                      )}
                    {infoMedico.endereco.telefone_cel !== "" &&
                      infoMedico.endereco.telefone_cel !== null && (
                        <View>
                          <Text
                            style={{
                              ...styles.boldTelefoneText,
                              marginRight: 2
                            }}
                          >
                            Celular:{" "}
                          </Text>
                          <TextInputMask
                            style={{
                              ...styles.boldTelefoneText,
                              color: Colors.black
                            }}
                            type={"cel-phone"}
                            options={{
                              maskType: "BRL",
                              withDDD: true,
                              dddMask: "(99) "
                            }}
                            value={infoMedico.endereco.telefone_cel}
                            editable={false}
                          />
                        </View>
                      )}
                  </View>
                </View>
              </View>

              <View style={styles.wrapper}>
                <View style={styles.width}>
                  <Text style={styles.titleText}>Agendado para</Text>
                  <Text style={styles.boldText}>
                    {route.params.dataResumoConsulta.nome_paciente}
                  </Text>
                </View>
              </View>

              <View style={styles.wrapper}>
                <View style={styles.width}>
                  <Text style={styles.titleText}>Forma de pagamento</Text>
                  <Text style={styles.boldText}>
                    {route.params.dataResumoConsulta.convenio === "Particular"
                      ? currencyFormatter(route.params.dataResumoConsulta.valor_real)
                      : route.params.dataResumoConsulta.convenio}
                  </Text>
                  <Text style={styles.infoPagamentoText}>
                    Forma de pagamento a ser efetuada no consultório/clínica ou diretamente para o
                    médico
                  </Text>
                </View>
              </View>
            </>
          )}

          <View style={styles.buttonWrapper}>
            <View style={styles.buttonWidth}>
              <RectButton style={styles.botaoAzul} onPress={handleNavigateToHome}>
                <Text style={styles.botaoAzulText}>Finalizado</Text>
              </RectButton>
              <RectButton style={styles.botaoBranco} onPress={handleNavigateToCompromissos}>
                <Text style={styles.botaoBrancoText}>Meus compromissos</Text>
                <AntDesign name="right" size={15} color={Colors.blue} />
              </RectButton>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  containermodal: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modal: {
    width: 320,
    padding: 10,
    paddingBottom: 15,

    backgroundColor: "white",
    alignSelf: "center",

    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.softGray
  },
  modalCloseButton: {
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center"
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.blue,
    textTransform: "uppercase",

    marginRight: 5
  },
  mapcontainer: {
    alignSelf: "center",

    width: 300,
    height: 220,
    marginTop: 15,

    borderWidth: 1,
    borderColor: Colors.softGray,
    borderBottomEndRadius: 6,
    borderBottomStartRadius: 6
  },
  map: {
    width: "100%",
    height: 180
  },
  mapfooter: {
    width: "100%",
    height: 42,
    justifyContent: "center",
    position: "absolute",
    bottom: 0
  },
  textMapFooter: {
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    fontSize: 14,

    marginLeft: 12,
    marginTop: 2,

    opacity: 0.7
  },

  wrapper: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginTop: 3,
    backgroundColor: Colors.white
  },

  width: {
    width: screenWidth - 40,
    paddingTop: 16,
    paddingBottom: 16
  },

  grid: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap"
  },

  titleText: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: Fonts.regular,
    color: Colors.black,
    opacity: 0.5,

    marginBottom: 5
  },
  boldText: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.black,
    fontFamily: Fonts.regular,
    marginRight: 6
  },
  dataText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.black,
    fontFamily: Fonts.regular
  },
  linkText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: Fonts.regular,
    textDecorationLine: "underline",
    color: Colors.black,

    marginRight: 6
  },

  boldTelefoneText: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.black,
    fontFamily: Fonts.regular,

    marginRight: 20
  },

  infoPagamentoText: {
    fontSize: 13,
    lineHeight: 17,
    fontFamily: Fonts.regular,
    color: Colors.black,
    opacity: 0.5,

    marginTop: 8
  },

  sendTitle: {
    fontSize: 16,
    lineHeight: 19,
    fontFamily: Fonts.regular,
    color: "#37D363"
  },

  sendText: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: Fonts.regular,
    color: Colors.black,
    opacity: 0.5,

    marginTop: 3
  },

  buttonWrapper: {
    width: "100%",
    backgroundColor: Colors.white,
    marginTop: 40,
    alignItems: "center"
  },
  buttonWidth: {
    width: screenWidth - 40,
    paddingTop: 8,
    paddingBottom: 8,

    flexDirection: "row",
    justifyContent: "space-between"
  },
  botaoAzul: {
    backgroundColor: Colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",

    width: (screenWidth - 40) / 2 - 5,
    height: 50
  },
  botaoAzulText: {
    fontSize: 18,
    lineHeight: 21,
    color: Colors.white,
    fontFamily: Fonts.bold
  },

  botaoBranco: {
    borderRadius: 4,

    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",

    width: (screenWidth - 40) / 2 - 5,
    height: 50
  },

  botaoBrancoText: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.blue,
    marginBottom: 3,
    fontFamily: Fonts.bold,
    textAlign: "center"
  }
});
