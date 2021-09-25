import { DatabaseConnection } from '../../databaseConnection';
import Receita from '../../entity/Receita';
import TipoReceita from '../../entity/TipoReceita';
import { brazilToUSAFormat } from '../../../resource/helper/Data';


const table = "receita";
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
                    STRFTIME('%d/%m/%Y', ${table}.data) AS receita_data , 
                    STRFTIME('%d/%m/%Y', ${table}.data_registro) AS receita_data_registro,
                    tipo_receita.descricao AS tipo_receita_descricao,
                    tipo_receita.data_registro AS tipo_receita_data_registro
            FROM 
                ${table} 
            INNER JOIN tipo_receita ON tipo_receita.id = receita.tipo_receita_id
            ${filterSQl}
            ORDER BY receita.data DESC   
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
                    // console.log(result)
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

    static update(receita: Receita) {
        return new Promise((resolve, reject) => db.transaction(
            tx => {
                tx.executeSql(`update  ${table} set descricao = ? ,valor =? ,tipo_receita_id =? ,data =? where id = ?`,
                    [receita.getDescricao(), receita.getValor(), receita.getTipoReceitaId(), receita.getData(),receita.getId()],
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
            this.filter.push(`receita.data >= date('${brazilToUSAFormat(data)}')`);
        }

        return this;
    }

    static setDataFinal(data) {
        this.filter.push(`receita.data <= date('${brazilToUSAFormat(data)}')`);
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

