import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import imgReceita from '../../assets/icon/receita.png';
import imgDespesa from '../../assets/icon/despesas.png';
import imgDeleteBanco from '../../assets/icon/excluir-banco-de-dados.png'
import HomeButton from './HomeButton';
import { color } from '../../resource/const/Color';
import {DatabaseConnection} from '../../database/databaseConnection';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.containerHomeButtons} >
            <StatusBar
                animated={true}
                backgroundColor={color.primary}
            />
            <HomeButton title="Receita" image={imgReceita} actionClick={() => { navigation.navigate('receita_lista') }} />
            <HomeButton title="Despesa" image={imgDespesa} actionClick={() => { navigation.navigate('despesa_lista') }} />
            <HomeButton title="Deletar Banco" image={imgDeleteBanco} actionClick={() => {DatabaseConnection.deleteDataBase() }} />
        </View>
    );
}

const styles = StyleSheet.create({
    containerHomeButtons: {
        flex: 1,
        backgroundColor: color.white,
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        flexWrap: 'wrap'
    }
});
