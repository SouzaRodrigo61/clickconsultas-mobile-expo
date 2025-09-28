import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import Colors from '../../styles/Colors'
import Fonts from '../../styles/Fonts'
import elipseazul from '../icons/elipse-azul.png'
import elipsepreta from '../icons/elipse-preto.png'

export default function ProblemasSaude() {
  const arrayProblemasSaude = [
    'Problema de Gravidez',
    'Diabete',
    'Estresse & Ansiedade',
    'Dor de Estômago',
    'Problema de Gravidez',
    'Diabete',
    'Estresse & Ansiedade',
    'Dor de Estômago',
    'Problema de Gravidez',
    'Diabete',
    'Estresse & Ansiedade',
    'Dor de Estômago',
    'Problema de Gravidez',
    'Diabete',
    'Estresse & Ansiedade',
    'Problema de Gravidez',
    'Diabete',
    'Estresse & Ansiedade',
    'Dor de Estômago',
    'Problema de Gravidez',
    'Diabete',
    'Estresse & Ansiedade',
  ]

  return (
    <View style={styles.container}>
      <View style={styles.cardcontainer}>
        {arrayProblemasSaude.map((tipoProblemaSaude, index) => (
          <RectButton
            style={styles.card}
            key={index}
            onPress={() => {
              /* alert('Button Test'); */
            }}
          >
            <Image
              source={index % 2 ? elipseazul : elipsepreta}
              style={styles.image}
            />
            <Text style={styles.text}>{tipoProblemaSaude}</Text>
          </RectButton>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.softGray,
    backgroundColor: Colors.white,
  },

  cardcontainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: Colors.white,
    justifyContent: 'center',
  },
  card: {
    width: 80,
    height: 100,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  text: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 14,
    fontSize: 12,
    color: Colors.black,
    fontFamily: Fonts.regular,
    height: 25,
  },
  image: {
    margin: 5,
    width: 51,
    height: 51,
  },
})
