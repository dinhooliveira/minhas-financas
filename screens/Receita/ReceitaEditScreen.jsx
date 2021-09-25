import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Picker } from 'react-native';
import { color } from '../../resource/const/Color';
import DatePicker from 'react-native-datepicker';
import TipoReceitaRepository from '../../database/repository/receita/TipoReceitaRepository';
import ReceitaRepository from '../../database/repository/receita/ReceitaRepository';
import { mascaraIputMoedaPTBR, removeMascaraMoedaPtBrParaFloat } from '../../resource/helper/Moeda';

export default function ReceitaEditScreen({ route, navigation }) {

    const { receita } = route.params;
    const now = () => {
        const date = new Date();
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const [date, setDate] = useState(now());
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [tipoReceitaId, setTipoReceitaId] = useState('');
    const [tiposReceita, setTiposReceita] = useState([]);

    useEffect(() => {
        console.log(receita);
        fillForm();
        getTiposReceita();
    }, []);


    const fillForm = () => {
        setDescricao(receita.getDescricao());
        setTipoReceitaId(receita.getTipoReceita().getId())
        setValor(receita.getValorPtBR());
        setDate(receita.getData())
    }

    const clearForm = () => {
        setTipoReceitaId('');
        setDescricao('');
        setValor('');
    }

    const validateForm = () => {
        if (descricao == '' || date == '' || tipoReceitaId == '' || valor <= 0) {
            return false;
        }
        return true;
    }

    const getTiposReceita = async () => {
        const rs = await TipoReceitaRepository.findAll();
        if (rs.length > 0) {
            setTiposReceita(rs);
        }
    }

    const formaReal = useCallback((value) => {
        const valueFormat = mascaraIputMoedaPTBR(value);
        setValor(valueFormat);
    });


    const actionSave = async () => {
        if (!validateForm()) {
            alert('Preencha todos os campos!');
            return;
        }
        let data = date.split('/');
        data = `${data[2]}-${data[1].padStart(2, '0')}-${data[0].padStart(2, '0')}`;
        receita.setDescricao(descricao)
            .setValor(removeMascaraMoedaPtBrParaFloat(valor))
            .setData(data)
            .setTipoReceitaId(tipoReceitaId);
        const rs = await ReceitaRepository.update(receita);
        clearForm();
        alert('atualizado com sucesso!');
        console.log(rs);
        navigation.navigate('receita_lista');
    };


    return (

        <View style={{ padding: 10, backgroundColor: color.white, flex: 1 }}>
            <View style={styles.containerFormReceita}>
                <View style={{ width: '80%', alignSelf: 'center', marginTop: 10 }}>
                    <Text style={{ textAlign: 'left', fontSize: 20, fontWeight: 'bold' }}>Descrição</Text>
                    <TextInput
                        placeholder="Ex:. Compra de roupa na loja X"
                        placeholderTextColor="black"
                        multiline={true}
                        style={{ borderBottomWidth: 1, borderBottomColor: color.primary, width: '100%', margin: 2, padding: 10, fontSize: 20 }}
                        value={descricao}
                        onChangeText={setDescricao}
                    />
                    <Text style={{ textAlign: 'left', fontSize: 20, fontWeight: 'bold' }}>Valor</Text>
                    <TextInput
                        placeholder="R$ 000.000.000,00"
                        placeholderTextColor="black"
                        multiline={true}
                        style={{ borderBottomWidth: 1, borderBottomColor: color.primary, width: '100%', margin: 2, padding: 10, fontSize: 20 }}
                        value={valor}
                        onChangeText={formaReal}
                        keyboardType='numeric'
                    />
                    <Text style={{ textAlign: 'left', fontSize: 20, fontWeight: 'bold' }}>Data</Text>
                    <DatePicker
                        style={{ borderBottomWidth: 1, borderBottomColor: color.primary, width: '100%', fontSize: 20 }}
                        format="DD/MM/YYYY"
                        date={date} // Initial date from state
                        mode="date" // The enum of date, datetime and time
                        onDateChange={(date) => {
                            setDate(date);
                        }}
                        allowFontScaling={true}
                        showIcon={false}
                        customStyles={{
                            dateInput: {
                                borderWidth: 0
                            },
                            dateText: {
                                fontSize: 20
                            }
                        }}
                    />
                    <Text style={{ textAlign: 'left', fontSize: 20, fontWeight: 'bold' }}>Selecione um tipo</Text>
                    <Picker
                        selectedValue={tipoReceitaId}
                        style={{
                            height: 50, borderStyle: 'solid', borderWidth: 1, textAlign: 'center', transform: [
                                { scaleX: 1.1 },
                                { scaleY: 1.1 },
                            ]
                        }}
                        onValueChange={(itemValue, itemIndex) => { setTipoReceitaId(itemValue); }} a
                    >
                        <Picker.Item key={0} label="--" value="" />
                        {tiposReceita.map(tipoReceita => {
                            return <Picker.Item key={tipoReceita.getId()} label={`${tipoReceita.getDescricao()}`} value={tipoReceita.getId()} />
                        })}
                    </Picker>
                    <View style={{ marginTop: 10 }}>
                        <Button
                            title="salvar"
                            color={color.primary}
                            onPress={actionSave}
                            fontSize={50}
                            padding={10}
                        />
                    </View>

                </View>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    containerFormReceita: {
        width: '100%',
        minHeight: 200,
        paddingBottom: 20,
        backgroundColor: color.white,
        marginTop: 50

    },
    titleForm: {
        color: color.white,
        fontSize: 15,
        fontStyle: 'italic',
        fontWeight: 'bold'
    }
});