import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../../styles/Colors";
import Fonts from "../../styles/Fonts";
import Carousel from "react-native-snap-carousel";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import openMap from "react-native-open-maps";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function MultiplosEnderecos({
  nomeClinica,
  list_enderecos,
  loading,
}) {
  function _goToMap(latitude, longitude) {
    openMap({ provider: "google", query: `${latitude},${longitude}` });
  }

  const carouselRef: any = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const onPrev = useCallback(() => {
    if (carouselRef && carouselRef.current) {
      carouselRef.current.snapToPrev();
    }
  }, [carouselRef]);

  const onNext = useCallback(() => {
    if (carouselRef && carouselRef.current) {
      carouselRef.current.snapToNext();
    }
  }, [carouselRef]);

  function _renderItem({ item, index }) {


    return (
      <View>
        <View style={styles.enderecoContainer}>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.textEnderecoFirstLine}>{nomeClinica}</Text>
            <Text style={styles.textEnderecoSecondLine}>{item.endereco}</Text>
          </View>
        </View>
        <Text style={styles.textLocalidade}>Localidade</Text>
        <View style={styles.mapcontainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            toolbarEnabled={false}
            onPress={() => {
              console.log(`${item.initialRegion.latitude}, ${item.initialRegion.longitude}`)
              _goToMap(
                item.initialRegion.latitude,
                item.initialRegion.longitude
              )
            }
            }
            region={item.initialRegion}
          >
            <Marker
              key={index}
              coordinate={{
                latitude: item.initialRegion.latitude,
                longitude: item.initialRegion.longitude,
              }}
            />
          </MapView>
          <View style={styles.mapfooter}>
            <Text style={styles.textMapFooter}>Toque no mapa para ver</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Text style={styles.textHeader}>Detalhes da clínica</Text>
          <View style={styles.headerArrows}>
            <TouchableOpacity onPress={onPrev} style={{ padding: 5 }}>
              <AntDesign name="left" size={17} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onNext} style={{ padding: 5 }}>
              <AntDesign name="right" size={17} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.localContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.blue} />
          ) : (
            <View style={styles.mapContainer}>
              <Carousel
                layout={"default"}
                ref={carouselRef}
                data={list_enderecos.map((e) => ({
                  nomeClinica: "",
                  endereco: `${e.rua}, ${e.numero}, ${e.bairro}`,
                  initialRegion: {
                    latitude: e.coordenadas.y,
                    longitude: e.coordenadas.x,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  },
                }))}
                sliderWidth={screenWidth - 60}
                itemWidth={screenWidth}
                renderItem={_renderItem}
                onSnapToItem={(index) => setActiveSlide(index)}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    backgroundColor: Colors.softGray,
    paddingBottom: 10,
    paddingTop: 10,
  },
  cardContainer: {
    alignSelf: "center",
    width: screenWidth - 20,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerArrows: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textHeader: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    lineHeight: 24,
  },

  localContainer: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    borderColor: Colors.softGray,
    borderWidth: 1,
  },

  enderecoContainer: {
    width: screenWidth - 90,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: Colors.softGray,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textEnderecoFirstLine: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 19,
  },
  textEnderecoSecondLine: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 17,
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
  },

  textLocalidade: {
    width: screenWidth - 90,
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  mapContainer: {
    width: screenWidth - 90,
    alignSelf: "center",
  },
  mapcontainer: {
    width: screenWidth - 90,
    height: 300,
    borderWidth: 1,
    borderColor: Colors.softGray,
    borderBottomEndRadius: 6,
    borderBottomStartRadius: 6,
    marginBottom: 10,
    marginTop: 10,
  },
  mapfooter: {
    width: "100%",
    height: 42,
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
  },
  map: {
    width: "100%",
    height: 250,
  },
  textMapFooter: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 17,
    marginLeft: 12,
    opacity: 0.7,
  },
});
