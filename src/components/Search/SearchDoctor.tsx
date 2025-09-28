import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
import { getInitials } from "../../scripts/helpers";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface SearchingProps {
  searchResult: any;
  loading: boolean;
}

export default function SearchDoctor({
  searchResult,
  loading,
}: SearchingProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.geral}>
      {loading && (
        <View style={styles.notFound}>
          <ActivityIndicator color="#2FA8D5" size="large" />
          <Text style={styles.textNotFound}>
            Estamos procurando pelos especialistas...
          </Text>
        </View>
      )}
      {!loading &&
        (searchResult?.length == 0 ? (
          <View style={styles.notFound}>
            <Feather name="x" size={34} color={Colors.blue} />
            <Text style={styles.textNotFound}>Nenhum resultado encontrado</Text>
          </View>
        ) : (
          <View style={styles.geral}>
            {searchResult?.map((medico, index) => (
              <View style={styles.container} key={index}>
                <View style={styles.firstLayer}>
                  {medico.avatar ? (
                    <Image
                      style={styles.imgDoctor}
                      source={{ uri: medico.avatar }}
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Text style={{ fontSize: 24 }}>
                        {getInitials(medico.nome_completo)}
                      </Text>
                    </View>
                  )}
                  <View style={styles.firstLayerInfos}>
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      style={{
                        fontFamily: Fonts.regular,
                        fontStyle: "normal",
                        fontSize: 18,
                        lineHeight: 21,
                        width: 250,
                      }}
                    >
                      Dr(a). {medico.nome_completo}
                    </Text>
                    <Text style={styles.textInfos}>
                      {medico.especialidade.nome}
                    </Text>
                    <View style={styles.firstLayerSpec}>
                      <Text style={styles.textInfos}>
                        {medico.conselho} {medico.registro}
                      </Text>
                      <Text style={styles.textInfos}> | </Text>
                      <Text style={styles.textInfos}>
                        RQE {medico.especialidade.rqe}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.secondLayer}>
                  <View style={styles.localTexts}>
                    <Text
                      style={{
                        ...styles.textLocal,
                        fontFamily: Fonts.regular,
                      }}
                    >
                      {medico.cidade}
                    </Text>
                    <Text style={styles.textLocal}> • </Text>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.textLocal}
                    >
                      {medico.clinica}
                    </Text>
                  </View>
                  <View style={styles.buttonscontainer}>
                    <TouchableOpacity
                      style={styles.buttoncontainerAzul}
                      onPress={() =>
                        navigation.navigate("SelecioneData", {
                          id_medico: medico.id_medico,
                          valor_real: medico.valor,
                        })
                      }
                      activeOpacity={0.5}
                    >
                      <Text style={styles.textButton}>Consulta Presencial</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttoncontainerBordaAzul}
                      onPress={() =>
                        navigation.navigate("PerfilMedico", {
                          id_medico: medico.id_medico,
                        })
                      }
                      activeOpacity={0.5}
                    >
                      <Text
                        style={{ ...styles.textButton, color: Colors.blue }}
                      >
                        Perfil Médico
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  geral: {
    backgroundColor: Colors.smokeWhite,
    alignSelf: "center",
  },
  container: {
    width: screenWidth - 30,
    minHeight: 200,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.softGray,
    backgroundColor: Colors.white,
    justifyContent: "center",
    marginBottom: 10,
    padding: 15,
    shadowColor: Colors.softGray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 10,
    elevation: 3,
  },
  notFound: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: screenHeight / 4,
  },
  textNotFound: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    opacity: 0.4,
    padding: 10,
  },
  textInfos: {
    fontFamily: Fonts.light,
    fontStyle: "normal",
    fontSize: 15,
    lineHeight: 17,
    paddingTop: 4,
  },
  firstLayerInfos: {
    flexDirection: "column",
    marginLeft: 16,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  firstLayerSpec: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  localTexts: {
    flexDirection: "row",
    marginBottom: 13,
    marginTop: 15,
    flexWrap: "wrap",
  },
  textLocal: {
    fontFamily: Fonts.light,
    fontStyle: "normal",
    fontSize: 15,
    lineHeight: 18,
  },
  buttonscontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: screenWidth-80,
  },
  buttoncontainerAzul: {
    width: ((screenWidth - 80)/2)-6,
    minHeight: 40,
    padding: 8,
    backgroundColor: Colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  buttoncontainerBordaAzul: {
    width: ((screenWidth - 80)/2)-6,
    minHeight: 40,
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.blue,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    fontFamily: Fonts.bold,
    fontStyle: "normal",
    fontSize: 14,
    lineHeight: 17,
    color: Colors.white,
    textAlign: "center",
  },
  firstLayer: {
    flexDirection: "row",
    width: screenWidth - 80,
    alignSelf: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.softGray,
  },
  secondLayer: {
    width: screenWidth - 80,
    alignSelf: "center",
  },
  imgDoctor: {
    width: 70,
    height: 70,
    alignSelf: "center",
    borderRadius: 70 / 2,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Colors.softGray,
  },
});
