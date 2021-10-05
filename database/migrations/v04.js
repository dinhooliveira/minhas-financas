const  version = [
    `INSERT INTO tipo_receita (descricao,data_registro) VALUES ('CLT',CURRENT_TIMESTAMP);`,
    `INSERT INTO tipo_receita (descricao,data_registro) VALUES ('Aluguel',CURRENT_TIMESTAMP);`,
    `INSERT INTO tipo_receita (descricao,data_registro) VALUES ('Indenização e Restituição',CURRENT_TIMESTAMP);`,
    `INSERT INTO tipo_receita (descricao,data_registro) VALUES ('Investimento',CURRENT_TIMESTAMP);`,
    `UPDATE tipo_receita SET data_registro = CURRENT_TIMESTAMP,descricao = 'Serviço' WHERE id = 1; `,
    `UPDATE tipo_receita SET data_registro = CURRENT_TIMESTAMP,descricao = 'Venda' WHERE id = 2;`
];

export default version;