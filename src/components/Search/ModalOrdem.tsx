import React, { useEffect, useState } from 'react'
import {
  Animated,
  BackHandler,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import GestureRecognizer from 'react-native-swipe-gestures'
import Colors from '../../styles/Colors'
import Fonts from '../../styles/Fonts'

const { height } = Dimensions.get('window')
const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

interface Props {
  show: any
  close: any
  setModal: any
  filter: string
  setFilter: any
  shuffle: any
  alphabeticalOrder: any
}

export default function ModalOrdem({
  show,
  close,
  filter,
  setFilter,
  shuffle,
  alphabeticalOrder,
}: Props) {
  const [state] = useState({
    opacity: new Animated.Value(0),
    container: new Animated.Value(height),
    modal: new Animated.Value(height),
  })

  const openModal = () => {
    Animated.sequence([
      Animated.timing(state.container, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(state.opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(state.modal, {
        toValue: 0,
        bounciness: 2,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const closeModal = () => {
    Animated.sequence([
      Animated.timing(state.modal, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(state.opacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(state.container, {
        toValue: height,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const handleClick = (option: string) => {
    setFilter(option)
    console.log(option)
    if (option === 'Randômico') shuffle()
    else alphabeticalOrder()
    close()
  }

  const options: string[] = ['Randômico', 'Ordem A-Z']

  useEffect(() => {
    if (show) {
      openModal()
    } else {
      closeModal()
    }
  }, [show])

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        close()
        return true
      },
    )

    return () => backHandler.remove()
  }, [])

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: state.opacity,
          transform: [{ translateY: state.container }],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.modal,
          {
            transform: [{ translateY: state.modal }],
          },
        ]}
      >
        <GestureRecognizer
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}
          config={config}
          onSwipeDown={close}
        >
          <TouchableOpacity style={styles.indicator} onPress={close} />

          <Text style={{ ...styles.text, marginTop: 20, marginLeft: 20 }}>
            Ordenar por
          </Text>

          <View style={styles.btnContainer}>
            {options.map((option, key) => (
              <TouchableOpacity
                style={{
                  ...styles.btn,
                  backgroundColor: filter === option ? Colors.blue : 'white',
                }}
                activeOpacity={0.7}
                onPress={() => handleClick(option)}
                key={key}
              >
                <Text
                  style={{
                    ...styles.text,
                    color: filter === option ? Colors.white : '#00000050',
                  }}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GestureRecognizer>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
  },
  modal: {
    bottom: 0,
    position: 'absolute',
    height: screenHeight / 4.0,
    backgroundColor: Colors.white,
    width: screenWidth,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 25,
    paddingRight: 25,
  },
  indicator: {
    width: 115,
    height: 6,
    backgroundColor: Colors.gray,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 10,
    paddingTop: 2,
    paddingBottom: 2,
  },
  text: {
    color: Colors.black,
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 19,
  },
  btnContainer: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  btn: {
    paddingRight: 15,
    paddingLeft: 15,
    height: 35,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginRight: 10,
  },
})
