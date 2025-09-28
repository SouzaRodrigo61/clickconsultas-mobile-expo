import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import Colors from '../../styles/Colors';
import Fonts from "../../styles/Fonts";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CardServicos() {

    const arrayServicos = ["Alergia Nasal", "Problema de congestionamento nasal", "Reconstrução da orelha", "Otoplastia", "Tratamento de tonsilite", "Laringe e Faringe"];

    const navigation = useNavigation();

    function handlePress(){
        navigation.navigate('Servicos')
    }

    return(
        <View style={styles.container}>
            <View style={styles.firstLayer}>
                <Text style={styles.textFirstLayer}>Serviços de </Text>
                <Text style={styles.textFirstLayer}>Dra. Maria da Silva</Text>
            </View>
            <View style={styles.secondLayer}>
            {arrayServicos.slice(0, 5).map((servico, index) => (
                <View style={styles.textContainerSecondLayer} key={index}>
                        <Text style={styles.textSecondLayer}>•  </Text>
                        <Text style={styles.textSecondLayer}>{servico}</Text>
                </View>
            ))}
            </View>
            <View style={styles.thirdLayer}>
                <RectButton style={styles.button} onPress={handlePress}>
                    <Text style={styles.textThirdLayer}>Mostrar todos os serviços</Text>
                </RectButton>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        width: screenWidth-40,
        height: 300,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: Colors.softGray,
        borderRadius: 4,
        backgroundColor: Colors.white,
        shadowColor: Colors.softGray,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 0.4,
    },
    firstLayer:{
        flexDirection: 'row',
        width: screenWidth-80,
        height: 60,
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.softGray,
        alignItems: 'center'
        
    },
    textFirstLayer:{
        fontFamily: Fonts.bold, 
        fontSize: 16,
        lineHeight: 19,
    },

    secondLayer: {
        height: 180,
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.softGray,
    },
    textContainerSecondLayer: {
        flexDirection: 'row',
        marginTop: 16,
    },
    textSecondLayer: {
        fontFamily: Fonts.regular, 
        fontSize: 16,
        lineHeight: 19,
    },

    thirdLayer:{
        marginLeft: 20,
        marginRight: 20,
        marginTop: 16,
        marginBottom: 26,
    },
    textThirdLayer:{
        fontFamily: Fonts.bold, 
        fontSize: 16,
        lineHeight: 19,
        color: Colors.blue,
    },
    button:{
        paddingTop: 6,
        paddingBottom: 6,
    }
});