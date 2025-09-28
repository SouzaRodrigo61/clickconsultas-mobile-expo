import React from 'react';
import { StyleSheet, TextInput, Dimensions } from 'react-native';

import Colors from '../styles/Colors';
import Fonts from "../styles/Fonts";

interface InputProps{
    placeholder: string;
    naoExibir: any
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');


export default function Input({placeholder, naoExibir}: InputProps){

  return(

    <TextInput
        placeholder={placeholder}
        secureTextEntry={naoExibir}
        placeholderTextColor='rgba(0, 0, 0, 0.4)'
        style={styles.input}
    />
    
  )
}

const styles = StyleSheet.create({

    input: {
        backgroundColor: '#fff',
        borderWidth: 1.4,
        borderColor: Colors.input,
        borderRadius: 4,

        width: screenWidth-40,
        maxWidth: 600,
        height: 50,
        paddingHorizontal: 14,
        marginBottom: 16,

        textAlignVertical: 'center',

        fontSize: 16,
        fontFamily: Fonts.regular,
        fontStyle: 'normal',
    },
});