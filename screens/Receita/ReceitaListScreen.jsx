import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect, useCallback, Fragment } from 'react';
import {
    SafeAreaView
    , StyleSheet
    , Text
    , TouchableOpacity
    , ScrollView
    , View
    , RefreshControl
    , Image
    , Modal
    , Alert
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import ReceitaRepository from '../../database/repository/receita/ReceitaRepository';
import moedaIMG from '../../assets/icon/moeda-receita.png';
import filtroIMG from '../../assets/icon/filtro.png';
import { color } from '../../resource/const/Color';
import ButtonRoundSmall from '../../componets/ButtonRoundSmall';
import LancamentoItem from '../../componets/Lancamento/LancamentoItem';
import { mascaraTextMoedaPTBR } from '../../resource/helper/Moeda';
import LancamentoContainer from '../../componets/Lancamento/LancamentoContainer';

export default function ReceitaListScreen({ navigation }) {

    const isFocused = useIsFocused();
    useEffect(() => {
        getReceitas();
    }, [isFocused]);

    const dataInicio = () => {
        const date = new Date();
        return `01/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const dataFim = () => {
        const today = new Date();
        const date = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const [receitas, setReceitas] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [dataInicial, setDataInicial] = useState(dataInicio());
    const [dataFinal, setDataFinal] = useState(dataFim());
    const [valorTotal, setValorTotal] = useState(0);


    const getReceitas = async () => {
        const receitasResult = await ReceitaRepository
            .clearFilter()
            .setDataInicio(dataInicial)
            .setDataFinal(dataFinal)
            .get();

        if (receitasResult.length > 0) {
            setReceitas(receitasResult);
            getValorTotal(receitasResult);
            return;
        }
        setReceitas([]);


    }

    const deleteReceita = async (id) => {
        Alert.alert(
            'Atenção',
            'Deseja efetuar a exclusão?',
            [
                {
                    text: "Confirmar",
                    onPress: async () => {
                        const receitaResult = await ReceitaRepository.delete(id);
                        // console.log(receitaResult);
                        alert("Excluido com sucesso!");
                        getReceitas();
                    },
                    style: "confirm",
                },
                {
                    text: "Cancel",
                    onPress: () => { console.log('cancelou') },
                    style: "cancel",
                },
            ]);
    }

    const onRefresh = useCallback(() => {
        getReceitas();
    });

    const getValorTotal = (receitas) => {
        let valor = 0;
        receitas.forEach((item) => {
            valor += item.getValor();
        });
        setValorTotal(valor);
    }


    const ShowList = ({ receitas }) => {
        if (receitas.length > 0) {
            return <LancamentoContainer elements={
                () => receitas.map((item) => {
                    return (
                        <LancamentoItem
                            key={item.getId()}
                            descricao={item.getDescricao()}
                            tipoDescricao={item.getTipoReceita().getDescricao()}
                            data={item.getData()}
                            dataRegistro={item.getDataRegistro()}
                            valor={item.getValorPtBR()}
                            buttonActionRender={
                                () => (
                                    <Fragment>
                                        <ButtonRoundSmall
                                            typeAction="edit"
                                            actionClick={() => { navigation.navigate('receita_editar', { receita: item }) }}
                                        />

                                        <ButtonRoundSmall
                                            typeAction="delete"
                                            actionClick={() => deleteReceita(item.id)}
                                        />
                                    </Fragment>
                                )

                            }

                        />
                    );

                })}
            />
        }
        return <View style={{ marginTop: 100, alignItems: 'center', alignSelf: 'center' }}><Text>Sem receitas para exibir</Text></View>
    }

    return (
        <SafeAreaView
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={{ zIndex: 3, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity style={styles.buttonTop} title="add" onPress={() => setModalVisible(true)}>
                    <Image source={filtroIMG} />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: 20, color: color.primary }}>{mascaraTextMoedaPTBR(valorTotal)}</Text>
                </View>
                <TouchableOpacity style={styles.buttonTop} title="add" onPress={() => navigation.navigate('receita')}>
                    <Image source={moedaIMG} />
                </TouchableOpacity>
            </View>


            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <ShowList receitas={receitas} />
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}

            >
                <View style={styles.modalView}>
                    <Text>FILTRO</Text>

                    <DatePicker
                        style={{ borderBottomWidth: 1, borderBottomColor: color.primary, width: '100%', fontSize: 20 }}
                        format="DD/MM/YYYY"
                        date={dataInicial} // Initial date from state
                        mode="date" // The enum of date, datetime and time
                        onDateChange={(date) => {
                            setDataInicial(date);
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

                    <DatePicker
                        style={{ borderBottomWidth: 1, borderBottomColor: color.primary, width: '100%', fontSize: 20 }}
                        format="DD/MM/YYYY"
                        date={dataFinal} // Initial date from state
                        mode="date" // The enum of date, datetime and time
                        onDateChange={(date) => {
                            setDataFinal(date);
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

                    <View style={{ flexGrow: 2, flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
                        <TouchableOpacity style={{
                            width: 100,
                            height: 50,
                            backgroundColor: 'red',
                            justifyContent: 'center',
                            alignContent: 'center',
                            textAlign: 'center',
                            borderRadius: 10
                        }}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={{ color: '#fff', alignSelf: 'center' }}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            width: 100,
                            height: 50,
                            backgroundColor: color.primary,
                            justifyContent: 'center',
                            alignContent: 'center',
                            textAlign: 'center',
                            borderRadius: 10
                        }}
                            onPress={() => { getReceitas(); setModalVisible(false) }}
                        >
                            <Text style={{ color: '#fff', alignSelf: 'center' }}>Aplicar</Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </Modal>

        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    buttonTop: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 70,
        padding: 10,
        borderRadius: 50,
    },
    modalView: {
        marginTop: '70%',
        backgroundColor: "white",
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        height: '100%',
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
});