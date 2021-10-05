const  version = [
    `INSERT INTO tipo_despesa (descricao,data_registro) VALUES ('Saúde',CURRENT_TIMESTAMP);`,
    `INSERT INTO tipo_despesa (descricao,data_registro) VALUES ('Transporte',CURRENT_TIMESTAMP);`,
    `INSERT INTO tipo_despesa (descricao,data_registro) VALUES ('Lazer',CURRENT_TIMESTAMP);`,
    `INSERT INTO tipo_despesa (descricao,data_registro) VALUES ('Aluguel',CURRENT_TIMESTAMP);`,
    `INSERT INTO tipo_despesa (descricao,data_registro) VALUES ('Manutenção',CURRENT_TIMESTAMP);`,
    `INSERT INTO tipo_despesa (descricao,data_registro) VALUES ('Imposto',CURRENT_TIMESTAMP);`,
    `INSERT INTO tipo_despesa (descricao,data_registro) VALUES ('Cuidado Pessoal',CURRENT_TIMESTAMP);`,
    `INSERT INTO tipo_despesa (descricao,data_registro) VALUES ('Seguro',CURRENT_TIMESTAMP);`,
    `UPDATE tipo_despesa SET data_registro = CURRENT_TIMESTAMP WHERE id IN (1,2)`
];

export default version;