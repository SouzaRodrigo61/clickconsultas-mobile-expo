import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Carousel, {
  ParallaxImage,
  Pagination,
} from "react-native-snap-carousel";

import Colors from "../styles/Colors";
import Fonts from "../styles/Fonts";
import StatusBar from "../components/StatusBar";

const ENTRIES: any = [
  {
    image: require("../images/bemvindo.png"),
  },
  {
    image: require("../images/bemvindo.png"),
  },
  {
    image: require("../images/bemvindo.png"),
  },
];

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function BemVindo() {
  const navigation = useNavigation();

  function handleNavigateToEntrar() {
    navigation.navigate("Entrar");
  }

  function handleNavigateCadastro() {
    navigation.navigate("Cadastro");
  }

  const [entries, setEntries] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    setEntries(ENTRIES);
  }, []);

  const renderItem = ({ item, index }, parallaxProps) => {
    return (
      <View style={styles.item}>
        <ParallaxImage
          source={item.image}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.5}
          showSpinner={true}
          spinnerColor={Colors.blue}
          {...parallaxProps}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar />

      <Image
        source={require("../images/logotipo-clickconsultas-horizontal.png")}
        style={styles.topLogo}
      />

      <View style={styles.carouselContainer}>
        <Carousel
          ref={carouselRef}
          layout={"default"}
          sliderWidth={screenWidth}
          sliderHeight={screenHeight}
          itemWidth={screenWidth - 64}
          itemHeight={screenHeight - 64}
          data={entries}
          renderItem={renderItem}
          onSnapToItem={(index) => setActiveSlide(index)}
          hasParallaxImages={true}
        />
        <Pagination
          dotsLength={entries.length} // also based on number of sildes you want
          activeDotIndex={activeSlide}
          containerStyle={{
            alignSelf: "center",
          }}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 10,
            backgroundColor: Colors.blue,
          }}
          inactiveDotStyle={{
            backgroundColor: Colors.smokeWhite,
            borderWidth: 1,
            borderColor: Colors.blue,
          }}
          inactiveDotOpacity={0.5}
          inactiveDotScale={0.7}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonEntrar}
          onPress={handleNavigateToEntrar}
          activeOpacity={0.5}
        >
          <Text style={styles.textButtonEntrar}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonCadastro}
          onPress={handleNavigateCadastro}
          activeOpacity={0.5}
        >
          <Text style={styles.textButtonCadastro}>Efetuar cadastro</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.backCircle} />
      <View style={styles.backCircle2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    zIndex: 1,
    elevation: 1,
  },

  backCircle: {
    position: "absolute",
    top: screenHeight / 2,
    alignSelf: "center",
    backgroundColor: Colors.white,
    width: screenHeight,
    height: screenHeight,
    borderRadius: screenWidth * 100,
    zIndex: -1,
    elevation: -2,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
  },
  backCircle2: {
    position: "absolute",
    top: screenHeight / 2.005,
    alignSelf: "center",
    backgroundColor: Colors.softGray,
    opacity: 0.8,
    width: screenHeight,
    height: screenHeight,
    borderRadius: screenWidth * 100,
    zIndex: -1,
    elevation: -3,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
  },

  /* Logo */
  topLogo: {
    marginTop: screenHeight / 24,
    width: 140,
    height: 60,
    alignSelf: "center",
  },

  /* Carousel */
  carouselContainer: {
    marginTop: 36,
  },
  item: {
    width: screenWidth - 60,
    height: screenHeight - 355,
    paddingBottom: 10,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.softGray,
    shadowColor: Colors.softGray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "contain",
  },

  buttonContainer: {
    alignSelf: "center",
    width: screenWidth - 120,
  },
  buttonEntrar: {
    alignItems: "center",
    justifyContent: "center",
    height: 51,
    borderRadius: 25,
    backgroundColor: Colors.blue,
    shadowColor: Colors.softGray,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 3,
  },
  textButtonEntrar: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    lineHeight: 21,
    color: Colors.white,
  },
  buttonCadastro: {
    alignItems: "center",
    justifyContent: "center",
    height: 51,
  },
  textButtonCadastro: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    lineHeight: 19,
    color: Colors.blue,
  },
});