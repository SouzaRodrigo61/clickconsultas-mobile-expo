import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
} from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import api from '../services/api.js'
import Colors from '../styles/Colors'
import Fonts from '../styles/Fonts'
const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export default function Termos() {
  const [pdf, setPdf] = useState({
    file_url: '',
    criado_em: '',
  })
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)

  const fetch = async () => {
    api.get(`/pdf`).then(({ data: pdf }) => {
      setPdf(pdf)
    })
  }

  useEffect(() => {
    let isMounted = true
    if (isMounted) fetch()
    return () => {
      isMounted = false
    }
  }, [])

  const openPdf = async () => {
    if (pdf.file_url) {
      await WebBrowser.openBrowserAsync(pdf.file_url)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        {loading ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              height: screenHeight - 150,
            }}
          >
            <ActivityIndicator color={Colors.blue} size="large" />
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 16, color: Colors.blue, textAlign: 'center', marginBottom: 20 }}>
              Para visualizar os termos de uso, clique no botão abaixo:
            </Text>
            <TouchableOpacity 
              style={styles.button}
              onPress={openPdf}
            >
              <Text style={styles.buttonText}>Abrir Termos de Uso</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scrollContainer: {
    width: screenWidth - 35,
    marginTop: 20,
    marginBottom: 20,
  },
  textContent: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 19,
    color: 'black',
    marginLeft: 10,
    textAlign: 'justify',
  },
  button: {
    backgroundColor: Colors.blue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
