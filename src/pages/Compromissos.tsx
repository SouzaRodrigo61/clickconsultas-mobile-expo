import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import api from "../services/api.js";

import StatusBar from "../components/StatusBar";
import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";

import NavBar from "../components/NavBar";
import NenhumCompromisso from "../components/Compromissos/NenhumCompromisso";
import ProximosCompromissos from "../components/Compromissos/ProximosCompromissos";
import CompromissosConcluidos from "../components/Compromissos/CompromissosConcluidos";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Compromissos({ navigation, route }) {
  const [compromissos, setCompromissos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notify, setNotify] = useState(false);

  const [filtro, setFiltro] = useState("Próximas");

  function filtrarPor(tipo) {
    setFiltro(tipo);
  }

  const fetchData = async () => {
    setLoading(true);
    await api.get("/pacientes/appointments").then(({ data: compromissos }) => {
      setCompromissos(compromissos);
      if (compromissos.find((c) => c.is_remarcacao)) {
        setFiltro("Solicitações");
        setNotify(true);
      } else {
        setFiltro("Próximas");
        setNotify(false);
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar color={"#2FA8D5"} barStyle={"light-content"} />

      {loading && compromissos.length == 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#2FA8D5" size="large" />
        </View>
      )}
      {compromissos.length > 0 ? (
        <View style={styles.container}>
          <View style={styles.filtro}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <RectButton
                onPress={() => filtrarPor("Próximas")}
                style={
                  filtro === "Próximas"
                    ? {
                        ...styles.rect,
                      }
                    : {
                        ...styles.rect,
                        backgroundColor: "#EFF2F5",
                      }
                }
              >
                <View
                  style={
                    filtro === "Próximas"
                      ? { ...styles.selectedFiltro }
                      : { ...styles.unselectedFiltro }
                  }
                >
                  <Text
                    style={
                      filtro === "Próximas"
                        ? { ...styles.selectedFiltroText }
                        : { ...styles.unselectedFiltroText }
                    }
                  >
                    Próximos
                  </Text>
                </View>
              </RectButton>
              <RectButton
                onPress={() => filtrarPor("Concluídas")}
                style={
                  filtro === "Concluídas"
                    ? {
                        ...styles.rect,
                        marginHorizontal: 10,
                      }
                    : {
                        ...styles.rect,
                        marginHorizontal: 10,
                        backgroundColor: "#EFF2F5",
                      }
                }
              >
                <View
                  style={
                    filtro === "Concluídas"
                      ? { ...styles.selectedFiltro }
                      : { ...styles.unselectedFiltro }
                  }
                >
                  <Text
                    style={
                      filtro === "Concluídas"
                        ? { ...styles.selectedFiltroText }
                        : { ...styles.unselectedFiltroText }
                    }
                  >
                    Concluídos
                  </Text>
                </View>
              </RectButton>

              <View>
                <RectButton
                  onPress={() => filtrarPor("Solicitações")}
                  style={
                    filtro === "Solicitações"
                      ? {
                          ...styles.rect,
                        }
                      : {
                          ...styles.rect,
                          backgroundColor: "#EFF2F5",
                        }
                  }
                >
                  <View
                    style={
                      filtro === "Solicitações"
                        ? {
                            ...styles.selectedFiltro,
                            backgroundColor: "#4f6787",
                            borderColor: "#4f6787",
                          }
                        : {
                            ...styles.unselectedFiltro,
                            borderColor: "#4f6787",
                            position: "relative",
                            overflow: "hidden",
                          }
                    }
                  >
                    <View>
                      <MaterialIcons
                        name="notifications"
                        color={filtro === "Solicitações" ? "white" : "#4F6787"}
                        style={{ marginRight: 6 }}
                        size={16}
                      />
                      {notify && (
                        <View
                          style={{
                            width: 6,
                            height: 6,
                            backgroundColor: "red",
                            position: "absolute",
                            right: 6,
                            borderRadius: 6 / 2,
                          }}
                        />
                      )}
                    </View>
                    <Text
                      style={
                        filtro === "Solicitações"
                          ? { ...styles.selectedFiltroText }
                          : { ...styles.unselectedFiltroText, color: "#4f6787" }
                      }
                    >
                      Solicitações
                    </Text>
                  </View>
                </RectButton>
              </View>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={fetchData}
                colors={["#2FA8D5"]}
              />
            }
          >
            {filtro === "Próximas" && (
              <ProximosCompromissos
                compromissos={compromissos.filter((c: any) =>
                  ["Solicitada", "Agendada"].includes(c.status_consulta)
                )}
              />
            )}
            {filtro === "Concluídas" && (
              <CompromissosConcluidos
                compromissos={compromissos.filter(
                  (c: any) =>
                    !["Pendente", "Agendada", "Solicitada"].includes(
                      c.status_consulta
                    )
                )}
              />
            )}
            {filtro === "Solicitações" && (
              <ProximosCompromissos
                compromissos={compromissos.filter((c: any) =>
                  ["Pendente"].includes(c.status_consulta)
                )}
              />
            )}
          </ScrollView>
        </View>
      ) : (
        !loading && <NenhumCompromisso />
      )}
      <NavBar setSelected={[0, 1, 0]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#EFF2F5",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  filtro: {
    minHeight: 50,
    width: screenWidth - 40,

    flexDirection: "row",
    flexWrap: "wrap",

    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },

  rect: {
    marginBottom: 5,
    borderRadius: 100,
    backgroundColor: Colors.blue,
  },

  selectedFiltro: {
    minHeight: 30,
    minWidth: 100,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.blue,
    padding: 5,
    paddingHorizontal: 10,

    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: Colors.blue,
    alignItems: "center",
  },

  selectedFiltroText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: Fonts.bold,

    color: Colors.white,
  },

  unselectedFiltro: {
    minHeight: 30,
    minWidth: 100,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.blue,
    padding: 5,
    paddingHorizontal: 10,

    flexDirection: "row",

    backgroundColor: "rgba(1,1,1,0.01)",

    alignItems: "center",
    justifyContent: "center",
  },

  unselectedFiltroText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: Fonts.bold,
    textAlign: "center",

    color: Colors.blue,
  },

  unselectedFiltroBorda: {},
});
