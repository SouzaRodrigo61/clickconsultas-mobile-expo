import React from "react";
import { View, ActivityIndicator } from "react-native";

import { useAuth } from "../contexts/auth";
import { useProfile } from "../contexts/profile";
import { useAndroidBackHandler } from "../hooks/useAndroidBackHandler";

import AuthRoutes from "../routes/auth.routes";
import AppRoutes from "../routes/app.routes";

const Routes: React.FC = () => {
  console.log('Routes: Componente renderizado');
  const { signed, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  
  // Aplicar o hook de back handler para Android
  useAndroidBackHandler();

  console.log('Routes render - signed:', signed, 'authLoading:', authLoading, 'profileLoading:', profileLoading, 'hasProfile:', !!profile);

  if (authLoading || profileLoading) {
    console.log('Routes: Mostrando loading...');
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  // Verificar se há algum problema específico
  if (!authLoading && !profileLoading && signed === undefined) {
    console.log('Routes: Estado indefinido detectado, mostrando loading...');
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  console.log('Routes: Renderizando:', signed ? 'AppRoutes' : 'AuthRoutes');
  return signed ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
