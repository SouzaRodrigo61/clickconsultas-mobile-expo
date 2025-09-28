import React from 'react';

import { StyleSheet, Text, View} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

export default function Buscar(){

  const navigation = useNavigation();

  return(
    <View style={styles.container}>
      
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "white"
    },
});