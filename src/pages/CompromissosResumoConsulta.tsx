import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Modal,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  ActivityIndicator,
  Linking
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

import { useNavigation } from "@react-navigation/native";

import Colors, { getColor } from "../styles/Colors";
import Fonts from "../styles/Fonts";
import DoctorHeader from "../components/DoctorHeader";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

import api from "../services/api.js";
import moment from "moment";
import { formatPhoneNumber } from "../scripts/formatters";

export default function CompromissosResumoConsulta({ route }) {
  const [loading, setLoading] = useState(true);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const [consulta, setConsulta] = useState<any>({});

  const [modalVisible, setModalVisible] = useState(false);
  const [modalCancelarVisible, setModalCancelarVisible] = useState(false);

  const initialRegion = {
    latitude: -23.1862746,
    longitude: -50.6573834,
    latitudeDelta: 0.01,
    longitudeDelta: 0.05
  };

  const navigation = useNavigation();

  function handleNavigateToCompromissos() {
    navigation.navigate("Compromissos");
  }

  const handleCancel = async () => {
    setLoadingCancel(true);
    await api.put(`/consult/cancelar/${route.params.idConsulta}`).then(() => {
      handleNavigateToCompromissos();
    });
  };

  const getTimeLeft = () => {
    const days = moment(
      consulta.nova_data_consulta ? consulta.nova_data_consulta : consulta.data_consulta
    ).diff(new Date(), "day");
    // menos de um dia
    if (days <= 1) return `hoje`;
    // menos de um mes
    if (days <= 31) return `em ${days} dias`;
    // mais de um mes
    return `mais de um mês`;
  };

  const firstToUpperCase = (string) => {
    return string[0].toUpperCase() + string.slice(1);
  };

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

  const fetch = async () => {
    setLoading(true);
    await api
      .get(`/pacientes/appointment-detail/${route.params.idConsulta}`)
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <Modal animationType="fade" visible={modalCancelarVisible}>
            <View style={styles.containerModalCancelar}>
              <View style={styles.modalCancelar}>
                <Text style={styles.title}>Tem certeza que gostaria de cancelar sua consulta?</Text>
                <Text style={styles.text}>
                  Ao confirmar, sua consulta será cancelada e a operação não poderá ser desfeita.
                </Text>
                <View style={styles.cancelarButtonModal}>
                  {loadingCancel ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator color={Colors.red} size="large" />
                    </View>
                  ) : (
                    <>
                      <TouchableHighlight
                        style={styles.touchableButton}
                        onPress={() => {
                          setModalCancelarVisible(!modalCancelarVisible);
                        }}
                      >
                        <View style={styles.voltarButton}>
                          <Text style={styles.voltarButtonText}>Voltar</Text>
                        </View>
                      </TouchableHighlight>

                      <TouchableHighlight
                        onPress={() => {
                          setModalCancelarVisible(!modalCancelarVisible);
                        }}
                        onPressIn={handleCancel}
                        style={styles.touchableButton}
                      >
                        <View style={styles.cancelarButtonBorder}>
                          <Text style={styles.cancelarButtonText}>Confirmar</Text>
                        </View>
                      </TouchableHighlight>
                    </>
                  )}
                </View>
              </View>
            </View>
          </Modal>

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
                    <AntDesign name="closecircleo" size={20} color={Colors.blue} />
                  </View>
                </TouchableOpacity>

                <View style={styles.mapcontainer}>
                  {/* https://github.com/react-native-maps/react-native-maps */}
                  {/* https://www.mapbox.com/ */}
                  {/* https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md */}
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={initialRegion}
                    toolbarEnabled={false}
                  >
                    {/* https://github.com/react-native-maps/react-native-maps/blob/master/docs/marker.md */}
                    <Marker
                      coordinate={{
                        latitude: -23.1862746,
                        longitude: -50.6573834
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

          <View style={styles.wrapperStatus}>
            <View style={styles.width}>
              <View style={styles.gridStatus}>
                <Text style={styles.titleStatus}>Status da consulta</Text>
                <View style={styles.gridStatus}>
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      backgroundColor: getColor(consulta.status_consulta),
                      borderRadius: 25,
                      marginLeft: 7
                    }}
                  />
                  <Text
                    style={{
                      ...styles.textStatus,
                      color: getColor(consulta.status_consulta)
                    }}
                  >
                    {consulta.status_consulta}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <DoctorHeader consulta={consulta} />

          <View style={styles.wrapper}>
            <View style={styles.width}>
              <Text style={styles.titleText}>Data e horário</Text>
              <View style={styles.grid}>
                <Text style={styles.boldText}>
                  {firstToUpperCase(
                    moment(
                      consulta.nova_data_consulta
                        ? consulta.nova_data_consulta
                        : consulta.data_consulta
                    ).format("dddd[,] D MMMM YYYY[,] H[:]mm")
                  )}
                </Text>
                <Text style={styles.dataText}>{getTimeLeft()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.wrapper}>
            <View style={styles.width}>
              <Text style={styles.titleText}>Detalhes do consultório</Text>

              <Text style={styles.boldText}>
                {consulta.clinica}
                {"\n"}
                {consulta.remarcacao_rua
                  ? `${consulta.remarcacao_rua}, ${consulta.remarcacao_numero}, ${
                      consulta.remarcacao_bairro
                    } - ${consulta.remarcacao_cidade}, ${
                      consulta.remarcacao_uf
                    } - ${consulta.remarcacao_cep.substring(
                      0,
                      5
                    )}-${consulta.remarcacao_cep.substring(5)}`
                  : `${consulta.rua}, ${consulta.numero}, ${consulta.bairro} - ${
                      consulta.cidade
                    }, ${consulta.uf} - ${consulta.cep.substring(0, 5)}-${consulta.cep.substring(
                      5
                    )}`}
              </Text>
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
                {consulta.telefone_fixo?.trim() !== "" && (
                  <Text
                    onPress={() => Linking.openURL(`tel:${consulta.telefone_fixo}`)}
                    style={styles.boldTelefoneText}
                  >
                    {formatPhoneNumber(consulta.telefone_fixo)}
                  </Text>
                )}
                {consulta.telefone_cel?.trim() !== "" && (
                  <Text
                    onPress={() => Linking.openURL(`tel:${consulta.telefone_cel}`)}
                    style={styles.boldText}
                  >
                    {formatPhoneNumber(consulta.telefone_cel)}
                  </Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.wrapper}>
            <View style={styles.width}>
              <Text style={styles.titleText}>Agendado para</Text>
              <Text style={styles.boldText}>{consulta.nome_paciente}</Text>
            </View>
          </View>

          {/* 
          Removido secao Valor da Consulta pois só é possível
          recuperar o valor da consulta, mas não o convenio
          
          <View style={styles.wrapper}>
            <View style={styles.width}>
              <Text style={styles.titleText}>Valor da consulta</Text>
              <Text style={styles.boldText}>
                {currencyFormatter(consulta.valor_real)}
              </Text>
              <Text style={styles.infoPagamentoText}>
                Pagamento no consultorio ou diretamente para o médico
              </Text>
            </View>
          </View> */}

          <View style={styles.botao}>
            <RectButton
              style={styles.botaoRect}
              onPress={() => {
                setModalCancelarVisible(true);
              }}
            >
              <Text style={styles.botaoText}>Cancelar Agendamento</Text>
            </RectButton>
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  title: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: Fonts.bold,
    textAlign: "center",

    marginBottom: 20,

    color: Colors.black
  },
  text: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: Fonts.regular,
    textAlign: "center",

    color: Colors.black
  },
  containerModalCancelar: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#7E7E7E"
  },
  modalCancelar: {
    width: screenWidth - 70,
    maxWidth: 530,
    padding: 25,
    paddingTop: 50,

    backgroundColor: "white",
    alignSelf: "center",

    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.softGray
  },
  touchableButton: {
    width: "49%",
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4
  },
  cancelarButtonModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40
  },
  cancelarButtonBorder: {
    width: "100%",
    height: "100%",

    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.red,

    backgroundColor: "white",

    alignItems: "center",
    justifyContent: "center"
  },
  cancelarButtonText: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: Fonts.bold,

    color: Colors.red
  },
  voltarButton: {
    width: "100%",
    height: 38,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 4,

    backgroundColor: "white"
  },
  voltarButtonText: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: Fonts.bold,

    color: Colors.black
  },

  containermodal: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modal: {
    width: screenWidth - 40,
    maxWidth: 540,
    padding: 25,

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

  wrapperStatus: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginBottom: 3,
    backgroundColor: Colors.white
  },

  gridStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  titleStatus: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: Fonts.regular,
    color: Colors.black,
    opacity: 0.5
  },

  textStatus: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: Fonts.bold,
    color: "#37D363",
    marginLeft: 7
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
    color: Colors.gray,
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

  botao: {
    borderWidth: 1,
    borderColor: Colors.red,
    borderRadius: 4,

    marginTop: 10,
    marginBottom: 26,

    width: screenWidth - 40,
    maxWidth: 600,
    height: 50,

    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },

  botaoRect: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },

  botaoText: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: Fonts.bold,
    fontStyle: "normal",

    color: Colors.red
  }
});
