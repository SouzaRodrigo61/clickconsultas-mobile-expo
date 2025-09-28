import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface CalendarIconProps{
    colorIcon: string;
    sizeIcon: number;
}


export default function Calendar({colorIcon, sizeIcon}: CalendarIconProps){
    const navigation = useNavigation();
    
    return(     
    <View style={styles.buttoncontainer}>
      <Feather name="calendar" size={sizeIcon} color={colorIcon} />
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