import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const About = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>About</Text>
        </View>
    )
}

export default About;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    text: {
        fontSize: 20,
        color: '#333',
    },
});