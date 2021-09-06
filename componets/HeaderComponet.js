import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

export default function HeaderComponent({ title }) {

    return (
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    header: {
        backgroundColor: '#2b7147d1',
        marginTop: StatusBar.currentHeight,
        paddingBottom: 20,
        paddingTop: 20
    },
    title: {
        color: '#fff',
        marginTop: 'auto',
        textAlign: 'center',
        fontSize: 18
    }
});
