import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
import { useNavigation } from "@react-navigation/native";
import api from "../../services/api.js";
import { useProfile } from "../../contexts/profile";
import { saveLocalidadeOnAsyncStorage } from "../../utils/locationStorage.js";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface Data {
  search: string;
  picker: string;
  loading: boolean;
  loadingGeo: boolean;
}

interface SearchingProps {
  searchResult: any;
  data: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
}

export default function ResultadoLocalidade({ searchResult, data, setData }: SearchingProps) {
  const { setProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSetLocation = async (local) => {
    console.log('=== SELECIONANDO LOCALIZAÇÃO ===');
    console.log('Cidade selecionada:', local);
    console.log('Estado selecionado:', data.picker);
    
    setLoading(true);
    await api
      .post("/coordinates", {
        search: `${local}, ${data.picker}, brazil`
      })
      .then(async ({ data: coordinates }) => {
        const localidade = {
          cidade: local,
          estado: data.picker,
          lat: coordinates.split(",")[0],
          long: coordinates.split(",")[1]
        };

        console.log('Localidade criada:', localidade);

        setProfile((state: any) => {
          const newState = {
            ...state,
            localidade
          };
          console.log('Novo estado do profile:', newState);
          return newState;
        });

        await saveLocalidadeOnAsyncStorage(localidade);
        console.log('Localidade salva no AsyncStorage');

        // Salvar cidade no perfil do paciente no backend
        try {
          await api.put("/pacientes/profile", { cidade: local });
          console.log('Cidade salva no perfil do paciente');
        } catch (error) {
          console.log('Erro ao salvar cidade no perfil:', error);
        }

        navigation.navigate("Home");
      })
      .catch((err) => {
        console.log('Erro ao salvar localização:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View>
      {loading && (
        <View style={styles.notFound}>
          <ActivityIndicator color="#2FA8D5" size="large" />
          <Text style={styles.textNotFound}>Salvando cidade escolhida...</Text>
        </View>
      )}
      {data.loading && (
        <View style={styles.notFound}>
          <ActivityIndicator color="#2FA8D5" size="large" />
          <Text style={styles.textNotFound}>Estamos procurando sua cidade...</Text>
        </View>
      )}
      {!data.loading && data.search.trim() === "" && searchResult.length === 0 && (
        <View style={styles.notFound}>
          {/* <ActivityIndicator color="#2FA8D5" size="large" /> */}
          <Feather name="search" size={34} color={Colors.blue} />
          <Text style={styles.textNotFound}>
            Escolha um estado e procure sua cidade pelo nome. {"\n"}Se preferir, clique em "use sua
            localização atual".
          </Text>
        </View>
      )}
      {searchResult.length === 0 && data.search.trim() !== "" && (
        <View style={styles.notFound}>
          {/* <ActivityIndicator color="#2FA8D5" size="large" /> */}
          <Feather name="x" size={34} color={Colors.blue} />
          <Text style={styles.textNotFound}>Nenhum resultado encontrado</Text>
        </View>
      )}
      {searchResult.length !== 0 && !loading && (
        <View>
          {searchResult.map((local, index) => (
            <TouchableOpacity
              style={styles.container}
              key={index}
              onPress={() => handleSetLocation(local)}
            >
              <View style={styles.textLocalidades}>
                <Text>{local}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    width: screenWidth,
    height: 52,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.softGray
  },

  textLocalidades: {
    fontFamily: Fonts.light,
    fontSize: 16,
    lineHeight: 19,
    marginLeft: 16
  },

  notFound: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: screenHeight / 4
  },
  textNotFound: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    opacity: 0.4,
    padding: 10,
    textAlign: "center"
  }
});
