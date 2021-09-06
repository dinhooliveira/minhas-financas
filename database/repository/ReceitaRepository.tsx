import { DatabaseConnection } from '../databaseConnection';
import Receita from '../entity/Receita';

const table = "receita";
const db = DatabaseConnection.getConnection();
export default class ReceitaRepository {

    static async findAll() {

        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(
                    `select *,strftime('%d/%m/%Y',data) as data , strftime('%d/%m/%Y',data_registro) as data_registro from ${table}`
                    , []
                    ,
                    (_, { rows }
                ) => {
                    const result = [];
                    console.log(rows);
                    if (rows.length > 0) {
                        rows._array.forEach(receita => {
                            result.push(new Receita()
                                .setDescricao(receita.descricao)
                                .setId(receita.id)
                                .setData(receita.data)
                                .setDataRegistro(receita.data_registro)
                                .setTipoReceitaId(receita.tipo_receita_id)
                                .setValor(receita.valor)
                            );
                        });
                    }
                    console.log(result)
                    resolve(result)
                }), (sqlError) => {
                    console.log(sqlError);
                }
        }, (txError) => {
            console.log(txError);
        }))

    }

    static create(receita: Receita) {
        const now = new Date();
        const data_registro = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
        const hora_registro = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        return new Promise((resolve, reject) => db.transaction(
            tx => {
                tx.executeSql(`insert into ${table} (descricao,valor,tipo_receita_id,data,data_registro,hora_registro) 
                values (?,?,?,?,?,?)`,
                    [receita.getDescricao(), receita.getValor(), receita.getTipoReceitaId(), receita.getData(), data_registro, hora_registro],
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

    static async findBy() {

        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(`select *  from ${table} WHERE data BETWEEN '2021-01-20' AND '2021-01-30'`, [], (_, { rows }) => {
                const result = [];
                console.log(rows);
                if (rows.length > 0) {
                    rows._array.forEach(receita => {
                        result.push(new Receita()
                            .setDescricao(receita.descricao)
                            .setId(receita.id)
                            .setData(receita.data)
                            .setDataRegistro(receita.data_registro)
                            .setTipoReceitaId(receita.tipo_receita_id)
                            .setValor(receita.valor)
                        );
                    });
                }
                console.log(result)
                resolve(result)
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))

    }

}

