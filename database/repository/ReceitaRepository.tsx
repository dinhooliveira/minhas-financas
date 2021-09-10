import { DatabaseConnection } from '../databaseConnection';
import Receita from '../entity/Receita';
import TipoReceita from '../entity/TipoReceita';

const table = "receita";
const db = DatabaseConnection.getConnection();
export default class ReceitaRepository {

    static async findAll() {

        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(
                    `SELECT
                          ${table}.*,
                          STRFTIME('%d/%m/%Y', ${table}.data) AS receita_data , 
                          STRFTIME('%d/%m/%Y', ${table}.data_registro) AS receita_data_registro,
                          tipo_receita.descricao AS tipo_receita_descricao,
                          tipo_receita.data_registro AS tipo_receita_data_registro
                     FROM 
                         ${table} 
                    INNER JOIN tipo_receita ON tipo_receita.id = receita.tipo_receita_id
                    ORDER BY receita.data DESC`
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
                                .setData(receita.receita_data)
                                .setDataRegistro(receita.receita_data_registro)
                                .setTipoReceitaId(receita.tipo_receita_id)
                                .setValor(receita.valor)
                                .setTipoReceita(
                                    new TipoReceita()
                                    .setDescricao(receita.tipo_receita_descricao)
                                    .setId(receita.tipo_receita_id)
                                    .setDataRegistro(receita.tipo_receita_data_registro)
                                )
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

