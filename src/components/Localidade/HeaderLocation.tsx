import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Fonts from "../../styles/Fonts";

interface locationProps {
      location: string;
}

export default function EncontreAgende({ location }: locationProps) {

      const navigation = useNavigation();

      function handlePress() {
            navigation.navigate('BuscarLocalidade1')
      }

      return (
            <View style={styles.container}>
                  <Text style={styles.Maintext}>Localidade</Text>
                  <View>
                        <RectButton style={styles.buttoncontainer} onPress={handlePress}>
                              <Text style={styles.Sectext}>{location}</Text>
                              <AntDesign name="down" size={12} color="#ffffff" />
                        </RectButton>
                  </View>
            </View>
      )
}

const styles = StyleSheet.create({
      container: {
            justifyContent: "center",
            marginRight: 20,
            marginTop: 12,
            marginBottom: 12,
      },
      Maintext: {
            fontFamily: Fonts.bold,
            fontStyle: 'normal',
            fontSize: 9,
            lineHeight: 10.55,
            color: '#ffffff',
            textTransform: 'uppercase',
            textAlign: 'right',
      },
      Sectext: {
            fontFamily: Fonts.light,
            fontStyle: 'normal',
            fontSize: 14,
            lineHeight: 16.41,
            color: '#ffffff',
            marginRight: 4,
            textAlign: 'right',
      },
      buttoncontainer: {
            flexDirection: 'row',
            marginTop: 4,
            padding: 4,
      }
});