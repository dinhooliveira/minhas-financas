import React from 'react';

import {
    StyleSheet
    , Text
    , View
} from 'react-native';

import { color as Color } from '../../resource/const/Color';

export default function LancamentoItem({ descricao, tipoDescricao, data, dataRegistro, valor, tipoLancamento, buttonActionRender }) {

    let color = Color.primary;
    if (tipoLancamento == 'despesa') {
        color = 'red';
    }

    return (
        <View
            style={styles.item}>
            <View style={{ flexDirection: 'column', width: '100%' }}>
                <View style={{ flexDirection: 'row', textAlign: 'center', width: '100%' }}>
                    <View style={{ width: '70%' }}>
                        <Text style={{ fontSize: 20, color: 'grey', width: '100%', fontWeight: 'bold' }}>
                            {descricao}
                        </Text>
                        <Text style={{ fontSize: 20, color: Color.primary, width: '100%', fontStyle: 'italic' }}>
                            {tipoDescricao}
                        </Text>
                        <Text style={{ fontSize: 12, color: 'grey', width: '100%' }}>
                            DATA: {data}
                        </Text>
                        <Text style={{ fontSize: 12, color: 'grey', width: '100%' }}>
                            DATA LANÇAMENTO: {dataRegistro}
                        </Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignSelf: 'flex-start', width: '30%' }}>
                        {typeof buttonActionRender === 'function' ? buttonActionRender() : ''}
                    </View>
                </View>

                <View>
                    <Text style={{ fontSize: 30, color, alignSelf: 'flex-end' }}>R$ {valor}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        padding: 10,
        fontSize: 18,
        minHeight: 100,
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1

    }
});