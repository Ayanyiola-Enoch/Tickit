import { StyleSheet, Text, View, StatusBar } from 'react-native'
import React from 'react';
import { SIZES, FONTS } from '../constants';

const Home = ({navigation, route}) => {
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text style={styles.text} onPress={()=>navigation.navigate('About', {name: 'Enoch'})}>Click to move to About</Text>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    text: {
        ...FONTS.body3c,
        color: '#333',
        textDecorationLine: 'underline',
    },

});