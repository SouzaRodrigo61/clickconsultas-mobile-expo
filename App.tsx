import React, { useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/contexts/auth";
import { ProfileProvider } from "./src/contexts/profile";
import Routes from "./src/routes/";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFonts, loadAsync } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';

import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_300Light,
} from "@expo-google-fonts/roboto";

import {
  Lato_100Thin,
  Lato_100Thin_Italic,
  Lato_300Light,
  Lato_300Light_Italic,
  Lato_400Regular,
  Lato_400Regular_Italic,
  Lato_700Bold,
  Lato_700Bold_Italic,
  Lato_900Black,
  Lato_900Black_Italic,
} from "@expo-google-fonts/lato";
import moment from "moment";

// Manter a splash screen visível enquanto carrega as fontes
SplashScreen.preventAutoHideAsync();

export default function App() {
  console.log('App: Componente inicializado');
  console.log('App: Verificando se está executando...');
  
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_300Light,

    Lato_100Thin,
    Lato_100Thin_Italic,
    Lato_300Light,
    Lato_300Light_Italic,
    Lato_400Regular,
    Lato_400Regular_Italic,
    Lato_700Bold,
    Lato_700Bold_Italic,
    Lato_900Black,
    Lato_900Black_Italic,
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  
  moment.locale("pt-BR");

  return (
    <NavigationContainer>
      <AuthProvider>
        <ProfileProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <Routes />
          </SafeAreaView>
        </ProfileProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}