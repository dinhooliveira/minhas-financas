import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import { mascaraTextMoedaPTBR } from '../../resource/helper/Moeda';
import {
    SafeAreaView
    , StyleSheet
    , Text
    , TouchableOpacity
    , ScrollView
    , FlatList
    , View
    , RefreshControl
    , Image
    , Modal
    , Alert
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import DespesaRepository from '../../database/repository/despesa/DespesaRepository';
import moedaIMG from '../../assets/icon/moeda-despesa.png';
import editarIMG from '../../assets/icon/editar.png';
import excluirIMG from '../../assets/icon/excluir.png';
import filtroIMG from '../../assets/icon/filtro.png';
import { color } from '../../resource/const/Color';

export default function DespesaListScreen({ navigation }) {

    const isFocused = useIsFocused();
    useEffect(() => {
        getDespesas();
    }, [isFocused]);

    const dataInicio = () => {
        const date = new Date();
        //console.log(date)
        return `01/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const dataFim = () => {
        const today = new Date();
        const date = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const [despesas, setDespesas] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [dataInicial, setDataInicial] = useState(dataInicio());
    const [dataFinal, setDataFinal] = useState(dataFim());



    getDespesas = async () => {
        const depesasResult = await DespesaRepository
            .clearFilter()
            .setDataInicio(dataInicial)
            .setDataFinal(dataFinal)
            .get();

        if (depesasResult.length > 0) {
            setDespesas(depesasResult);
            return;
        }
        setDespesas([]);

    }

    // deleteReceita = async (id) => {
    //     Alert.alert(
    //         'Atenção',
    //         'Deseja efetuar a exclusão?',
    //         [
    //             {
    //                 text: "Confirmar",
    //                 onPress: async () => {
    //                     const despesaResult = await DespesaRepository.delete(id);
    //                     console.log(despesaResult);
    //                     alert("Excluido com sucesso!");
    //                     this.getDespesas();
    //                 },
    //                 style: "confirm",
    //             },
    //             {
    //                 text: "Cancel",
    //                 onPress: () => { console.log('cancelou') },
    //                 style: "cancel",
    //             },
    //         ]);
    // }

    const onRefresh = useCallback(() => {
        getDespesas();
    });

    function ShowList({ despesas }) {
        if (despesas.length > 0) {
            return <FlatList
                style={styles.containerList}
                data={despesas}
                extraData={despesas}
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={({ item }) => {
                    return (
                        <View
                            style={{ flexWrap: 'wrap', width: '100%' }}
                            key={Number(item.id)}
                            style={styles.item}>

                            <View style={{ flexDirection: 'column', width: '100%' }}>
                                <View style={{ flexDirection: 'row', textAlign: 'center', width: '100%' }}>
                                    <View style={{ width: '70%' }}>
                                        <Text style={{ fontSize: 20, color: 'grey', width: '100%', fontWeight: 'bold' }}>
                                            {item.getDescricao()}
                                        </Text>
                                        <Text style={{ fontSize: 20, color: color.primary, width: '100%', fontStyle: 'italic' }}>
                                            {item.getTipoDespesa().getDescricao()}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: 'grey', width: '100%' }}>
                                            DATA: {item.getData()}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: 'grey', width: '100%' }}>
                                            DATA LANÇAMENTO: {item.getDataRegistro()}
                                        </Text>
                                    </View>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignSelf: 'flex-start', width: '30%' }}>
                                       <TouchableOpacity
                                            style={{
                                                backgroundColor: "#3498DB",
                                                padding: 10,
                                                borderRadius: 5,
                                                margin: 5,
                                                width: 40,
                                                height: 40
                                            }}
                                            onPress={()=>{navigation.navigate('despesa_editar',{despesa:item})}}
                                        >
                                            <Image source={editarIMG} style={{ width: '100%' }} />
                                        </TouchableOpacity>
                                      {/*   <TouchableOpacity
                                            style={{
                                                backgroundColor: "red",
                                                padding: 10,
                                                borderRadius: 5,
                                                margin: 5,
                                                width: 40,
                                                height: 40
                                            }}
                                            onPress={() => deleteReceita(item.id)}

                                        >
                                            <Image source={excluirIMG} style={{ width: '100%' }} />
                                        </TouchableOpacity>  */}
                                    </View>
                                </View>

                                <View>
                                    <Text style={{ fontSize: 30, color: 'red', alignSelf: 'flex-end' }}>R$ {mascaraTextMoedaPTBR(item.getValor())}</Text>
                                </View>
                            </View>
                        </View>
                    )
                }}
            />
        }
        return <View style={{ marginTop: 100, alignItems: 'center', alignSelf: 'center' }}><Text>Sem despesas para exibir</Text></View>
    }

    return (
        <SafeAreaView
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <TouchableOpacity style={styles.buttonRefresh} title="add" onPress={() => setModalVisible(true)}>
                <Image source={filtroIMG} style={{ with: '100%' }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonAdd} title="add" onPress={() => navigation.navigate('despesa_criar')}>
                <View>
                    <Image source={moedaIMG} style={{ with: '100%' }} />
                </View>
            </TouchableOpacity>

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <ShowList despesas={despesas} />

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
                            width: 100, height: 50,
                            backgroundColor: color.primary,
                            justifyContent: 'center',
                            alignContent: 'center',
                            textAlign: 'center',
                            borderRadius: 10
                        }}
                            onPress={() => { getDespesas(); setModalVisible(false) }}
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
    buttonAdd: {
        zIndex: 3,
        width: 70,
        height: 70,
        padding: 10,
        position: 'absolute',
        top: 20,
        right: 20,
        borderRadius: 50,
        backgroundColor: '#fbbc05',
        alignItems: 'center',
        alignContent: 'center',
        elevation: 11,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
    },
    buttonRefresh: {
        zIndex: 3,
        width: 50,
        height: 50,
        position: 'absolute',
        top: 20,
        left: 10,
        borderRadius: 50,
        backgroundColor: '#ffffff00',
    },
    containerList: {
        padding: 15,
        flex: 1,
        marginTop: 100,
        width: '100%'
    },
    item: {
        padding: 10,
        fontSize: 18,
        minHeight: 100,
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1

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