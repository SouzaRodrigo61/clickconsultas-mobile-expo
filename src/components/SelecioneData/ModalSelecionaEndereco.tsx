import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
import { RadioButton } from "react-native-paper";

const { height } = Dimensions.get("window");
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ModalSelecionaEndereco({
  show,
  close,
  list_enderecos,
  indexSelecionado,
  setIndexSelecionado,
  setStep
}) {
  const [state, setState] = useState({
    opacity: new Animated.Value(0),
    container: new Animated.Value(height),
    modal: new Animated.Value(height)
  });

  const openModal = () => {
    Animated.sequence([
      Animated.timing(state.container, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true
      }),
      Animated.timing(state.opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.spring(state.modal, {
        toValue: 0,
        bounciness: 2,
        useNativeDriver: true
      })
    ]).start();
  };

  const closeModal = () => {
    Animated.sequence([
      Animated.timing(state.modal, {
        toValue: height * 2,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(state.opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(state.container, {
        toValue: height * -1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };

  useEffect(() => {
    if (show) {
      openModal();
    } else {
      closeModal();
    }
  }, [show]);

  const [value, setValue] = useState("0");

  // useEffect(() => {
  //   setIndexSelecionado(parseInt(value));
  // }, [value]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: state.opacity,
          transform: [{ translateY: state.container }]
        }
      ]}
    >
      <Animated.View
        style={[
          styles.modal,
          {
            transform: [{ translateY: state.modal }]
          }
        ]}
      >
        <TouchableOpacity style={styles.indicator} onPress={close} />

        <Text style={styles.textTitulo}>Selecione o endereço da consulta</Text>
        <RadioButton.Group
          onValueChange={(newValue) => {
            setIndexSelecionado(parseInt(newValue));
            setStep((state) => ({ ...state, endereco: true }));
            close();
          }}
          value={indexSelecionado}
        >
          <TouchableOpacity style={styles.selectContainer}>
            {list_enderecos.map((e, index: string) => (
              <TouchableOpacity
                style={styles.select}
                key={`${e.id_endereco}-${index}`}
                onPress={() => {
                  setIndexSelecionado(index);
                  setStep((state) => ({ ...state, endereco: true }));
                  close();
                }}
              >
                <RadioButton
                  value={index}
                  color={Colors.blue}
                  uncheckedColor={Colors.softGray}
                  status={indexSelecionado === index ? "checked" : "unchecked"}
                />
                <View style={styles.selectButton}>
                  <Text
                    style={styles.text}
                  >{`${e.rua}, ${e.numero}, ${e.bairro} - ${e.cidade}, ${e.uf} - ${e.cep}`}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </RadioButton.Group>
        <TouchableOpacity
          style={styles.confirmButton}
          activeOpacity={0.7}
          onPress={() => {
            // setIndexSelecionado(index);
            setStep((state) => ({ ...state, endereco: true }));
            close();
          }}
        >
          <Text style={{ ...styles.text, color: Colors.white, opacity: 1 }}>Confirmar</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute"
  },
  modal: {
    bottom: 0,
    position: "absolute",
    height: screenHeight / 2,
    backgroundColor: Colors.white,
    width: screenWidth,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 25,
    paddingRight: 25
  },
  indicator: {
    width: 115,
    height: 6,
    backgroundColor: Colors.gray,
    borderRadius: 50,
    alignSelf: "center",
    marginTop: 10,
    paddingTop: 2,
    paddingBottom: 2
  },
  textTitulo: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    lineHeight: 19,
    marginTop: 20,
    color: Colors.blue
  },
  text: {
    color: "#111111",
    opacity: 0.7,
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 19,
    flexWrap: "wrap",
    marginLeft: 5,
    marginRight: 5
  },
  selectContainer: {
    flexDirection: "column",
    alignSelf: "center",
    width: screenWidth - 50,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderRadius: 6,
    borderColor: Colors.softGray,
    marginTop: 15
  },
  select: {
    flexDirection: "row",
    alignItems: "center",

    borderColor: Colors.softGray,
    borderBottomWidth: 1,
    borderRadius: 6,
    paddingRight: 5
  },
  selectButton: {
    flex: 1
    // padding: 10,
  },
  confirmButton: {
    marginTop: 16,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: Colors.blue
  }
});
