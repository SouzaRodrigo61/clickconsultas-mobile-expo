import { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useAndroidBackHandler = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Verifica se pode voltar na pilha de navegação
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      
      // Se não pode voltar, mostra um alerta para sair do app
      Alert.alert(
        'Sair do App',
        'Deseja realmente sair do ClickConsultas?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Sair',
            style: 'destructive',
            onPress: () => BackHandler.exitApp(),
          },
        ]
      );
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);
};
