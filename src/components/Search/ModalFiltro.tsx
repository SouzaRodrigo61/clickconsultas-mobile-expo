import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  BackHandler,
  Dimensions,
} from "react-native";
import Slider from "@react-native-community/slider";
import GestureRecognizer from "react-native-swipe-gestures";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";

const { height } = Dimensions.get("window");
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface Props {
  show: any;
  close: any;
  setModal: any;
  filter: string;
  setFilter: any;
  radius: number;
  setRadius: any;
}

export default function ModalFiltro({
  show,
  close,
  setModal,
  filter,
  setFilter,
  radius,
  setRadius,
}: Props) {
  const [state] = useState({
    opacity: new Animated.Value(0),
    container: new Animated.Value(height),
    modal: new Animated.Value(height),
  });

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
    ]).start();
  };

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
    ]).start();
  };

  useEffect(() => {
    if (show) {
      openModal();
    } else {
      closeModal();
    }
  }, [show]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        close();
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

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
            backgroundColor: "transparent",
          }}
          config={config}
          onSwipeDown={close}
        >
          <TouchableOpacity style={styles.indicator} onPress={close} />

          <Text style={{ ...styles.text, marginTop: 20, marginLeft: 20 }}>
            Filtrar por
          </Text>

          <View style={styles.btnContainer}>
            {/* <TouchableOpacity
              style={{
                ...styles.btn,
                backgroundColor: filter === "Nenhum" ? Colors.blue : "white",
              }}
              onPress={() => setFilter("Nenhum")}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  ...styles.text,
                  color: filter === "Nenhum" ? Colors.white : "#00000050",
                }}
              >
                Nenhum
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={{
                ...styles.btn,
                backgroundColor:
                  filter === "Por proximidade" ? Colors.blue : "white",
              }}
              activeOpacity={0.7}
              onPress={() => setFilter("Por proximidade")}
            >
              <Text
                style={{
                  ...styles.text,
                  color:
                    filter === "Por proximidade" ? Colors.white : "#00000050",
                }}
              >
                Por proximidade
              </Text>
            </TouchableOpacity>
          </View>

          {filter === "Por proximidade" && (
            <>
              <Text
                style={{
                  ...styles.text,
                  marginTop: 24,
                  color: Colors.blue,
                  alignSelf: "center",
                }}
              >
                {radius} Km
              </Text>
              <Slider
                style={{
                  width: screenWidth - 100,
                  height: 40,
                  alignSelf: "center",
                }}
                minimumValue={5}
                maximumValue={200}
                minimumTrackTintColor="#2fa8d5"
                maximumTrackTintColor="#000000"
                thumbTintColor="#2fa8d5"
                onValueChange={(v) => setRadius(v)}
                step={5}
                value={radius}
              />
            </>
          )}
        </GestureRecognizer>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
  },
  modal: {
    bottom: 0,
    position: "absolute",
    height: screenHeight / 3.0,
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
    alignSelf: "center",
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
    flexDirection: "row",
    marginLeft: 20,
  },
  btn: {
    paddingRight: 15,
    paddingLeft: 15,
    height: 35,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.gray,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginRight: 10,
  },
});
