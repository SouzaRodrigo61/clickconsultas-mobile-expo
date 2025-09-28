import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface HomeIconProps{
  colorIcon: string;
  sizeIcon: number;
}


export default function Home({colorIcon, sizeIcon}: HomeIconProps){
    const navigation = useNavigation();
    
    return(     
    <View style={styles.buttoncontainer}>
      <AntDesign name="home" size={sizeIcon} color={colorIcon} />
    </View>                        
    )     
}

const styles = StyleSheet.create({
      buttoncontainer: {
        flex: 1,
        justifyContent: "center",
      }
});