import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";

import NavBar from "../NavBar";
import { useNavigation } from "@react-navigation/native";

import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";

import { useAuth } from "../../contexts/auth";
import { useProfile } from "../../contexts/profile";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ContaPerfil() {
  const navigation = useNavigation();

  const { setProfile } = useProfile();

  const { signOut } = useAuth();

  const [firstSelected, secondSelected] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  function select() {
    secondSelected(!firstSelected);
  }

  const handleLogout = () => {
    Alert.alert(
      'Desconectar',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              console.log('ContaPerfil: Iniciando logout...');
              
              // Limpar profile primeiro
              setProfile(null);
              console.log('ContaPerfil: Profile limpo');
              
              // Pequeno delay para Android
              await new Promise(resolve => setTimeout(resolve, 100));
              
              // Fazer logout
              await signOut();
              console.log('ContaPerfil: Logout concluído');
              
              // Delay adicional para Android garantir que a navegação funcione
              await new Promise(resolve => setTimeout(resolve, 200));
              
            } catch (error) {
              console.error('ContaPerfil: Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao sair da conta. Tente novamente.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        <TouchableOpacity
          style={styles.contaListItem}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Termos")}
        >
          <Text style={styles.contaListTitle}>
            Termos de Uso e Política de Privacidade
          </Text>
          <RectButton style={styles.contaButton}>
            <AntDesign name="right" size={18} color="rgba(0, 0, 0, 0.45)" />
          </RectButton>
        </TouchableOpacity>
        <View style={styles.contaListItemDisconnect}>
          <Text style={styles.contaListTitleDisconnect}>
            Desconectar sua conta
          </Text>
          <RectButton
            onPress={handleLogout}
            style={styles.contaButton}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator size="small" color={Colors.blue} />
            ) : (
              <MaterialCommunityIcons
                name="logout"
                size={22}
                color={Colors.blue}
              />
            )}
          </RectButton>
        </View>
      </View>

      <NavBar setSelected={[0, 0, 1]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  list: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
  },

  contaListItem: {
    flexDirection: "row",
    justifyContent: "space-between",

    width: "100%",

    minHeight: 50,
    paddingLeft: 20,
    paddingVertical: 5,

    alignItems: "center",

    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  contaListItemDisconnect: {
    flexDirection: "row",
    justifyContent: "space-between",

    width: "100%",

    minHeight: 50,
    paddingLeft: 20,
    paddingVertical: 5,

    alignItems: "center",
  },
  contaListTitle: {
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    fontSize: 15,
    lineHeight: 21,

    color: Colors.black,
    width: 0,
    flexGrow: 1,
  },
  contaListTitleDisconnect: {
    fontFamily: Fonts.regular,
    fontStyle: "normal",
    fontSize: 15,
    lineHeight: 21,

    color: Colors.blue,
    width: 0,
    flexGrow: 1,
  },
  contaButton: {
    height: 50,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
});
