import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import { NativeModules } from "react-native";

export const DatabaseConnection = {
    getConnection: () => SQLite.openDatabase("minhas-financas.db", "4"),
    deleteDataBase:() => {
        Alert.alert(
            'Atenção',
            'Deseja Excluir seu banco de dados?',
            [
                {
                    text:'Sim',
                    onPress: async () =>{
                        const sqlDir = FileSystem.documentDirectory + "SQLite/";
                        const result = await FileSystem.deleteAsync(sqlDir + "minhas-financas.db", { idempotent: true });
                        alert("deletando");
                        console.log(result);
                        NativeModules.DevSettings.reload();
                    }

                },
                {
                    text:'Não'
                }

        ]);
       
    }
};