import React, { useState, useEffect } from "react";
import api from "../services/api.js";

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  ImageBackground
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";
import { Ionicons, Fontisto, AntDesign } from "@expo/vector-icons";

import NavBar from "../components/NavBar";
import StatusBar from "../components/StatusBar";
import CardEspecialidades from "../components/EncontreAgende/Especialidades";
import SolicitacaoData from "../components/Home/SolicitacaoData";

import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";

import ColorfulLogo from "../images/colorful-logo.png";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

import { getLocalidadeFromAsyncStorage } from "../utils/locationStorage.js";

import { useAuth } from "../contexts/auth";
import { useProfile } from "../contexts/profile";

export default function Home({}) {
  const { profile, setProfile } = useProfile();

  const navigation = useNavigation();

  const [arrayEspecialidades, setArrayEspecialidades] = useState<string[]>([]);
  const [solicitaData, setSolicitaData] = useState(false);
  const [loading, setLoading] = useState(true);
  const localSelected = profile?.localidade?.cidade || "";

  function handleNavigateToEncontreAgende() {
    navigation.navigate("EncontreAgende", {
      localidade: localSelected,
      especialidades: [...arrayEspecialidades]
    });
  }

  function handleNavigateToBuscarLocalidade1() {
    navigation.navigate("BuscarLocalidade1");
  }

  function handleNavigateExplorarMais() {
    navigation.navigate("Especialidades", {
      especialidades: [...arrayEspecialidades]
    });
  }

  const fetchData = async () => {
    setLoading(true);
    await api.get("/lista-especialidades").then(({ data: listaEspecs }) => {
      return setArrayEspecialidades(
        listaEspecs.map((e: { especialidade: string }) => e.especialidade).sort()
      );
    });
    await api
      .get("/pacientes/appointments")
      .then(({ data: compromissos }) => setSolicitaData(compromissos.find((c) => c.is_remarcacao)));
    const localidade = await getLocalidadeFromAsyncStorage();
    if (localidade)
      setProfile((state: any) => ({
        ...state,
        localidade
      }));
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchData();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <StatusBar color="white" barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} colors={["#2FA8D5"]} />
        }
      >
        <ImageBackground
          source={require("../images/home.png")}
          style={{ flex: 1, width: screenWidth, marginBottom: 8 }}
          resizeMode="cover"
        >
          <View style={styles.header}>
            <View>
              <View style={styles.headerGrid}>
                <Image source={ColorfulLogo} style={styles.image} />

                <View>
                  <View style={styles.location}>
                    <RectButton
                      style={styles.buttoncontainer}
                      onPress={handleNavigateToBuscarLocalidade1}
                    >
                      <Fontisto name="map-marker-alt" size={20} color={Colors.titleBlue} />
                      {localSelected == undefined || localSelected === "" ? (
                        <View>
                          <Text style={styles.headerText}>Localidade</Text>
                        </View>
                      ) : (
                        <Text style={styles.headerText}>{localSelected}</Text>
                      )}
                      <AntDesign
                        name="down"
                        size={12}
                        color={Colors.titleBlue}
                        style={{ marginTop: 2.5 }}
                      />
                    </RectButton>
                  </View>
                </View>
              </View>

              <Text style={styles.headerTitle}>Encontre médicos{"\n"}perto de você</Text>
            </View>

            <View style={styles.botao}>
              <RectButton onPress={handleNavigateToEncontreAgende} style={styles.botaoGrid}>
                <Text style={styles.botaoText}>Buscar médicos ou especialidades</Text>
                <Ionicons name="search" size={20} color={Colors.white} />
              </RectButton>
            </View>
          </View>

          <View style={styles.gridContainer}>
            {solicitaData && <SolicitacaoData />}

            <View style={styles.grid}>
              <Text style={styles.title}>Especialidades</Text>
              <TouchableOpacity onPress={handleNavigateExplorarMais} activeOpacity={0.5}>
                <Text style={styles.text}>Explorar mais</Text>
              </TouchableOpacity>
            </View>
            <CardEspecialidades slice={8} especialidades={arrayEspecialidades} />
          </View>
        </ImageBackground>
      </ScrollView>
      <NavBar setSelected={[1, 0, 0]} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white"
  },

  header: {
    marginBottom: 30,
    alignItems: "center"
  },

  containerHeader: {
    width: screenWidth - 40,
    maxWidth: 600
  },

  headerGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: screenWidth - 40,
    maxWidth: 600
  },

  image: {
    marginTop: 30,
    marginBottom: 35
  },

  location: {
    flexDirection: "column",
    height: 58
  },

  buttoncontainer: {
    flexDirection: "row",
    height: 35,
    // width: 100,

    borderRadius: 4,

    padding: 4,
    marginTop: 30,

    justifyContent: "flex-end",
    alignItems: "flex-start"
  },

  headerText: {
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    fontSize: 14,
    lineHeight: 17,

    color: Colors.titleBlue,

    marginLeft: 8,
    marginRight: 4
  },

  headerTitle: {
    fontSize: 27,
    lineHeight: 31,
    fontFamily: Fonts.bold,
    marginTop: 15,
    marginBottom: 30,

    color: Colors.titleBlue
  },
  modalTitle: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: Fonts.regular,
    textAlign: "center",
    color: Colors.black,
    opacity: 0.5
  },

  botao: {
    backgroundColor: Colors.blue,
    borderRadius: 5
  },

  botaoGrid: {
    alignContent: "center",
    alignSelf: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    width: screenWidth - 40,
    maxWidth: 600,
    minHeight: 50,
    flexWrap: "wrap"
  },

  botaoText: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: Fonts.regular,
    fontStyle: "normal",

    color: Colors.white,

    marginLeft: 8,
    width: 0,
    flexGrow: 1
  },

  gridContainer: {
    alignItems: "center"
  },

  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: screenWidth - 40,
    maxWidth: 600,
    marginTop: 10,
    marginBottom: 8,
    alignItems: "center",
    alignContent: "center"
  },

  title: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: Fonts.regular,

    color: "#2A3748",
    opacity: 0.8
  },

  text: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: Fonts.bold,

    color: Colors.blue
  },
  modalText: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: Fonts.bold,
    opacity: 0.7,
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
    width: screenWidth - 50,
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
    justifyContent: "center",
    marginTop: 40
  },
  cancelarButtonBorder: {
    width: "100%",
    height: "100%",

    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.blue,

    backgroundColor: "white",

    alignItems: "center",
    justifyContent: "center"
  },
  cancelarButtonText: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: Fonts.bold,

    color: Colors.blue
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
  }
});
