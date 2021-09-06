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
} from 'react-native';
import ReceitaRepository from '../../database/repository/ReceitaRepository';
import moedaIMG from '../../assets/icon/moeda.png';

export default function ReceitaListScreen({ navigation }) {

    const isFocused = useIsFocused();
    useEffect(() => {
        getReceitas();
    }, [isFocused]);

    const [receitas, setReceitas] = useState([]);
    const [refreshing, setRefreshing] = useState(false);


    getReceitas = async () => {
        const receitasResult = await ReceitaRepository.findAll();
        if (receitasResult.length > 0) {
            setReceitas(receitasResult);
            return;
        }
        setReceitas([]);

    }

    getReceitasByData = async () => {
        const receitas = await ReceitaRepository.findBy();
        if (receitas.length > 0) {
            setReceitas(receitas);
        } else {
            setReceitas([]);
        }
    }

    const onRefresh = useCallback(() => {
        getReceitas();
    });

    function ShowList({ receitas }) {
        if (receitas.length > 0) {
            return <FlatList
                style={styles.containerList}
                data={receitas}
                extraData={receitas}
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={({ item }) => {
                    return (
                        <View
                            style={{ flexWrap: 'wrap' }}
                            key={Number(item.id)}
                            style={styles.item}>
                            <Text> ( {item.id} )  {item.descricao}
                                {'\n'} Data: {item.data}
                                {'\n'} Registrado Em: {item.dataRegistro}
                                {'\n'} tipo: {item.tipoReceitaId}
                                {'\n'}R$ {mascaraTextMoedaPTBR(item.valor)
                                }</Text>
                        </View>
                    )
                }}
            />
        }
        return <View style={{ marginTop: 100, alignItems: 'center', alignSelf: 'center' }}><Text>Sem receitas para exibir</Text></View>
    }

    return (
        <SafeAreaView
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <TouchableOpacity style={styles.buttonRefresh} title="add" onPress={() => getReceitasByData()}>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonAdd} title="add" onPress={() => navigation.navigate('receita')}>
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
                <ShowList receitas={receitas} />

            </ScrollView>

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
        width: 70,
        height: 70,
        padding: 10,
        position: 'absolute',
        top: 20,
        left: 20,
        borderRadius: 50,
        backgroundColor: 'blue',
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
        borderBottomColor:'#ccc',
        borderBottomWidth:1
    
    },
});