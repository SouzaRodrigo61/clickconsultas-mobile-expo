import React from 'react';
import { StyleSheet, View, Text, Dimensions} from 'react-native';
import  Colors  from '../../styles/Colors';
import Fonts from "../../styles/Fonts";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Servicos() {
    const arrayServicos = ["Alergia Nasal", "Problema de congestionamento nasal", "Reconstrução da orelha", "Otoplastia", "Tratamento de tonsilite", "Laringe e Faringe"];

    return(
        <View style={styles.container}>
            <View style={styles.firstLayer}>
                <Text style={styles.textFirstLayer}>Serviços de </Text>
                <Text style={styles.textFirstLayer}>Dra. Maria da Silva</Text>
            </View>
            <View style={styles.secondLayer}>
            {arrayServicos.map((servico, index) => (
                <View style={styles.textContainerSecondLayer} key={index}>
                        <Text style={styles.textSecondLayer}>•  </Text>
                        <Text style={styles.textSecondLayer}>{servico}</Text>
                </View>
            ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        width: screenWidth-20,
        alignSelf: 'center',
        borderWidth: 1,
        borderRadius: 4,
        borderColor: Colors.softGray,
        backgroundColor: Colors.white
    },

    firstLayer:{
        flexDirection: 'row',
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
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
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
});
