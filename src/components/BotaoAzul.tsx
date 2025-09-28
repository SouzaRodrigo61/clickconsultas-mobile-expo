import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Dimensions } from 'react-native';

import Colors from '../styles/Colors';
import Fonts from "../styles/Fonts";
interface BotaoAzulProps{
    link: any;
    buttontext: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function BotaoAzul({buttontext, link}: BotaoAzulProps){

  return(

    <TouchableHighlight 
      onPress={link}
      style={{
        marginTop: 16,
        borderRadius: 4
      }}
    >
      <View style={styles.botaoAzul}>
        <Text style={styles.botaoAzulText}>{buttontext}</Text>
      </View>
    </TouchableHighlight>
  )
} 

const styles = StyleSheet.create({

    botaoAzul: {
      backgroundColor: Colors.blue,
      borderRadius: 4,
      
      justifyContent: 'center',
      alignItems: 'center',

      width: screenWidth-40,
      maxWidth: 600,
      height: 59,
    },

    botaoAzulText: {
      fontSize: 18,
      lineHeight: 24,
      fontFamily: Fonts.regular,
      fontStyle: 'normal',

      color: Colors.white,
    },

});