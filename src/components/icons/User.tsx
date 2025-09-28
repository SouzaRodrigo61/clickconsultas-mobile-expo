import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface UserIconProps{
    colorIcon: string;
    sizeIcon: number;
  }


export default function User({colorIcon, sizeIcon}: UserIconProps){
    const navigation = useNavigation();
    
    return(     
    <View style={styles.buttoncontainer}>
        <AntDesign name="user" size={sizeIcon} color={colorIcon} />
    </View>                        
    )     
}

const styles = StyleSheet.create({
      buttoncontainer: {
        flex: 1,
        justifyContent: "center",
        marginLeft: 0,
        padding: 0,
      }
});