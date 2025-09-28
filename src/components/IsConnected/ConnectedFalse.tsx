import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet,  Animated, Dimensions } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../styles/Colors';
import Fonts from "../../styles/Fonts";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ConnectedFalse() {
    return (
        <View style={styles.container}>
            <View style={styles.warningContainer}>
                <AntDesign name="warning" size={24} color={Colors.white} />
                <Text style={styles.textWarning}> Não Conectado</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E20613',
        width: screenWidth,
        height: screenHeight/9,
        justifyContent: 'flex-end',
    },
    warningContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        paddingBottom: 10,
    },
    textWarning: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        lineHeight: 19,
        color: Colors.white
    },
})
