import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import Colors from '../styles/Colors';
import Fonts from "../styles/Fonts";
interface NextProps{
    linkNext: any;
}

export default function HeaderButtonsBackNext ({ linkNext }: NextProps) {
    const navigation = useNavigation(); 

    function handleNavigateBack(){
        navigation.goBack();
    }
    
    function handleNavigateNext(){
        navigation.navigate(linkNext);
    }

    return(
        <View style={styles.container}>
            <RectButton style={styles.buttoncontainer} onPress={handleNavigateBack}>
                <Text style={styles.text}>Voltar</Text>
            </RectButton>
            <RectButton style={styles.buttoncontainer} onPress={handleNavigateNext}>
                <Text style={styles.text}>Próximo</Text>
            </RectButton>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: "center",
      alignContent: 'center',  
    },
    buttoncontainer: {
      justifyContent: "center",
      marginRight: 16,
    },
    text: {
      fontFamily: Fonts.bold,
      fontStyle: 'normal',
      fontSize: 14,
      lineHeight: 17,
      color: Colors.white,
      textAlign: 'right',
      textTransform: 'uppercase',
    }
});