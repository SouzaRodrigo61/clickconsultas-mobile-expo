import React, { useState, useEffect } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native'
import BuscarLocalidadeSearch from '../components/Localidade/BuscarLocalidadeSearch'
import SafeAreaWrapper from '../components/SafeAreaWrapper'
import Colors from '../styles/Colors'
import Fonts from '../styles/Fonts'

import ResultadoLocalidade from '../components/Localidade/ResultadoLocalidade'
import StatusBar from '../components/StatusBar'
import { useProfile } from '../contexts/profile'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export default function BuscarLocalidade1() {
  const { profile, loading: profileLoading } = useProfile()
  
  console.log('BuscarLocalidade1: Componente renderizado com profile:', {
    hasProfile: !!profile,
    hasLocalidade: !!profile?.localidade,
    localidade: profile?.localidade,
    profileLoading
  });
  
  const [data, setData] = useState({
    search: '', // Inicializa vazio, será preenchido pelo useEffect
    picker: '', // Inicializa vazio, será preenchido pelo useEffect
    loading: false,
    loadingGeo: false,
  })

  const [searchResult, setSearchResult] = useState([])

  // Atualizar o estado e cidade quando o profile carregar
  useEffect(() => {
    console.log('BuscarLocalidade1: useEffect executado - profileLoading:', profileLoading, 'profile:', profile);
    
    if (!profileLoading) {
      if (profile?.localidade) {
        console.log('BuscarLocalidade1: Carregando localização salva:', profile.localidade);
        setData(prevData => ({
          ...prevData,
          picker: profile.localidade.estado,
          search: profile.localidade.cidade
        }));
      } else {
        console.log('BuscarLocalidade1: Nenhuma localização salva encontrada, usando padrão SP');
        setData(prevData => ({
          ...prevData,
          picker: 'SP',
          search: ''
        }));
      }
    }
  }, [profile?.localidade, profileLoading]);

  // Monitorar mudanças no profile após carregamento inicial
  useEffect(() => {
    console.log('BuscarLocalidade1: Monitorando mudanças no profile:', {
      profileLoading,
      hasProfile: !!profile,
      hasLocalidade: !!profile?.localidade,
      localidade: profile?.localidade
    });
    
    if (!profileLoading && profile?.localidade && data.picker === 'SP') {
      console.log('BuscarLocalidade1: Profile carregou depois, atualizando dados...');
      setData(prevData => ({
        ...prevData,
        picker: profile.localidade.estado,
        search: profile.localidade.cidade
      }));
    }
  }, [profile, profileLoading]);

  // Log para debug
  useEffect(() => {
    console.log('BuscarLocalidade1 - Profile state:', {
      profileLoading,
      hasProfile: !!profile,
      hasLocalidade: !!profile?.localidade,
      localidade: profile?.localidade
    });
  }, [profile, profileLoading]);

  // Mostrar loading enquanto o profile está carregando
  if (profileLoading) {
    return (
      <SafeAreaWrapper>
        <View style={styles.container}>
          <StatusBar color="#2fa8d5" barStyle="light-content" />
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#2FA8D5" size="large" />
            <Text style={styles.loadingText}>Carregando localização...</Text>
          </View>
        </View>
      </SafeAreaWrapper>
    )
  }

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

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.softGray,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.black,
  },
})
