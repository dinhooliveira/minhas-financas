import React from 'react';

import {
    StyleSheet
    , View
} from 'react-native';


export default function LancamentoContainer({ elements }) {

    return (
        <View style={styles.container}>
            {elements()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginBottom: 100,
        padding: 10,
    }
});