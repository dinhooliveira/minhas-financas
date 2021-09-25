import { DatabaseConnection } from '../../databaseConnection';
import Receita from '../../entity/Receita';
import TipoReceita from '../../entity/TipoReceita'

const table = "tipo_receita";
const db = DatabaseConnection.getConnection();
export default class TipoReceitaRepository {

    static async findAll() {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select * from ${table}`, [], (_, { rows }) => {
                const tiposReceitas = [];
                rows['_array'].forEach(tipoReceita => {
                    tiposReceitas.push(
                        new TipoReceita()
                            .setId(tipoReceita.id)
                            .setDescricao(tipoReceita.descricao)
                    );
                });
                resolve(tiposReceitas);
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))

    }


    static create(receita: Receita) {
        return new Promise((resolve, reject) => db.transaction(
            tx => {
                tx.executeSql(`insert into ${table} (descricao,tipo_receita_id,data,data_registro) 
                values (?,?,?,?)`,
                    [receita.getDescricao(), receita.getTipoReceita(), 'now()', receita.getDataRegistro()],
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

