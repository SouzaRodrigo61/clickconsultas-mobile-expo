import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface CloseIconProps{
  colorIcon: string;
}

export default function Closa({colorIcon}: CloseIconProps){
    const navigation = useNavigation();
    
    return(     
    <RectButton style={styles.buttoncontainer} onPress={() => navigation.navigate('CadastroFinalizar')} >
      <AntDesign name="close" size={19.5} color={colorIcon} />
    </RectButton>                        
    )     
}

const styles = StyleSheet.create({
      buttoncontainer: {
        flex: 1,
        justifyContent: "center",
        marginLeft: 24,
        padding: 4,
      }
});