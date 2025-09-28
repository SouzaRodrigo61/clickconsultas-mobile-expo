import { SearchBar } from '@rneui/themed'
import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'

import Colors from '../styles/Colors'
import Fonts from '../styles/Fonts'

import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import CardEspecilidades from '../components/EncontreAgende/Especialidades'
import HeaderLocation from '../components/Localidade/HeaderLocation'
import NavBar from '../components/NavBar'
import CardFiltros from '../components/Search/CardFiltros'
import ModalFiltro from '../components/Search/ModalFiltro'
import ModalOrdem from '../components/Search/ModalOrdem'
import SearchDoctor from '../components/Search/SearchDoctor'
import ArrowLeftButton from '../components/icons/ArrowLeft'
import { useProfile } from '../contexts/profile'
import { request } from '../utils/preventTooManyRequests.js'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export default function EncontreAgende({ route }) {
  const { localidade, especialidades } = route.params
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Por proximidade')
  const [order, setOrder] = useState('Randômico')
  const [radius, setRadius] = useState(30)
  const [modalLocalidadeVisible, setModalLocalidadeVisible] = useState(false)

  const { profile } = useProfile()

  // shows SearchComponent
  const [show, setShow] = useState<boolean>(true)

  //shows FilterModal
  const [modal, setModal] = useState(false)
  const [modalOrder, setModalOrder] = useState(false)

  // filter search result
  const [searchResult, setSearchResult] = useState([])

  // Hide NavBAr when keybord is active
  const [hideNav, setHideNav] = useState(true)

  function handleNavigateExplorarMais() {
    navigation.navigate('Especialidades', {
      especialidades: [...especialidades],
    })
  }

  function handleNavigateToBuscarLocalidade1() {
    navigation.navigate('BuscarLocalidade1')
  }

  function shuffle() {
    let array = searchResult
    let currentIndex = array.length,
      randomIndex

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      ;[array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ]
    }

    setSearchResult(array)
  }

  function alphabeticalOrder() {
    let array = searchResult

    array = array.sort((a, b) => {
      if (a.nome_completo < b.nome_completo) {
        return -1
      }
      if (a.nome_completo > b.nome_completo) {
        return 1
      }
      return 0
    })

    setSearchResult(array)
  }

  const navigation = useNavigation()

  useEffect(() => {
    let isMounted = true
    if (route.params.searchBySpec && isMounted) {
      setSearch(route.params.spec)
    }
    return () => {
      isMounted = false
    }
  }, [route.params])

  const fetch = async () => {
    if (search.trim() === '') return
    setLoading(true)

    const params = {
      lat: `${profile?.localidade.lat}`,
      long: `${profile?.localidade.long}`,
      radius: `${radius}`,
      nome: search,
      order: order,
    }

    const res = await request(
      `/list-medicos/?${new URLSearchParams(params).toString()}`,
    )
    const novosMedicos = await res?.data

    setSearchResult(novosMedicos)
    setLoading(false)
  }

  useEffect(() => {
    let isMounted = true
    let keyboardDidShowListener, keyboardDidHideListener

    if (isMounted) {
      fetch()

      if (search == '') {
        setShow(true)
      } else {
        setShow(false)
      }

      keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
        setHideNav(false) // or some other action
      })
      keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        setHideNav(true) // or some other action
      })
    }
    return () => {
      isMounted = false
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [search, radius])

  useEffect(() => {
    let isMounted = true
    if (!profile?.localidade && isMounted) {
      return setModalLocalidadeVisible(true)
    }
    return () => {
      isMounted = false
    }
  }, [])

  function handleChangeText(search: any) {
    setSearch(search)
    if (search == '') {
      setShow(true)
    } else {
      setShow(false)
    }
  }

  function handleCancel() {
    setShow(true)
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ArrowLeftButton colorIcon="#FFFFFF" />
        <View style={styles.headerContainerText}>
          <Text style={styles.textHeader}>Encontre & Agende</Text>
          <HeaderLocation location={localidade} />
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Modal
          animationType="fade"
          visible={modalLocalidadeVisible}
          onRequestClose={() => navigation.navigate('Home')}
        >
          <View style={styles.containerModalCancelar}>
            <View style={styles.modalCancelar}>
              <Text style={styles.modalTitle}>
                Precisamos saber onde você quer procurar por especialistas antes
                de prosseguir.
              </Text>
              <Text style={styles.modalText}>
                Clique no botão abaixo para informar sua localização.
              </Text>
              <View style={styles.cancelarButtonModal}>
                <TouchableHighlight
                  onPress={() => {
                    setModalLocalidadeVisible(!modalLocalidadeVisible)
                  }}
                  onPressIn={handleNavigateToBuscarLocalidade1}
                  style={styles.touchableButton}
                >
                  <View style={styles.cancelarButtonBorder}>
                    <Text style={styles.cancelarButtonText}>
                      Ajustar Localização
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.searchContainer}>
          <View style={styles.containerSrc}>
            <SearchBar
              placeholder="Busque por médicos, especialidades..."
              inputStyle={{
                fontFamily: 'Lato_400Regular',
                fontSize: 16,
                lineHeight: 19,
                fontStyle: 'normal',
                color: Colors.black,
              }}
              inputContainerStyle={{
                backgroundColor: Colors.white,
              }}
              autoFocus
              containerStyle={{
                justifyContent: 'center',
                backgroundColor: Colors.white,
                borderColor: Colors.softGray,
                borderStyle: 'solid',
                borderWidth: 1,
                borderRadius: 4,
                height: 50,
                width: screenWidth - 30,
                shadowColor: Colors.softGray,
                shadowOffset: { width: 100, height: 100 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 0.5,
              }}
              lightTheme={true}
              searchIcon={
                <AntDesign name="search1" size={18} color={Colors.softGray} />
              }
              onClear={handleCancel}
              clearIcon={
                <TouchableOpacity
                  onPress={() => {
                    handleChangeText('')
                  }}
                >
                  <AntDesign name="close" size={20} color={Colors.softGray} />
                </TouchableOpacity>
              }
              onChangeText={handleChangeText}
              value={search}
              loadingProps={{ animating: true, color: Colors.blue }}
            />
          </View>
        </View>
        {show ? (
          <ScrollView
            style={styles.especialidadesContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.grid}>
              <Text style={styles.textEspecialidades}>Especialidades</Text>
              <TouchableOpacity
                onPress={handleNavigateExplorarMais}
                activeOpacity={0.5}
              >
                <Text style={styles.text}>Explorar mais</Text>
              </TouchableOpacity>
            </View>
            <CardEspecilidades slice={20} especialidades={especialidades} />
          </ScrollView>
        ) : (
          <View style={styles.scrollSearch}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: screenWidth - 30,
              }}
            >
              <CardFiltros press={() => setModal(true)} filter={filter} />
              <CardFiltros
                press={() => setModalOrder(true)}
                filter={order}
                color="white"
              />
            </View>
            <View style={{ backgroundColor: Colors.smokeWhite }}>
              {!loading && (
                <Text style={styles.textResultadoPesquisa}>
                  Resultado da Pesquisa • {searchResult?.length || 0}{' '}
                  encontrados
                </Text>
              )}
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <SearchDoctor searchResult={searchResult} loading={loading} />
            </ScrollView>
          </View>
        )}
      </ScrollView>
      {hideNav && <NavBar setSelected={[1, 0, 0]} />}
      <ModalFiltro
        show={modal}
        close={() => setModal(false)}
        setModal={setModal}
        filter={filter}
        setFilter={setFilter}
        radius={radius}
        setRadius={setRadius}
      />

      <ModalOrdem
        show={modalOrder}
        close={() => setModalOrder(false)}
        setModal={setModalOrder}
        filter={order}
        setFilter={setOrder}
        shuffle={shuffle}
        alphabeticalOrder={alphabeticalOrder}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: Colors.smokeWhite,
    alignItems: 'center',
  },

  containerSrc: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },

  headerContainer: {
    position: 'relative',
    top: 0,
    flexDirection: 'row',
    height: 60,
    width: screenWidth,
    alignItems: 'center',
    backgroundColor: Colors.blue,
  },

  headerContainerText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 3,
    justifyContent: 'space-between',
    width: screenWidth - 70,
  },

  textHeader: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    lineHeight: 20,
    color: Colors.white,
    marginRight: 10,
  },

  especialidadesContainer: {
    width: screenWidth,
    height: '100%',
    backgroundColor: Colors.white,
    paddingTop: 21,
    paddingBottom: 21,
  },
  textEspecialidades: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: Fonts.regular,

    color: Colors.black,
    opacity: 0.5,
  },

  textLoading: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    opacity: 0.4,
    padding: 10,
  },
  loading: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Dimensions.get('window').height / 3,
  },
  searchContainer: {
    backgroundColor: Colors.smokeWhite,
    paddingBottom: 10,
    paddingTop: 10,
    alignItems: 'center',
    flex: 1,
  },
  scroll: {
    height: '100%',
    width: screenWidth,
    marginBottom: 10,
    borderRadius: 4,
  },
  scrollSearch: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textResultadoPesquisa: {
    fontFamily: Fonts.regular,
    fontStyle: 'normal',
    fontSize: 14,
    lineHeight: 17,
    opacity: 0.4,
    marginBottom: 8,
    alignSelf: 'center',
    width: screenWidth - 30,
  },

  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: screenWidth,
    maxWidth: 630,
    marginTop: 10,
    marginBottom: 8,
    paddingLeft: 24,
    paddingRight: 24,
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  text: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: Fonts.bold,

    color: Colors.blue,
  },

  modalText: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: Fonts.bold,
    opacity: 0.7,
    textAlign: 'center',
    color: Colors.black,
  },
  containerModalCancelar: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7E7E7E',
  },
  modalCancelar: {
    width: screenWidth - 50,
    maxWidth: 530,
    paddingHorizontal: 25,
    paddingVertical: 30,

    backgroundColor: 'white',
    alignSelf: 'center',

    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.softGray,
  },
  touchableButton: {
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  cancelarButtonModal: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  cancelarButtonBorder: {
    width: '100%',

    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.blue,
    padding: 15,

    backgroundColor: 'white',

    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelarButtonText: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: Fonts.bold,

    color: Colors.blue,
  },
  voltarButton: {
    width: '100%',
    height: 38,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 4,

    backgroundColor: 'white',
  },
  voltarButtonText: {
    fontSize: 14,
    lineHeight: 17,
    fontFamily: Fonts.bold,

    color: Colors.black,
  },
  modalTitle: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    color: Colors.black,
    opacity: 0.5,
    marginBottom: 15,
  },
})
