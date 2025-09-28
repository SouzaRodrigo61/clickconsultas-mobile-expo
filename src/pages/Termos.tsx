import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import Pdf from 'react-native-pdf'
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

  const source_fetch = {
    uri: pdf.file_url,
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
          <Pdf
            source={source_fetch}
            trustAllCerts={false}
            style={{ width: screenWidth - 35, height: screenHeight - 150 }}
          />
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
  pdf: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
})
