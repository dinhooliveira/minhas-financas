import { DatabaseConnection } from '../databaseConnection';
import Despesa from '../entity/Despesa';
import TipoDespesa from '../entity/TipoDespesa';
import { brazilToUSAFormat } from '../../resource/helper/Data';


const table = "despesa";
const db = DatabaseConnection.getConnection();
export default class ReceitaRepository {

    static filter = [];

    static queryBuild() {

        let filterSQl = ``;
        if (this.filter.length > 0) {
            filterSQl += ` WHERE `;
            filterSQl += this.filter.join(" AND ");
        }
        return `
                    SELECT
                    ${table}.*,
                    STRFTIME('%d/%m/%Y', ${table}.data) AS despesa_data , 
                    STRFTIME('%d/%m/%Y', ${table}.data_registro) AS despesa_data_registro,
                    tipo_despesa.descricao AS tipo_despesa_descricao,
                    tipo_despesa.data_registro AS tipo_despesa_data_registro
            FROM 
                ${table} 
            INNER JOIN tipo_despesa ON tipo_despesa.id = despesa.tipo_despesa_id
            ${filterSQl}
            ORDER BY despesa.data DESC   
       `;
    };

    static async findAll() {

        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(this.queryBuild(), []
                ,
                (_, { rows }
                ) => {
                    const result = [];
                    // console.log(rows);
                    if (rows.length > 0) {
                        rows._array.forEach(despesa => {
                            result.push(new Despesa()
                                .setDescricao(despesa.descricao)
                                .setId(despesa.id)
                                .setData(despesa.despesa_data)
                                .setDataRegistro(despesa.despesa_data_registro)
                                .setTipoDespesaId(despesa.tipo_despesa_id)
                                .setValor(despesa.valor)
                                .setTipoDespesa(
                                    new TipoDespesa()
                                        .setDescricao(despesa.tipo_despesa_descricao)
                                        .setId(despesa.tipo_despesa_id)
                                        .setDataRegistro(despesa.tipo_despesa_data_registro)
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

    static create(despesa: Despesa) {
        const now = new Date();
        const data_registro = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
        const hora_registro = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        return new Promise((resolve, reject) => db.transaction(
            tx => {
                tx.executeSql(`insert into ${table} (descricao,valor,tipo_despesa_id,data,data_registro,hora_registro) 
                values (?,?,?,?,?,?)`,
                    [despesa.getDescricao(), despesa.getValor(), despesa.getTipoDespesaId(), despesa.getData(), data_registro, hora_registro],
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

    static update(despesa: Despesa) {
        return new Promise((resolve, reject) => db.transaction(
            tx => {
                tx.executeSql(`update  ${table} set descricao = ? ,valor =? ,tipo_despesa_id =? ,data =? where id = ?`,
                    [despesa.getDescricao(), despesa.getValor(), despesa.getTipoDespesaId(), despesa.getData(), despesa.getId()],
                    (_, rs) => {
                        console.log(rs);
                        resolve(true)
                    }), (sqlError) => {
                        reject(false);
                        console.log(sqlError);
                    }
            }, (txError) => {
                reject(false);
                console.log(txError);
            }));
    }


    static setDataInicio(data) {
        if (data) {
            this.filter.push(`despesa.data >= date('${brazilToUSAFormat(data)}')`);
        }

        return this;
    }

    static setDataFinal(data) {
        this.filter.push(`despesa.data <= date('${brazilToUSAFormat(data)}')`);
        return this;
    }

    static delete(id) {
        return new Promise((resolve, reject) => db.transaction((tx) => {
            tx.executeSql(`DELETE FROM  ${table} WHERE id=?`, [id],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }), (sqlError) => {
                    console.log(sqlError);
                    reject(sqlError);
                }
        }, (txError) => {
            console.log(txError);
            reject(txError);
        }));
    }


    static async get() {

        // console.log(this.queryBuild());
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(this.queryBuild(), [], (_, { rows }) => {
                const result = [];
                // console.log(rows);
                if (rows.length > 0) {
                    rows._array.forEach(despesa => {
                        result.push(new Despesa()
                            .setDescricao(despesa.descricao)
                            .setId(despesa.id)
                            .setData(despesa.despesa_data)
                            .setDataRegistro(despesa.despesa_data_registro)
                            .setTipoDespesaId(despesa.tipo_despesa_id)
                            .setValor(despesa.valor)
                            .setTipoDespesa(
                                new TipoDespesa()
                                    .setDescricao(despesa.tipo_despesa_descricao)
                                    .setId(despesa.tipo_despesa_id)
                                    .setDataRegistro(despesa.tipo_despesa_data_registro)
                            )
                        );
                    });
                }
                // console.log(result)
                resolve(result)
            }), (sqlError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
    }

    static clearFilter() {
        this.filter = [];
        return this;
    }


}

