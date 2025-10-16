import React, { useState } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import BuscarLocalidadeSearch from '../components/Localidade/BuscarLocalidadeSearch'
import SafeAreaWrapper from '../components/SafeAreaWrapper'
import Colors from '../styles/Colors'
import Fonts from '../styles/Fonts'

import ResultadoLocalidade from '../components/Localidade/ResultadoLocalidade'
import StatusBar from '../components/StatusBar'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export default function BuscarLocalidade1() {
  const [data, setData] = useState({
    search: '',
    picker: 'SP', // Valor padrão para São Paulo
    loading: false,
    loadingGeo: false,
  })

  const [searchResult, setSearchResult] = useState([])

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <StatusBar color="#2fa8d5" barStyle="light-content" />

        <View style={styles.topContainer}>
          <BuscarLocalidadeSearch
            setSearchResult={setSearchResult}
            data={data}
            setData={setData}
          />
        </View>

        <Text style={styles.localidades}>Localidades</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <ResultadoLocalidade
            searchResult={searchResult}
            data={data}
            setData={setData}
          />
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.softGray,
  },

  topContainer: {
    backgroundColor: Colors.blue,
    position: 'relative',
    top: 0,
    paddingTop: 12,
    width: screenWidth,
  },

  localizacaoAtual: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    height: 50,
    padding: 16,
  },

  localizacaoAtualText: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: Fonts.bold,
    color: Colors.blue,
  },

  localidades: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: Fonts.bold,
    fontStyle: 'normal',

    color: Colors.black,

    paddingVertical: 10,
    paddingHorizontal: 16,
  },
})
