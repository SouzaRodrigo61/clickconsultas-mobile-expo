import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { SearchBar } from '@rneui/themed'
import axios from 'axios'
import * as Location from 'expo-location'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler'
import RNPickerSelect from 'react-native-picker-select'
import { useProfile } from '../../contexts/profile'
import api from '../../services/api'
import Colors from '../../styles/Colors'
import Fonts from '../../styles/Fonts'
import { saveLocalidadeOnAsyncStorage } from '../../utils/locationStorage'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

interface Data {
  search: string
  picker: string
  loading: boolean
  loadingGeo: boolean
}

interface BuscarLocalidadeSearchProps {
  setSearchResult: any
  data: Data
  setData: React.Dispatch<React.SetStateAction<Data>>
}

export default function BuscarLocalidadeSearch({
  setSearchResult,
  data,
  setData,
}: BuscarLocalidadeSearchProps) {
  const { setProfile } = useProfile()
  const navigation = useNavigation()

  function handleNavigateToBuscarLocalidade1() {
    navigation.navigate('Home')
  }

  const [cities, setCities] = useState([] as any)
  const [ufs, setUfs] = useState([] as any)
  useEffect(() => {
    axios
      .get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then((resp) => {
        setUfs([...resp.data.sort((a, b) => a.sigla > b.sigla)])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (data.picker.trim() !== '') {
      setData((state) => ({ ...state, loading: true }))
      axios
        .get(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${data.picker}/municipios`,
        )
        .then((resp) => {
          const cityList = resp.data
            .map((city) => city.nome)
            .sort((a, b) => a.localeCompare(b)) // Ignorando acentos
          setCities(cityList)
        })
    }
  }, [data.picker])

  useEffect(() => {
    let isMounted = true

    if (isMounted) {
      setData((state) => ({ ...state, loading: false }))
      setSearchResult(cities)
    }

    return () => {
      isMounted = false
    }
  }, [cities])

  function handleChangeText(search: any) {
    setData((state) => ({ ...state, search }))
    const regex = new RegExp(`${search}`, 'i')
    const filteredSearch: any = cities.filter((city) => {
      if (regex.test(city)) {
        return city
      }
    })

    setSearchResult(filteredSearch)
  }

  async function handleCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      console.log('Permission to access location was denied')
      return
    }

    setData((state) => ({ ...state, loadingGeo: true }))

    let location = await Location.getCurrentPositionAsync({})

    console.log(location)

    api
      .post('/city-uf', {
        search: [location.coords.latitude, location.coords.longitude].join(','),
      })
      .then(async ({ data }) => {
        if (data.estado && data.estado.trim() !== '') {
          const localidade = {
            cidade: data.cidade,
            estado: data.estado,
            lat: location.coords.latitude,
            long: location.coords.longitude,
          }

          setData((state) => ({ ...state, loadingGeo: false }))
          setProfile((state: any) => ({
            ...state,
            localidade,
          }))
          await saveLocalidadeOnAsyncStorage(localidade)

          navigation.navigate('Home')
        }
      }),
      (error) => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  }

  return (
    <>
      <View style={styles.container}>
        <RectButton
          style={styles.buttoncontainer}
          onPress={handleNavigateToBuscarLocalidade1}
        >
          <AntDesign name="close" size={20} color="white" />
        </RectButton>
        <View>
          <RNPickerSelect
            onValueChange={(itemValue) =>
              setData((state) => ({ ...state, picker: itemValue }))
            }
            value={data.picker}
            items={ufs.map((uf) => ({ label: uf.sigla, value: uf.sigla }))}
            useNativeAndroidPickerStyle={false}
            style={{
              placeholder: { color: 'white' },
              inputAndroid: { color: 'white' },
              inputAndroidContainer: {
                height: 50,
                width: 65,
                paddingLeft: 12,
                justifyContent: 'center',
              },
              inputIOS: { color: 'white' },
              inputIOSContainer: {
                height: 50,
                width: 65,
                paddingLeft: 12,
                justifyContent: 'center',
              },
            }}
            Icon={() => (
              <MaterialIcons
                name="chevron-right"
                size={20}
                color="white"
                style={{ transform: [{ rotate: '90deg' }] }}
              />
            )}
            placeholder={{ label: 'UF', value: '' }}
          />
        </View>
        <SearchBar
          searchIcon={false}
          platform="default"
          placeholder="Busque por uma cidade..."
          placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
          inputStyle={{
            fontFamily: Fonts.regular,
            fontSize: 16,
            lineHeight: 19,
            fontStyle: 'normal',
            color: Colors.white,
          }}
          inputContainerStyle={{
            backgroundColor: Colors.blue,
          }}
          containerStyle={{
            justifyContent: 'center',
            backgroundColor: Colors.blue,
            height: 50,
            width: screenWidth - 160,
            borderBottomColor: 'transparent',
            borderTopColor: 'transparent',
            marginRight: 5,
          }}
          clearIcon={
            <TouchableOpacity onPress={() => handleChangeText('')}>
              <AntDesign name="close" size={20} color={Colors.softGray} />
            </TouchableOpacity>
          }
          onChangeText={handleChangeText}
          value={data.search}
          loadingProps={{ animating: true, color: Colors.blue }}
          disabled={data.picker.trim() === ''}
        />
      </View>
      <TouchableOpacity
        style={styles.localizacaoAtual}
        activeOpacity={0.7}
        onPress={handleCurrentLocation}
      >
        {data.loadingGeo ? (
          <>
            <Text style={styles.localizacaoAtualText}>
              Verificando sua localização...
            </Text>
            <ActivityIndicator color="#2FA8D5" size="large" />
          </>
        ) : (
          <>
            <Text style={styles.localizacaoAtualText}>
              Use sua localização atual
            </Text>
            <MaterialIcons name="my-location" size={18} color={Colors.blue} />
          </>
        )}
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: screenWidth,
  },
  buttoncontainer: {
    justifyContent: 'center',
    marginLeft: 24,
    marginRight: 4,
    padding: 4,
  },
  text: {
    fontFamily: Fonts.light,
    fontStyle: 'normal',
    fontSize: 14,
    lineHeight: 16.41,
    color: '#000000',
    marginLeft: 8,
    marginRight: 4,
    textAlign: 'right',
  },
  onePickerItem: {
    marginTop: 2,
    height: 50,
    width: 85,
    color: 'white',
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
})
