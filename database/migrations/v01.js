const  version = [
      `CREATE TABLE IF NOT EXISTS tipo_receita (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao DATE,
            data_registro DATETIME
     
        );`,
        `CREATE TABLE IF NOT EXISTS receita (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao TEXT,
            tipo_receita_id INTEGER,
            valor REAL,
            data DATE,
            data_registro DATE,
            hora_registro HOUR,
            FOREIGN KEY (tipo_receita_id) REFERENCES tipo_receita (id)
        );`,        
        `INSERT INTO tipo_receita (descricao,data_registro) VALUES ('serviço','NOW()');`,
        `INSERT INTO tipo_receita (descricao,data_registro) VALUES ('venda','NOW()');`,
];

export default version;
