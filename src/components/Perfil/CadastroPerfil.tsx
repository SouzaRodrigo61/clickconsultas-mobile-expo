import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import api from "../../services/api.js";

import CadastroFinalizarList from "../Perfil/CadastroFinalizarList";
import CadastroFinalizarListCompletar from "../Perfil/CadastroFinalizarListCompletar";
import NavBar from "../NavBar";

import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";

import { useProfile } from "../../contexts/profile";
import { formatPhoneNumber } from "../../scripts/formatters";
import moment from "moment";

//import teste from "../../images/bemvindo.png";
import * as ImagePicker from 'expo-image-picker';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function CadastroPerfil() {
  const [loading, setLoading] = useState(true);
  const [hasNull, setHasNull] = useState(false);

  const { profile, setProfile } = useProfile();
  const navigation = useNavigation();

  const handleNavigateTo = (field) => {
    const path = "Cadastro" + field[0].toUpperCase() + field.slice(1);
    navigation.navigate(path);
  };

  const fetch = async () => {
    setLoading(true);
    await api.get("/pacientes/profile").then(({ data: dados }) => {
      setProfile((state: any) => ({ ...state, ...dados }));
      setLoading(false);
    });
  };

  const completeProfile = () => {
    if (!profile) return false;

    for (const [item, value] of Object.entries(profile!)) {
      if (!value) return item;
    }
    return false;
  };

  const checkIfHasNullEntry = () => {
    setHasNull(completeProfile() !== false);
  };

  //Início Upload de imagem paciente
  const handleimage = () => {
    Alert.alert(
      "Selecione uma foto",
      "",
      [
        {
          text: "Galeria de Fotos",
          onPress: () => pickImage(),
          style: "default",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  }

  const user_image = profile?.avatar || "https://i0.wp.com/www.multarte.com.br/wp-content/uploads/2018/12/fundo-cinza-claro5.jpg?resize=696%2C696&ssl=1";

  const [image, setImage] = useState<string>(user_image);
  const pickImage = async () => {
    let result = await ImagePicker?.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if(result.cancelled) return false;

    setImage(result.uri);
    
    // ImagePicker saves the taken photo to disk and returns a local URI to it
    let localUri = result.uri;
    let filename = localUri.split('/').pop();
    let size = (result.height * result.width);

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    
    // Form
    let formData = new FormData();
    formData.append('id_user', profile.id_paciente);
    formData.append('file', { uri: result.uri, name: filename, type, size });

    return await api.post('/avatar/pacientes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  };

  //Fim upload de imagem do paciente
 
  useEffect(() => {
    checkIfHasNullEntry();
  }, [profile]);

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
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.titleContainer}>
              <TouchableOpacity style={styles.TouchableOpacity} onPress={()=> handleimage()}>
                <Image source={{ uri: image }}  style={styles.Image}/> 
              </TouchableOpacity>
              <Text style={styles.title}>Dados principais</Text>
            </View>

            <View style={styles.list}>
              <CadastroFinalizarList
                onPress={() => {}}
                title="Email"
                text={profile?.email || ""}
                editable={false}
              />

              <CadastroFinalizarList
                onPress={() => {}}
                title="CPF"
                text={profile?.cpf || ""}
                editable={false}
              />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Dados adicionais</Text>
            </View>
            <View style={styles.list}>
              <CadastroFinalizarList
                onPress={() => handleNavigateTo("nome")}
                title="Nome"
                text={profile?.nome || ""}
              />

              <CadastroFinalizarList
                onPress={() => handleNavigateTo("telefone")}
                title="Número de Contato"
                text={formatPhoneNumber(profile?.telefone || "")}
              />

              {profile?.genero || "" ? (
                <CadastroFinalizarList
                  onPress={() => handleNavigateTo("genero")}
                  title="Gênero"
                  text={profile?.genero || ""}
                />
              ) : (
                <CadastroFinalizarListCompletar
                  onPress={() => handleNavigateTo("genero")}
                  title="Gênero"
                  text={"Adicionar gênero"}
                />
              )}

              {profile?.nascimento || "" ? (
                <CadastroFinalizarList
                  onPress={() => handleNavigateTo("nascimento")}
                  title="Data de Nascimento"
                  text={moment(profile?.nascimento || 0).format(
                    "DD[/]MM[/]YYYY"
                  )}
                />
              ) : (
                <CadastroFinalizarListCompletar
                  onPress={() => handleNavigateTo("nascimento")}
                  title="Data de Nascimento"
                  text={"Adicionar data"}
                />
              )}

              {profile?.cidade || "" ? (
                <CadastroFinalizarList
                  onPress={() => handleNavigateTo("cidade")}
                  title="Cidade"
                  text={profile?.cidade || ""}
                />
              ) : (
                <CadastroFinalizarListCompletar
                  onPress={() => handleNavigateTo("cidade")}
                  title="Cidade"
                  text={"Adicionar cidade"}
                />
              )}
            </View>
            <View style={styles.bottom}>
              {hasNull && (
                <RectButton
                  style={styles.botaoAzul}
                  onPress={() => handleNavigateTo(completeProfile())}
                >
                  <Text style={styles.botaoAzulTitle}>Completar perfil</Text>
                </RectButton>
              )}
            </View>
          </ScrollView>
        </View>
      )}
      <NavBar setSelected={[0, 0, 1]} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  list: {
    alignContent: "center",
    alignItems: "center",
  },

  bottom: {
    bottom: 0,
    justifyContent: "flex-end",
  },

  botaoAzul: {
    backgroundColor: Colors.blue,

    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",

    borderRadius: 4,
    width: screenWidth - 60,
    height: 59,
    marginTop: 30,
    marginBottom: 20,
  },

  botaoAzulTitle: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    fontStyle: "normal",

    color: Colors.white,
    marginBottom: 5,
  },

  titleContainer: {
    flex: 1,
    margin: 20,
  },

  title: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: Fonts.regular,

    color: Colors.black,
    opacity: 0.8,
  },

  TouchableOpacity:{
    width: 100,
    borderRadius: 500,
    height: 100,
    marginLeft: 120,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  Image:{
    width: 100,
    height: 100,
    borderRadius: 500
  }
});
