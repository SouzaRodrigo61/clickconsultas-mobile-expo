import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions, Image, ActivityIndicator } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CardPerfilConsultaPresencial from "../components/PerfilMedico/CardPerfilConsultaPresencial";
import CardDetalheClinica from "../components/PerfilMedico/CardDetalheClinica";
import CardMaisSobre from "../components/PerfilMedico/CardMaisSobre";
import CardServicos from "../components/PerfilMedico/CardServicos";
import MultiplosEnderecos from "../components/PerfilMedico/MultiplosEnderecos";
import NavBar from "../components/NavBar";
import api from "../services/api.js";

import { getInitials } from "../scripts/helpers";
import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function PerfilMedico({ route }) {
  const [loading, setLoading] = useState<boolean>(true);

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
    avatar: null,
    clinica: "",
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

  const fetch = async () => {
    setLoading(true);
    api
      .get(`/medicos/${route.params.id_medico}`)
      .then(({ data: medico }) => {
        setInfoMedico(medico);
        setLoading(false);
      })
      .catch(() => {});
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
        <View style={styles.container}>
          <ScrollView style={styles.scrollcontainer} showsVerticalScrollIndicator={false}>
            <View style={styles.doctorContainer}>
              {loading ? (
                <ActivityIndicator size="large" color={Colors.blue} />
              ) : (
                <>
                  <View style={styles.doctorheader}>
                    {infoMedico.avatar ? (
                      <Image style={styles.imgDoctor} source={{ uri: infoMedico.avatar || "" }} />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <Text style={{ fontSize: 24 }}>{getInitials(infoMedico.nomeCompleto)}</Text>
                      </View>
                    )}
                    <View style={styles.firstLayerInfos}>
                      <Text
                        style={{
                          fontFamily: "Lato_700Bold",
                          fontStyle: "normal",
                          fontSize: 18,
                          lineHeight: 22
                        }}
                      >
                        {infoMedico.nomeCompleto}
                      </Text>
                      <View
                        style={{
                          ...styles.firstLayerSpec,
                          ...styles.textInfos
                        }}
                      >
                        <Text style={styles.textInfos}>
                          {infoMedico.conselho} {infoMedico.numeroRegistro} /{infoMedico.estado}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      ...styles.firstLayerSpec,
                      ...styles.textInfos,
                      flex: 1,
                      flexDirection: "column"
                    }}
                  >
                    {infoMedico.especialidades.map((especialidade, index) => (
                      <View
                        style={{
                          ...styles.firstLayerSpec,
                          ...styles.textInfos
                        }}
                        key={index}
                      >
                        <Text style={styles.textInfos}>{especialidade.especialidade}</Text>
                        <Text style={styles.textInfos}> - </Text>
                        <Text style={styles.textInfos}>RQE nº {especialidade.rqe}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>
            <CardPerfilConsultaPresencial
              valor={infoMedico.valor}
              loading={loading}
              id_medico={route.params.id_medico}
              valor_real={infoMedico.valor}
            />
            <MultiplosEnderecos
              nomeClinica={infoMedico.clinica}
              list_enderecos={infoMedico.enderecos}
              loading={loading}
            />
            <CardMaisSobre
              id_medico={route.params.id_medico}
              experiencias={infoMedico.experiencias}
              formacoes={infoMedico.formacoes}
              especialidades={infoMedico.especialidades}
              especialista={infoMedico.nomeCompleto}
              loading={loading}
              valor_real={infoMedico.valor}
            />
          </ScrollView>
          <NavBar setSelected={[1, 0, 0]} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: Colors.white
  },
  scrollcontainer: {
    width: screenWidth,
    height: screenHeight,
    margin: 10
  },
  doctorContainer: {
    width: screenWidth - 40,
    alignSelf: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.softGray,
    paddingBottom: 15
  },
  doctorheader: {
    flexDirection: "row"
  },
  textInfos: {
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
    marginLeft: 16,
    justifyContent: "center",
    width: 0,
    flexGrow: 1
  },
  firstLayerSpec: {
    flexDirection: "row"
  },

  buttonscontainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10
  },
  buttoncontainerAzul: {
    width: screenWidth - 40,
    height: 40,
    backgroundColor: Colors.blue,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center"
  },
  textButton: {
    fontFamily: Fonts.bold,
    fontStyle: "normal",
    fontSize: 16,
    lineHeight: 19,
    color: Colors.white
  },
  imgDoctor: {
    width: 70,
    height: 70,
    alignSelf: "center",
    borderRadius: 70 / 2,
    marginTop: 20,
    marginBottom: 20,
    marginRight: 6
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
  }
});
