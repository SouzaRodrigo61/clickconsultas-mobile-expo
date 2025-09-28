import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Dimensions } from 'react-native';

import Colors from '../styles/Colors';
import Fonts from "../styles/Fonts";
interface BotaoBrancoProps{
    link: any;
    buttontext: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function BotaoBranco({buttontext, link}: BotaoBrancoProps){

  return(

    <TouchableHighlight 
        onPress={link}
        style={{
            marginTop: 16,
            marginBottom: 32,
            borderRadius: 4
          }}
    >
        <View style={styles.botaoBranco} >
            <Text style={styles.botaoBrancoText}>{buttontext}</Text>
        </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({

    botaoBranco: {
        backgroundColor: Colors.white,
        borderWidth: 1.4,
        borderColor: Colors.blue,
        borderRadius: 4,

        justifyContent: 'center',
        alignItems: 'center',
        
        width: screenWidth-40,
        maxWidth: 600,
        height: 59,
    },
    
    botaoBrancoText: {
        fontSize: 18,
        lineHeight: 24,
        fontFamily: Fonts.regular,
        fontStyle: 'normal',

        color: Colors.blue,
    },

});