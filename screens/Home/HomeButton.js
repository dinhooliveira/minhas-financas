import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {color} from '../../resource/const/Color';
export default function HomeButton({ title, image, actionClick }) {

    const ImageButton = () => {
        if (image) {
            return <Image source={image} style={{ width: 90, height: 90 }}></Image>
        }

        return;
    }

    return (
        <TouchableOpacity style={styles.homeButton} onPress={() => { if (typeof actionClick == 'function') actionClick(); }}>
            <View>
                {ImageButton()}
                <Text style={{ textAlign: 'center', color: color.primary, fontSize: 15, fontWeight: 'bold' }}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    homeButton: {
        marginRight: '2%',
        marginTop: 10,
        backgroundColor: '#fff',
        borderStyle: 'solid',
        width: '48%',
        height: 200,
        borderStyle: 'solid',
        borderColor: color.primary,
        borderWidth: 1,
        borderRadius: 5,
        elevation: 2,
        shadowColor: color.primary,
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 5,
            width: 5
        },
        justifyContent: 'center',
        alignItems: 'center',


    }
});
