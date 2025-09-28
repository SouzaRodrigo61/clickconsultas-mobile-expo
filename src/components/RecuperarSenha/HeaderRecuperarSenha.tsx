import React from 'react';
import { StyleSheet, Text, ImageBackground, Dimensions, View } from 'react-native';

import Colors from '../../styles/Colors';
import Fonts from "../../styles/Fonts";

import BackgroundImage from '../../images/recuperar-senha.png';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HeaderRecuperarSenha(){

    return(

        <ImageBackground
            source={BackgroundImage}
            style={styles.image}>
            <View style={styles.container}>
                <Text style={styles.title1}>
                    Recuperação
                </Text>
                <Text style={styles.title2}>
                    de senha
                </Text>
            </View>
        </ImageBackground>

    );
}

const styles = StyleSheet.create({

    image: {
        flex:1,
        position: 'relative',
        
        marginBottom: 32,
        height: 287,
        padding:35,
    },

    container: {
        width: screenWidth-40,
        maxWidth: 600,
        alignSelf: 'center',
    },

    title1: {
        fontSize: 30,
        lineHeight: 38,
        fontFamily: Fonts.bold,
        fontStyle: 'normal',

        textAlign: 'left',
        color: Colors.white,

        marginTop: 150,
    },

    title2: {
        fontSize: 30,
        lineHeight: 38,
        fontFamily: Fonts.bold,
        fontStyle: 'normal',

        textAlign: 'left',
        color: Colors.white,
    },

});