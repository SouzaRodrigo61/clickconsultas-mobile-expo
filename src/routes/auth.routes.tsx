import React, { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { createStackNavigator } from "@react-navigation/stack";
import { Modal } from "react-native";

import {
  BemVindo,
  Entrar,
  Cadastro,
  RecuperarSenha1,
  RecuperarSenha2,
  RecuperarSenha3,
} from "../pages";

import StatusBar from "../components/StatusBar";
import ConnectedTrue from "../components/IsConnected/ConnectedTrue";
import ConnectedFalse from "../components/IsConnected/ConnectedFalse";

const AuthStack = createStackNavigator();

const AuthRoutes: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
    });
  }, [isConnected, setIsConnected]);

  useEffect(() => {
    setIsVisible(true);

    if (isConnected === true) {
      setTimeout(() => {
        setIsVisible(false);
      }, 900);
    } else if (isConnected === false) {
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }
  }, []);

  return (
    <>
      <StatusBar />

      {isConnected ? (
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={isVisible}
          statusBarTranslucent={true}
        >
          <ConnectedTrue />
        </Modal>
      ) : (
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={isVisible}
          statusBarTranslucent={true}
        >
          <ConnectedFalse />
        </Modal>
      )}
      <AuthStack.Navigator>
        <AuthStack.Screen
          name="Entrar"
          component={Entrar}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen name="BemVindo" component={BemVindo} />
        <AuthStack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="RecuperarSenha1"
          component={RecuperarSenha1}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="RecuperarSenha2"
          component={RecuperarSenha2}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="RecuperarSenha3"
          component={RecuperarSenha3}
          options={{ headerShown: false }}
        />
      </AuthStack.Navigator>
    </>
  );
};

export default AuthRoutes;
