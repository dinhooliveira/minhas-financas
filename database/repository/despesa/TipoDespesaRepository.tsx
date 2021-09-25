import { DatabaseConnection } from '../../databaseConnection';
import Despesa from '../../entity/Despesa';
import TipoDespesa from '../../entity/TipoDespesa';

const table = "tipo_despesa";
const db = DatabaseConnection.getConnection();
export default class TipoReceitaRepository {

    static async findAll() {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${table}`, [], (_, { rows }) => {
                const tiposDespesa = [];
                rows['_array'].forEach(tipoDespesa => {
                    tiposDespesa.push(
                        new TipoDespesa()
                            .setId(tipoDespesa.id)
                            .setDescricao(tipoDespesa.descricao)
                    );
                });
                resolve(tiposDespesa);

            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))

    }


    static create(despesa: Despesa) {
        return new Promise((resolve, reject) => db.transaction(
            tx => {
                tx.executeSql(`insert into ${table} (descricao,tipo_despesa_id,data,data_registro) 
                values (?,?,?,?)`,
                    [despesa.getDescricao(), despesa.getTipoDespesa(), 'now()', despesa.getDataRegistro()],
                    (_, { insertId, rows }) => {
                        console.log("id insert: " + insertId);
                        resolve(insertId)
                    }), (sqlError) => {
                        console.log(sqlError);
                    }
            }, (txError) => {
                console.log(txError);
            }));
    }
}

