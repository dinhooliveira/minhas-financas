import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Picker } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { color } from '../../resource/const/Color';
import TipoDespesaRepository from '../../database/repository/despesa/TipoDespesaRepository';
import DespesaRepository from '../../database/repository/despesa/DespesaRepository';
import { mascaraIputMoedaPTBR, removeMascaraMoedaPtBrParaFloat } from '../../resource/helper/Moeda';

export default function DespesaEditScreen({ route, navigation }) {

    const { despesa } = route.params;
    const now = () => {
        const date = new Date();
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const [date, setDate] = useState(now());
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [tipoDespesaId, setTipoDespesaId] = useState('');
    const [tiposDespesa, setTiposDepesa] = useState([]);

    useEffect(() => {
        fillForm();
        getTiposDespesa();
    }, []);


    const fillForm = () => {
        setDescricao(despesa.getDescricao());
        setTipoDespesaId(despesa.getTipoDespesa().getId())
        setValor(despesa.getValorPtBR());
        setDate(despesa.getData())
    }

    const clearForm = () => {
        setTipoDespesaId('');
        setDescricao('');
        setValor('');
    }

    const validateForm = () => {
        if (descricao == '' || date == '' || tipoDespesaId == '' || valor <= 0) {
            return false;
        }
        return true;
    }

    const getTiposDespesa = async () => {
        const rs = await TipoDespesaRepository.findAll();
        if (rs.length > 0) {
            setTiposDepesa(rs);
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
        despesa.setDescricao(descricao)
            .setValor(removeMascaraMoedaPtBrParaFloat(valor))
            .setData(data)
            .setTipoDespesaId(tipoDespesaId);
        const rs = await DespesaRepository.update(despesa);
        clearForm();
        alert('atualizado com sucesso!');
        console.log(rs);
        navigation.navigate('despesa_lista');
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
                        selectedValue={tipoDespesaId}
                        style={{
                            height: 50, borderStyle: 'solid', borderWidth: 1, textAlign: 'center', transform: [
                                { scaleX: 1.1 },
                                { scaleY: 1.1 },
                            ]
                        }}
                        onValueChange={(itemValue, itemIndex) => { setTipoDespesaId(itemValue); }}
                    >
                        <Picker.Item key={0} label="--" value="" />
                        {tiposDespesa.map(tipoDespesa => {
                            return <Picker.Item key={tipoDespesa.getId()} label={`${tipoDespesa.getDescricao()}`} value={tipoDespesa.getId()} />
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