import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import Fonts from '../../styles/Fonts'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

interface Especialidades {
  especialidade: string
  rqe: number
  favorita: boolean
}

interface Experiencias {
  titulo: string
  descricao: string
  ano: number
}

interface Formacoes {
  instituicao: string
  curso: string
  ano: number
}

interface Data {
  id_medico: any
  especialista: string
  valor_real: number
  especialidades: Especialidades[]
  experiencias: Experiencias[]
  formacoes: Formacoes[]
  loading: boolean
}

import Colors from '../../styles/Colors'

export default function CardMaisSobre({
  id_medico,
  especialidades,
  experiencias,
  formacoes,
  especialista,
  loading,
  valor_real,
}: Data) {
  const navigation = useNavigation()

  function handlePressEspecialidades() {
    navigation.navigate('MaisSobreEspecialidades', {
      especialidades,
      especialista,
      loading,
      id_medico,
      valor_real,
    })
  }

  function handlePressEducacao() {
    navigation.navigate('MaisSobreEducacao', {
      formacoes,
      especialista,
      loading,
      id_medico,
      valor_real,
    })
  }

  function handlePressExperiencia() {
    navigation.navigate('MaisSobreExperiencia', {
      experiencias,
      especialista,
      loading,
      id_medico,
      valor_real,
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.firstLayer}>
        <Text style={styles.textFirstLayer}>Mais sobre </Text>
        <Text style={styles.textFirstLayer}>{especialista}</Text>
      </View>
      <View style={styles.secondLayer}>
        <View style={styles.secondLayerContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.blue} />
          ) : (
            <RectButton
              style={styles.buttomSecondLayer}
              onPress={handlePressEspecialidades}
            >
              <Text style={styles.textSecondLayer}>Especialidades</Text>
              <AntDesign name="right" size={24} color="black" />
            </RectButton>
          )}
        </View>
        <View style={styles.secondLayerContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.blue} />
          ) : (
            <RectButton
              style={styles.buttomSecondLayer}
              onPress={handlePressEducacao}
            >
              <Text style={styles.textSecondLayer}>Formações</Text>
              <AntDesign name="right" size={24} color="black" />
            </RectButton>
          )}
        </View>
        <View style={styles.secondLayerContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.blue} />
          ) : (
            <RectButton
              style={styles.buttomSecondLayer}
              onPress={handlePressExperiencia}
            >
              <Text style={styles.textSecondLayer}>Experiência</Text>
              <AntDesign name="right" size={24} color="black" />
            </RectButton>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: screenWidth - 40,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.softGray,
    borderRadius: 4,
    paddingBottom: 5,
    backgroundColor: Colors.white,
    shadowColor: Colors.softGray,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0.4,
  },

  firstLayer: {
    flexDirection: 'row',
    width: screenWidth - 80,
    paddingVertical: 20,
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.softGray,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  textFirstLayer: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    lineHeight: 19,
  },

  secondLayer: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 5,
  },
  secondLayerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.softGray,
  },
  buttomSecondLayer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
  },
  textSecondLayer: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    lineHeight: 21,
  },
})
