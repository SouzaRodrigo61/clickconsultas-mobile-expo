import React from "react";
import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import { getInitials } from "../scripts/helpers";
import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function DoctorHeader({ consulta }) {
  return (
    <View style={styles.doctorHeaderContainer}>
      <View style={styles.doctorheader}>
        {consulta.avatar ? (
          <Image style={styles.imgDoctor} source={{ uri: consulta.avatar?.file_url }} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text>{getInitials(consulta.nome_completo)}</Text>
          </View>
        )}

        <View style={styles.firstLayerInfos}>
          <Text style={styles.textInfos}>Dr(a). {consulta.nome_completo}</Text>
          <View style={{ ...styles.firstLayerSpec, ...styles.textfirstLayerSpec }}>
            <Text
              style={styles.textfirstLayerSpec}
            >{`${consulta.conselho} ${consulta.registro} / ${consulta.estado_conselho}`}</Text>
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
        <View
          style={{
            ...styles.containerSpecs,
            ...styles.textShadow
          }}
        >
          <Text style={styles.textShadow}>{consulta.especialidade.nome}</Text>
          <Text style={styles.textShadow}> - </Text>
          <Text style={styles.textShadow}>RQE nº {consulta.especialidade.rqe}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  doctorHeaderContainer: {
    width: "100%",
    backgroundColor: Colors.white,
    paddingVertical: 10
  },
  imgDoctor: {
    marginTop: 20,
    marginBottom: 20,
    marginRight: 0,
    width: 50,
    height: 50,
    borderRadius: 70 / 2
  },
  avatarPlaceholder: {
    marginTop: 20,
    marginBottom: 20,
    marginRight: 0,
    width: 50,
    height: 50,
    borderRadius: 100,
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.softGray
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
  firstLayerInfos: {
    flexDirection: "column",
    marginLeft: 16,
    justifyContent: "center",
    width: 0,
    flexGrow: 1
  },
  firstLayerSpec: {
    flexDirection: "row",
    marginTop: 4,
    flexWrap: "wrap"
  },
  textfirstLayerSpec: {
    fontFamily: Fonts.light,
    fontSize: 16,
    lineHeight: 19
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
  containerSpecs: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
    marginLeft: 10,
    marginRight: 5
  }
});
