import React from 'react';
import { StyleSheet, View, Text, Dimensions} from 'react-native';
import CardTextServicos from '../components/Servicos/CardTextServicos';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import NavBar from '../components/NavBar';
import  Colors  from '../styles/Colors';
import Fonts from "../styles/Fonts";
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Servicos() {
    const navigation = useNavigation(); 

    return(
        <View style={styles.container}>
            <ScrollView style={styles.scrollcontainer}>
                <CardTextServicos/>

                <View style={styles.buttonscontainer}>
                    <RectButton style={styles.buttoncontainerAzul} 
                        onPress={() => (navigation.navigate('SelecioneData'))}
                    >
                        <Text style={styles.textButton}>Agendar Consulta</Text>
                    </RectButton> 
                </View>
            </ScrollView>

            <View style={styles.navcontainer}>
                <NavBar setSelected={[1,0,0]}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%'
    },

    scrollcontainer: {
    },

    buttonscontainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttoncontainerAzul:{
        width: screenWidth-20,
        height: 40,
        backgroundColor: Colors.blue,
        borderWidth: 1,
        borderRadius: 4,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    textButton: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        lineHeight: 19,
        color: Colors.white
    },

    navcontainer: {
        position: 'relative',
        bottom: 0,
    },

});