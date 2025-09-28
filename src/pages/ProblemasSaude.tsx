import React from 'react';
import { StyleSheet, View, Text} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CardProblemasSaude from '../components/ProblemasSaude/CardProblemasSaude';
import NavBar from '../components/NavBar';

export default function ProblemasSaude() {
    return(
        <View style={styles.container}>
            <ScrollView style={styles.scrollcontainer} showsVerticalScrollIndicator={false}>
                <CardProblemasSaude/>
            </ScrollView>
            <View style={styles.navcontainer}>
                <NavBar setSelected={[0,0,0]}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%'
    },
    
    scrollcontainer: {
        margin: 15
    },

    navcontainer: {
        position: 'relative',
        bottom: 0,
    }
})