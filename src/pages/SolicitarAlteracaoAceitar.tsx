import React, {useState} from 'react';

import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import Colors from '../styles/Colors';
import Fonts from "../styles/Fonts";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SolicitarAlteracaoAceitar(){

    const navigation = useNavigation();
  
    function handleNavigateToCompromissos(){
        navigation.navigate('Compromissos');
    }
  
    function handleNavigateToHome(){
        navigation.navigate('Home');
    }

  const [isVisible, setIsVisible] = useState(true)
  function showMore() {
    setIsVisible(!isVisible);
  }

  return(
    <View style={styles.container}>
      <View style={styles.content}>

        <Text style={styles.title}>Sua consulta foi reagendada com sucesso!</Text>
        <Text style={styles.text}>Você sempre pode ver suas consultas pelo menu de compromissos.</Text>

        <View style={styles.whiteButtonBorder}>
            <RectButton style={styles.whiteButton} onPress={handleNavigateToCompromissos}>
                <Text style={styles.whiteButtonText}>Compromissos</Text>
            </RectButton>
        </View>
        <RectButton style={styles.finalizarButton} onPress={handleNavigateToHome}>
            <Text style={styles.finalizarButtonText}>Finalizar</Text>
        </RectButton>
        
      </View>
    </View>
)
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },

  content: {
    width: screenWidth-40,
    maxWidth: 600,

    alignSelf: 'center',
    backgroundColor: Colors.white,

    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 40,

    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DADADA',
  },

  title: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: Fonts.bold,
    textAlign:'center',

    marginBottom: 20,

    color: '#37D363',
  },

  text: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: Fonts.regular,
    textAlign:'center',

    color: Colors.black,
  },

  whiteButton: {
    width: 160,
    height: 40,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 4,
    backgroundColor: 'white',
  },

  whiteButtonBorder: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.blue,
    
    marginTop: 40,

    alignSelf: 'center',
  },

  whiteButtonText: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: Fonts.bold,

    color: Colors.blue,
  },

  finalizarButton: {
    width: 160,
    height: 40,
    
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',

    borderRadius: 4,
    marginTop: 5,

    backgroundColor: 'white',
  },

  finalizarButtonText: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: Fonts.bold,

    color: Colors.black,
  },

});