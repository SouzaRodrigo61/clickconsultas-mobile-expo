import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import openMap from 'react-native-open-maps';

import Colors from '../../styles/Colors';
import Fonts from "../../styles/Fonts";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CardDetalheClinica() {

    const initialRegion = {
        latitude: -23.1862746,
        longitude: -50.6566834,
        latitudeDelta: 0.01,
        longitudeDelta: 0.05,
    };

    function _goToMap() {
        //* latitude: initialRegion.latitude | longitude: initialRegion.longitude
        openMap({ provider: 'google', query: `${initialRegion.latitude},${initialRegion.longitude}` });
    }

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.textTitle}>Detalhes da clínica</Text>
            </View>
            <View style={styles.firstlayer}>
                <View>
                    <Text style={styles.textFirstLayer}>Clinica Albert Einstein</Text>
                    <Text style={styles.textAdressFirstLayer}>Rua Coronel Andrade, 574</Text>
                </View>
                <Image style={styles.img} source={require('../icons/clinicaldetail.png')} />
            </View>
            <View style={styles.secondLayer}>
                <Text style={styles.textSecondLayer}>Localidade</Text>
                <View style={styles.mapcontainer}>

                    {/* https://github.com/react-native-maps/react-native-maps */}
                    {/* https://www.mapbox.com/ */}
                    {/* https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md */}
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        region={initialRegion}
                        toolbarEnabled={false}
                        onPress={_goToMap}
                    >
                        {/* https://github.com/react-native-maps/react-native-maps/blob/master/docs/marker.md */}
                        <Marker
                            coordinate={{ latitude: -23.1862746, longitude: -50.6573834 }}
                        />
                    </MapView>

                    <View style={styles.mapfooter}><Text style={styles.textMapFooter}>Toque no mapa para ver</Text></View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        width: screenWidth - 40,
        height: 444,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: Colors.softGray,
        borderRadius: 4,
        backgroundColor: Colors.white,
        shadowColor: Colors.softGray,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 0.4,
    },
    title: {
        marginTop: 30,
        marginBottom: 16,
        marginLeft: 20,
    },
    img: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
    },
    textTitle: {
        fontFamily: Fonts.bold,
        fontSize: 20,
        lineHeight: 24,
    },
    firstlayer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: screenWidth - 80,
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.softGray,
        paddingBottom: 20
    },
    textFirstLayer: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        lineHeight: 19,
        paddingBottom: 8,
    },
    textAdressFirstLayer: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        lineHeight: 17,
    },
    secondLayer: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 18,
    },
    textSecondLayer: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        lineHeight: 16,
    },
    mapcontainer: {
        marginTop: 15,
        alignSelf: 'center',
        width: screenWidth - 80,
        height: 220,
        borderWidth: 1,
        borderColor: Colors.softGray,
        borderBottomEndRadius: 6,
        borderBottomStartRadius: 6,
    },
    mapfooter: {
        width: '100%',
        height: 42,
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
    },
    map: {
        width: '100%',
        height: 180,
    },
    textMapFooter: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        lineHeight: 17,
        marginLeft: 12,
        opacity: 0.7
    },
});