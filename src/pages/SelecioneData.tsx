import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import CardHorariosDisponiveis from "../components/SelecioneData/CardHorariosDisponiveis";
import CardAlternarEndereco from "../components/SelecioneData/CardAlternarEndereco";
import ModalSelecionaEndereco from "../components/SelecioneData/ModalSelecionaEndereco";

import { AntDesign, Entypo } from "@expo/vector-icons";
import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";
import api from "../services/api.js";
import { getInitials } from "../scripts/helpers";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

export default function SelecioneData({ route }) {
  console.log('SelecioneData - route.params:', route.params);
  console.log('SelecioneData - route.params.id_medico:', route.params.id_medico);
  
  const [step, setStep] = useState({
    pagamento: false,
    endereco: false,
    data: false
  });

  // Estado para armazenar id_medico persistente
  const [persistentIdMedico, setPersistentIdMedico] = useState(null);
  const [persistentValorReal, setPersistentValorReal] = useState(null);

  const [infoData, setInfoData] = useState({
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
    avatar: "",
    experiencias: [{ titulo: "", descricao: "", ano: 0 }],
    formacoes: [{ instituicao: "", curso: "", ano: 0 }],
    especialidades: [{ especialidade: "", rqe: 0, favorita: false }],
    convenios: [""],
    enderecos: [
      {
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
    ]
  });

  const navigation = useNavigation();

  const fetch = async () => {
    setLoading(true);
    
    // Tentar recuperar id_medico do AsyncStorage se não estiver nos params
    let idMedico = route.params.id_medico;
    if (!idMedico) {
      try {
        const storedIdMedico = await AsyncStorage.getItem('current_id_medico');
        const storedValorReal = await AsyncStorage.getItem('current_valor_real');
        if (storedIdMedico) {
          idMedico = parseInt(storedIdMedico);
          setPersistentIdMedico(idMedico);
          setPersistentValorReal(storedValorReal ? parseFloat(storedValorReal) : null);
          console.log('Recuperado do AsyncStorage - id_medico:', idMedico);
        }
      } catch (error) {
        console.error('Erro ao recuperar id_medico do AsyncStorage:', error);
      }
    } else {
      // Salvar id_medico no AsyncStorage para persistência
      try {
        await AsyncStorage.setItem('current_id_medico', idMedico.toString());
        await AsyncStorage.setItem('current_valor_real', route.params.valor_real?.toString() || '');
        setPersistentIdMedico(idMedico);
        setPersistentValorReal(route.params.valor_real);
        console.log('Salvo no AsyncStorage - id_medico:', idMedico);
      } catch (error) {
        console.error('Erro ao salvar id_medico no AsyncStorage:', error);
      }
    }

    if (!idMedico) {
      console.error('id_medico não encontrado nem nos params nem no AsyncStorage');
      setLoading(false);
      return;
    }

    api
      .get(`/medicos/${idMedico}`)
      .then(({ data: data }) => {
        setInfoData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar dados do médico:', err);
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

  useEffect(() => {
    let isMouted = true;
    if (isMouted && route.params.convenioSelecionado)
      setStep((state) => ({ ...state, pagamento: true }));
    return () => {
      isMouted = false;
    };
  }, [route.params]);

  function handleNavigatoToFormaDePagamento() {
    const valor: number = infoData.valor;
    const convenios: string[] = infoData.convenios;

    navigation.navigate("FormaDePagamento", { 
      convenios, 
      valor,
      id_medico: route.params.id_medico,
      valor_real: route.params.valor_real
    });
  }

  const [indexSelecionado, setIndexSelecionado] = useState(0);

  const atendimento = {
    from: infoData.from,
    to: infoData.to,
    duration: infoData.duration,
    semana: {
      dom: infoData.dom,
      seg: infoData.seg,
      ter: infoData.ter,
      qua: infoData.qua,
      qui: infoData.qui,
      sex: infoData.sex,
      sab: infoData.sab
    },
    enderecos: infoData.enderecos
  };

  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <>
      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={Colors.blue} size="large" />
        </View>
      ) : (
        <ScrollView
          scrollEnabled={!modal}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View>
            <View style={styles.containerSuperior}>
              <View style={styles.doctorHeaderContainer}>
                {loading ? (
                  <ActivityIndicator size="large" color={Colors.blue} />
                ) : (
                  <>
                    <View style={styles.doctorheader}>
                      {infoData.avatar ? (
                        <Image style={styles.imgDoctor} source={{ uri: infoData.avatar || "" }} />
                      ) : (
                        <View style={styles.avatarPlaceholder}>
                          <Text style={styles.avatarText}>{getInitials(infoData.nomeCompleto)}</Text>
                        </View>
                      )}
                      <View style={styles.firstLayerInfos}>
                        <Text style={styles.textInfos}>{infoData.nomeCompleto}</Text>
                        <View
                          style={{
                            ...styles.firstLayerSpec,
                            ...styles.textfirstLayerSpec
                          }}
                        >
                          <Text style={styles.textfirstLayerSpec}>
                            {infoData.conselho} {infoData.numeroRegistro} /{infoData.estado}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        ...styles.containerSpecs,
                        ...styles.textShadow,
                        flex: 1,
                        flexDirection: "column"
                      }}
                    >
                      {infoData.especialidades.map((especialidade, index) => (
                        <View
                          style={{
                            ...styles.containerSpecs,
                            ...styles.textShadow
                          }}
                          key={index}
                        >
                          <Text style={styles.textShadow}>{especialidade.especialidade}</Text>
                          <Text style={styles.textShadow}> - </Text>
                          <Text style={styles.textShadow}>RQE nº {especialidade.rqe}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </View>
              <ScrollView style={styles.containerInferior}>
                <View style={styles.pagamento}>
                  <Text style={styles.textTitle}>Alterar forma de pagamento</Text>
                  <View style={styles.containerPagamento}>
                    <AntDesign
                      name="credit-card"
                      size={18}
                      color={Colors.blue}
                      style={{ marginRight: 10 }}
                    />
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={handleNavigatoToFormaDePagamento}
                    >
                      {route.params.convenioSelecionado === undefined ? (
                        <>
                          <Text style={styles.textPagamento}>Selecione forma de pagamento</Text>
                        </>
                      ) : (
                        <Text style={styles.textPagamento}>{route.params.convenioSelecionado}</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <CardAlternarEndereco
                  press={() => setModal(true)}
                  enderecoSelecionado={infoData.enderecos}
                  index={indexSelecionado}
                  loading={loading}
                  endereco={step.endereco}
                  pagamento={step.pagamento}
                />

                <CardHorariosDisponiveis
                  atendimento={atendimento}
                  loading={loading}
                  index={indexSelecionado}
                  id_endereco={infoData.enderecos[indexSelecionado].id_endereco}
                  id_gerente={infoData.enderecos[indexSelecionado].id_gerente}
                  id_medico={route.params.id_medico}
                  valor_real={route.params.valor_real}
                  convenio={route.params.convenioSelecionado}
                  endereco={step.endereco}
                  data={step.data}
                  setStep={setStep}
                />
              </ScrollView>
            </View>
            <ModalSelecionaEndereco
              show={modal}
              close={() => setModal(false)}
              list_enderecos={infoData.enderecos}
              indexSelecionado={indexSelecionado}
              setIndexSelecionado={setIndexSelecionado}
              setStep={setStep}
            />
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  containerInferior: {
    overflow: "scroll"
  },
  containerSuperior: {
    flex: 0
  },
  doctorHeaderContainer: {
    width: screenWidth,
    backgroundColor: Colors.white,
    paddingVertical: 10
  },
  imgDoctor: {
    marginTop: 20,
    marginBottom: 20,
    marginRight: 10,
    width: 70,
    height: 70,
    borderRadius: 70 / 2
  },
  doctorheader: {
    width: screenWidth - 40,
    alignSelf: "center",
    flexDirection: "row"
  },
  textInfos: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    lineHeight: 22
  },
  textShadow: {
    flexWrap: "wrap",
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    opacity: 0.7,
    fontSize: 16,
    lineHeight: 19,
    paddingTop: 4
  },
  firstLayerInfos: {
    flexDirection: "column",
    justifyContent: "center",
    width: 0,
    flexGrow: 1
  },
  firstLayerSpec: {
    flexDirection: "row",
    marginTop: 4,
    flexWrap: "wrap"
  },
  containerSpecs: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
    marginLeft: 5,
    marginRight: 5
  },
  textfirstLayerSpec: {
    fontFamily: Fonts.light,
    fontSize: 16,
    lineHeight: 19
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    marginTop: 20,
    marginBottom: 20,
    marginRight: 6,
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Colors.softGray
  },
  avatarText: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.black,
    textAlign: "center",
  },
  pagamento: {
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
  containerPagamento: {
    flexDirection: "row",
    marginTop: 7,
    alignItems: "center"
  },
  textPagamento: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    lineHeight: 22,
    color: Colors.blue
  }
});
